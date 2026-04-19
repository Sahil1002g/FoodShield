# import requests

# def fetch_product(barcode: str):
#     url = f"https://world.openfoodfacts.org/api/v2/product/{barcode}.json"
#     response = requests.get(url, timeout=120)
#     return response.json()


import requests

def fetch_product(barcode: str):
    url = f"https://world.openfoodfacts.net/api/v2/product/{barcode}.json"
            

    try:
        response = requests.get(url, timeout=60)

        # ✅ Check status code
        if response.status_code != 200:
            return {
                "success": False,
                "message": f"API error: HTTP {response.status_code}"
            }

        # ✅ Check if response is empty
        if not response.text or response.text.strip() == '':
            return {
                "success": False,
                "message": "Empty response from API"
            }

        # ✅ Safe JSON parsing with explicit error handling
        try:
            data = response.json()
            return data
        except (ValueError, requests.exceptions.JSONDecodeError) as json_err:
            return {
                "success": False,
                "message": f"Invalid JSON response from API: {str(json_err)}"
            }

    except requests.exceptions.Timeout:
        return {
            "success": False,
            "message": "API request timeout (exceeded 20 seconds)"
        }

    except requests.exceptions.ConnectionError:
        return {
            "success": False,
            "message": "Failed to connect to OpenFoodFacts API"
        }

    except requests.exceptions.RequestException as e:
        return {
            "success": False,
            "message": f"API request failed: {str(e)}"
        }