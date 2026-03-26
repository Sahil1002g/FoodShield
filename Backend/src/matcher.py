import pandas as pd
import os

DATA_PATH = os.path.join("data", "food.parquet")

df = pd.read_parquet(
    DATA_PATH,
    columns=["product_name", "ingredients_text", "brands"],
    engine="pyarrow"
)

def match_products(ingredients):
    results = []
    ing_set = set(i.lower() for i in ingredients)

    for _, row in df.iterrows():
        if not isinstance(row["ingredients_text"], str):
            continue

        prod_ing = set(row["ingredients_text"].lower().split(","))
        score = len(ing_set & prod_ing)

        if score >= 2:
            results.append({
                "product": row["product_name"],
                "brand": row["brands"],
                "score": score
            })

    return sorted(results, key=lambda x: x["score"], reverse=True)[:5]
