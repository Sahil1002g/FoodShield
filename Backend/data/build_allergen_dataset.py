import requests
import csv
import time

BASE_URL = "https://world.openfoodfacts.org/cgi/search.pl"

PAGE_SIZE = 100
TOTAL_PAGES = 100   # 100 × 100 = 10,000

output_file = "openfoodfacts_10k_india.csv"

fields = [
    "code",
    "product_name",
    "brands",
    "ingredients_text",
    "allergens",
    "allergens_tags",
    "traces",
    "traces_tags",
    "countries"
]

with open(output_file, mode="w", newline="", encoding="utf-8") as file:
    writer = csv.writer(file)
    writer.writerow(fields)

    for page in range(1, TOTAL_PAGES + 1):

        params = {
            "search_terms": "",
            "search_simple": 1,
            "action": "process",
            "json": 1,
            "page_size": PAGE_SIZE,
            "page": page,
            "fields": ",".join(fields),

            # 👇 Filter India only
            "tagtype_0": "countries",
            "tag_contains_0": "contains",
            "tag_0": "en:india"
        }

        print(f"Fetching Indian products page {page}...")

        response = requests.get(BASE_URL, params=params)

        if response.status_code != 200:
            print("Error:", response.status_code)
            continue

        data = response.json()
        products = data.get("products", [])

        for product in products:
            writer.writerow([
                product.get("code", ""),
                product.get("product_name", ""),
                product.get("brands", ""),
                product.get("ingredients_text", ""),
                product.get("allergens", ""),
                ",".join(product.get("allergens_tags", [])),
                product.get("traces", ""),
                ",".join(product.get("traces_tags", [])),
                product.get("countries", "")
            ])

        time.sleep(0.5)

print("Indian food dataset downloaded successfully 🇮🇳🚀")
