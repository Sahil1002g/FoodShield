

import pytesseract

pytesseract.pytesseract.tesseract_cmd = r"C:\\Program Files\\Tesseract-OCR\\tesseract.exe"

OCR_FIXES = {
    "BRAM": "BRAN",
    "FLAGS": "FLAKES",
    "ST": "SALT",
    "GARLIQ": "GARLIC",
    "POWER": "POWDER",
    "VURAL": "NATURAL",
    "HRTEUNR": "HYDROLYZED",
    "ENER": "",
    "FY": "",
}


def fix_ocr_words(text: str) -> str:
    for wrong, correct in OCR_FIXES.items():
        text = text.replace(wrong, correct)
    return text


def extract_text(image, min_conf=60):
    data = pytesseract.image_to_data(
        image,
        config=r'--oem 3 --psm 6',
        output_type=pytesseract.Output.DICT
    )

    words = []
    for i in range(len(data["text"])):
        if int(data["conf"][i]) > min_conf:
            words.append(data["text"][i])

    text = " ".join(words)
    text = fix_ocr_words(text)

    return text
