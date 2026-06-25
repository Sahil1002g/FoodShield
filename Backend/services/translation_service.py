from copy import deepcopy
from typing import Any

from deep_translator import GoogleTranslator


SUPPORTED_LANGUAGES = {"hi", "mr"}


def translate_product(product: dict[str, Any], target_language: str) -> dict[str, Any]:
    if target_language not in SUPPORTED_LANGUAGES:
        raise ValueError("Unsupported language")

    translated = deepcopy(product)
    paths: list[tuple[Any, ...]] = []
    texts: list[str] = []

    def add_text(path: tuple[Any, ...], value: Any) -> None:
        if isinstance(value, str) and value.strip():
            paths.append(path)
            texts.append(value)

    for field in ("product_name", "ingredients", "recommendation"):
        add_text((field,), product.get(field))

    for index, allergen in enumerate(product.get("allergens") or []):
        add_text(("allergens", index), allergen)

    for index, additive in enumerate(product.get("additives") or []):
        for field in ("name", "e_type", "info"):
            add_text(("additives", index, field), additive.get(field))

    if not texts:
        return translated

    results = GoogleTranslator(
        source="auto",
        target=target_language,
    ).translate_batch(texts)

    if isinstance(results, str):
        results = [results]

    for path, value in zip(paths, results):
        target: Any = translated
        for key in path[:-1]:
            target = target[key]
        target[path[-1]] = value

    return translated
