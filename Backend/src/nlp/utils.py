import re

def clean_text(text):
    text = text.upper()
    text = re.sub(r'\([^)]*\)', '', text)
    text = text.replace("INGREDIENTS:", "")
    return text.strip()
