class User:
    def __init__(self, username=None, email=None, password=None, allergens=None, id=None):
        self.id = str(id) if id is not None else None
        self.username = username
        self.email = email
        self.password = password
        self.allergens = allergens or []

    @classmethod
    def from_doc(cls, doc):
        if not doc:
            return None
        return cls(
            username=doc.get("username"),
            email=doc.get("email"),
            password=doc.get("password"),
            allergens=doc.get("allergens", []),
            id=doc.get("_id"),
        )

    def to_doc(self):
        doc = {
            "username": self.username,
            "email": self.email,
            "password": self.password,
            "allergens": self.allergens or [],
        }
        if self.id:
            doc["_id"] = self.id
        return doc
