from src.preprocess import preprocess_image
from src.ocr import extract_text
from src.nlp import clean_text, tokenize_ingredients, extract_ingredients
from src.analyzer import analyze




def run_pipeline(image_path, image_name):
    processed = preprocess_image(image_path)
    text = extract_text(processed)

    with open("data/output/train.text", "a", encoding="utf-8") as f:
        f.write(f"{image_name}\t{text.strip()}\n")

    cleaned = clean_text(text)

    final_ingredients = extract_ingredients(cleaned)
    warnings = analyze(final_ingredients)

    return final_ingredients, warnings, cleaned



