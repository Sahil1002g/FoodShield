from pydantic import BaseModel
from typing import List

class AllergenUpdate(BaseModel):
    allergens: List[str]
