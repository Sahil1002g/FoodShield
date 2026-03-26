import re


def clean_text(text):
    text = text.upper()

   
    text = re.sub(r'[|”‘’"´`]', '', text)

    
    text = text.replace("\\N", " ").replace("\n", " ")

    
    text = re.sub(r'\b[A-Z]\b', '', text)

    
    text = re.sub(r'\s+', ' ', text)

    return text.strip()




def tokenize_ingredients(text):
    return [i.strip() for i in text.split(',') if i.strip()]



import spacy

REMOVE_SECTIONS = [
    "ALLERGY ADVICE",
    "ALLERGEN INFORMATION",
    "MAY CONTAIN",
    "CONTAINS ALLERGENS",
    "ALLERGY INFORMATION",
    "MANUFACTURED IN",
    "PROCESSED IN A FACILITY",
    "WARNING",
    "STORAGE INSTRUCTIONS",
    "NUTRITION INFORMATION"
]


nlp = spacy.load("src/nlp/ingredient_model")



def extract_ingredients(text: str):
    text = text.upper()

    
    text = text.replace("\n", " ")

   
    if "INGREDIENTS" in text:
        text = text.split("INGREDIENTS", 1)[1]

    
    for keyword in REMOVE_SECTIONS:
        if keyword in text:
            text = text.split(keyword, 1)[0]

    text = re.sub(r'\s+', ' ', text).strip()

    doc = nlp(text)

    return list(set(
        ent.text.lower().strip()
        for ent in doc.ents
        if ent.label_ == "INGREDIENT"
    ))





def join_ocr_lines(lines: list[str]) -> str:
    text = " ".join(lines)
    return text


