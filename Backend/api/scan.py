from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from pymongo.database import Database

from db.session import get_db
from models.user import User
from services.additives_service import get_additives_details
from services.auth_service import get_current_user
from services.recommend_service import calculate_health_score, recommend_alternatives
from services.service import fetch_product
from services.translation_service import translate_product

router = APIRouter()


class ScanRequest(BaseModel):
    barcode: str


class TranslationRequest(BaseModel):
    target_language: str
    product: dict


@router.post("/translate")
def translate_scan_report(data: TranslationRequest, user: User = Depends(get_current_user)):
    try:
        return translate_product(data.product, data.target_language)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    except Exception as error:
        raise HTTPException(status_code=502, detail="The report could not be translated right now") from error


@router.post("/")
def scan_product(data: ScanRequest, db: Database = Depends(get_db), user: User = Depends(get_current_user)):
    barcode = data.barcode

    response = fetch_product(barcode)

    if not response or response.get("success") is False:
        error_message = response.get("message", "Product not found") if response else "Product not found"
        raise HTTPException(status_code=404, detail=error_message)

    if response.get("status") != 1:
        raise HTTPException(status_code=404, detail="Product not found")

    product = response.get("product", {})

    nutriments = product.get("nutriments", {})
    additives_tags = product.get("additives_tags", [])
    additives_details = get_additives_details(additives_tags)

    allergen_tags = product.get("allergens_tags", [])
    allergens = []
    for tag in allergen_tags:
        allergen = tag.replace("en:", "").lower()
        allergens.append(allergen)

    categories = product.get("categories_tags", [])
    main_category = categories[0] if categories else None

    user_allergens = user.allergens or []
    if isinstance(user_allergens, str):
        user_allergens = [item.strip() for item in user_allergens.split(",") if item.strip()]
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
        "brand": product.get("brands") or "Unknown Brand",
        "quantity": product.get("quantity") or product.get("serving_size") or "15",
        "image": product.get("image_url"),
        "grade": product.get("nutrition_grades") or product.get("nutriscore", {}).get("score") or "C",
        "nova_group": product.get("nova_group") or "N/A",
        "energy": nutriments.get("energy-kcal_100g") or 0,
        "saturated_fat": nutriments.get("saturated-fat_100g") or 0,
        "protein": nutriments.get("proteins_100g") or 0,
        "sodium": nutriments.get("sodium_100g") or 0,
        "sugar": nutriments.get("sugars_100g") or 0,
        "ingredients": product.get("ingredients_text") or "Not available",
        "additives": additives_details,
        "allergens": allergens,
        "health_score": health_score,
        "recommendation": recommendation,
        "alternative_products": alternatives,
        "user_allergen_warning": matched_allergens,
    }

    db["scan_history"].insert_one({
        "user_id": user.id,
        "product_data": result,
        "created_at": datetime.utcnow(),
    })

    return result
