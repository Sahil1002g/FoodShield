from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from services.service import fetch_product
from services.detection_service import analyze_product
from models.scan_history import ScanHistory
from db.session import get_db

from services.additives_service import get_additives_details
from services.recommend_service import calculate_health_score, recommend_alternatives
from services.auth_service import get_current_user
from models.user import User
from models.scan_history import ScanHistory




router = APIRouter()

class ScanRequest(BaseModel):
    barcode: str




@router.post("/")
def scan_product(
    data: ScanRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    barcode = data.barcode

    response = fetch_product(barcode)

    if not response or response.get("status") != 1:
        raise HTTPException(status_code=404, detail="Product not found")

    product= response.get("product", {})

    nutriments = product.get("nutriments", {})
    additives_tags = product.get("additives_tags", [])
    additives_details = get_additives_details(additives_tags)

    allergen_tags=product.get("allergens_tags",[])
    allergens=[]
    for tag in allergen_tags:
        allergen=tag.replace("en:", "").lower()
        allergens.append(allergen)

    categories = product.get("categories_tags", [])
    main_category = categories[0] if categories else None

    user_allergens = user.allergens or []
    user_allergens = [a.lower() for a in user_allergens]

    matched_allergens = list(set(allergens) & set(user_allergens))

    health_score = calculate_health_score(product)

    if health_score >= 8:
        recommendation = "Highly Recommended"
    elif health_score >= 5:
        recommendation = "Moderately Safe"
    else:
        recommendation = "Not Recommended"

    alternatives = []
    if recommendation == "Not Recommended" and main_category:
        alternatives = recommend_alternatives(main_category, barcode)


   

    result = {
    "barcode": barcode,
    "product_name": product.get("product_name") or "Unknown Product",
    "brand": product.get("brands") or "",
    "quantity": product.get("quantity") or product.get("serving_size") or "N/A",
    "image": product.get("image_url"),
    
    "grade": product.get("nutrition_grades") or product['nutriscore'].get("score") or "C",
    "nova_group": product.get("nova_group") or "N/A",
    "energy": nutriments.get("energy-kcal_100g") or 0,
    "saturated_fat": nutriments.get("saturated-fat_100g") or 0,
    "protein": nutriments.get("proteins_100g") or 0,
    "sodium": nutriments.get("sodium_100g") or 0,
    "sugar": nutriments.get("sugars_100g") or 0,
    "ingredients": product.get("ingredients_text") or "Not available",
    "additives": additives_details,
    "allergens":allergens,
    "health_score": health_score,
    "recommendation": recommendation,
    "alternative_products": alternatives,
    "user_allergen_warning": matched_allergens
}


    history = ScanHistory(
    user_id=user.id,
    product_data=result
    )

    db.add(history)
    db.commit()


    return result
