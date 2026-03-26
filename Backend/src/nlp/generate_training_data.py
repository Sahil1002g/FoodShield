import json
import re

def generate_entities(text):
    entities = []
    match = re.search(r"INGREDIENTS?:", text, re.IGNORECASE)
    if not match:
        return []

    start = match.end()
    ingredients = text[start:].split(",")

    cursor = start
    for ing in ingredients:
        ing = ing.strip()
        if ing:
            begin = text.find(ing, cursor)
            end = begin + len(ing)
            entities.append([begin, end, "INGREDIENT"])
            cursor = end

    return entities


with open("raw_ingredients.json", "r", encoding="utf-8") as f:
    data = json.load(f)

training_data = []

for item in data:
    text = item["text"]
    entities = generate_entities(text)
    training_data.append({
        "text": text,
        "entities": entities
    })

with open("nlp/data/training_examples.json", "w", encoding="utf-8") as f:
    json.dump(training_data, f, indent=2)

print("✅ training_examples.json generated successfully")
