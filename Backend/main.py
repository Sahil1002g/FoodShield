# from src.pipeline import run_pipeline


# image_path = "data/images/chip.jpeg"
# image_name = "chip.jpeg"


# ingredients, warnings,text = run_pipeline(image_path, image_name)


# print("Ingredients Found:")
# for i in ingredients:
#     print( i)


# print("\nIngredients found after train nlp Text:")
# for i in text:
#     print(i)

# # print("\nMatched Products:")
# # for m in matches:
# #     print(f"- {m['ingredient']}: {m['product_name']} ({m['product_id']})")
# # print("\nWarnings:")
# # for w in warnings:
# #     print(f"- {w['ingredient']}: {w['warning']}")


from fastapi import FastAPI, UploadFile, File
from src.pipeline import run_pipeline
import shutil
import os
from api.scan import router as scan_router
from db.session import engine
from db.base import Base
from api.user import router as user_router
from api.auth import router as auth_router
from api.history import router as history_router


Base.metadata.create_all(bind=engine)


app = FastAPI(title="FoodShield API")

UPLOAD_DIR = "data/images"
os.makedirs(UPLOAD_DIR, exist_ok=True)

app.include_router(auth_router, prefix="/api")
app.include_router(scan_router, prefix="/api/scan")
app.include_router(user_router)
app.include_router(history_router, prefix="/api")


@app.get("/")
def root():
    return {"status": "FoodShield API running"}


@app.post("/analyze-image/")
async def analyze_image(file: UploadFile = File(...)):
    image_path = os.path.join(UPLOAD_DIR, file.filename)

    # save uploaded image
    with open(image_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    ingredients, warnings, extracted_text = run_pipeline(
        image_path=image_path,
        image_name=file.filename
    )

    return {
        "image": file.filename,
        "ingredients": ingredients,
        "warnings": warnings
    }
