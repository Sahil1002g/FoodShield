import json

def load_training_data(path):
    with open(path, "r", encoding="utf-8") as f:
        raw = json.load(f)

    TRAIN_DATA = []
    for item in raw:
        TRAIN_DATA.append(
            (item["text"], {"entities": item["entities"]})
        )

    return TRAIN_DATA
