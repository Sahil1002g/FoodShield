import spacy

nlp = spacy.load("nlp/ingredient_model")

def extract_ingredients(text):
    doc = nlp(text)
    return [ent.text for ent in doc.ents if ent.label_ == "INGREDIENT"]

if __name__ == "__main__":
    sample = text
    print(extract_ingredients(sample))
