import requests
from requests.exceptions import RequestException

SEARCH_URL = "https://world.openfoodfacts.org/cgi/search.pl"


def search_products_by_category(category_tag, page_size=8):
    params = {
        "search_terms": "",
        "tagtype_0": "categories_tags",
        "tag_contains_0": "contains",
        "tag_0": category_tag,
        "page_size": page_size,
        "json": 1,
        "fields": "code,product_name,brands,nutriscore_grade,nova_group,nutrient_levels,image_url"
    }

    try:
        response = requests.get(SEARCH_URL, params=params, timeout=5)
        response.raise_for_status()
        return response.json().get("products", [])
    except RequestException as e:
        print("⚠ OFF search failed:", e)
        return []


def calculate_health_score(product):
    score = 0

    nutri = product.get("nutriscore_grade", "").lower()
    nova = product.get("nova_group", 4)
    nutrient_levels = product.get("nutrient_levels", {})

    nutri_map = {"a": 5, "b": 4, "c": 3, "d": 2, "e": 1}
    score += nutri_map.get(nutri, 0)

    if nova == 1:
        score += 4
    elif nova == 2:
        score += 3
    elif nova == 3:
        score += 2

    if nutrient_levels.get("salt") != "high":
        score += 1
    if nutrient_levels.get("saturated-fat") != "high":
        score += 1
    if nutrient_levels.get("sugars") != "high":
        score += 1

    return score


def recommend_alternatives(category_tag, exclude_barcode):
    products = search_products_by_category(category_tag)

    alternatives = []

    for p in products:
        if p.get("code") == exclude_barcode:
            continue

        score = calculate_health_score(p)

        if score >= 7:
            alternatives.append({
                "barcode": p.get("code"),
                "name": p.get("product_name", "Unknown"),
                "brand": p.get("brands", ""),
                "nutriscore": p.get("nutriscore_grade", "N/A"),
                "nova_group": p.get("nova_group", "N/A"),
                "image": p.get("image_url"),
                "health_score": score
            })

    alternatives.sort(key=lambda x: x["health_score"], reverse=True)

    return alternatives[:3]
