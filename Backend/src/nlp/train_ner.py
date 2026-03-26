import spacy
from spacy.training.example import Example
from data.train_data import load_training_data

TRAIN_DATA = load_training_data("nlp/data/training_examples.json")

nlp = spacy.blank("en")

ner = nlp.add_pipe("ner")

ner.add_label("INGREDIENT")

optimizer = nlp.begin_training()

for epoch in range(30):
    losses = {}
    for text, annotations in TRAIN_DATA:
        doc = nlp.make_doc(text)
        example = Example.from_dict(doc, annotations)
        nlp.update([example], losses=losses)
    print(f"Epoch {epoch} - Losses: {losses}")

nlp.to_disk("nlp/ingredient_model")
print("✅ Model saved")
