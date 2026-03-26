def analyze_product(product: dict):
    return {
        "warnings": [
            "High saturated fat" if product.get("nutrient_levels", {}).get("saturated-fat") == "high" else None
        ],
        "is_vegetarian": "en:vegetarian" in product.get("labels_tags", [])
    }
