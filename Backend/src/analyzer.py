HARMFUL_INGREDIENTS = {
"palmolein": "High saturated fat",
"ins 627": "Not recommended for children",
"ins 631": "May cause headaches",
"maltodextrin": "High glycemic index"
}


def analyze(ingredients):
    warnings = []
    for ing in ingredients:
        for key in HARMFUL_INGREDIENTS:
            if key in ing:
                warnings.append({
                    "ingredient": ing,
                     "warning": HARMFUL_INGREDIENTS[key]
         })
    return warnings