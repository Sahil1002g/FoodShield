import requests

def fetch_product(barcode: str):
    url = f"https://world.openfoodfacts.org/api/v2/product/{barcode}.json"
    response = requests.get(url, timeout=60)
    return response.json()
