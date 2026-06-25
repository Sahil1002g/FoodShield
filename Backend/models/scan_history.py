class ScanHistory:
    def __init__(self, user_id=None, product_data=None, id=None, created_at=None):
        self.id = str(id) if id is not None else None
        self.user_id = user_id
        self.product_data = product_data
        self.created_at = created_at

    @classmethod
    def from_doc(cls, doc):
        if not doc:
            return None
        return cls(
            user_id=doc.get("user_id"),
            product_data=doc.get("product_data"),
            id=doc.get("_id"),
            created_at=doc.get("created_at"),
        )

    def to_doc(self):
        doc = {
            "user_id": self.user_id,
            "product_data": self.product_data,
        }
        if self.created_at is not None:
            doc["created_at"] = self.created_at
        if self.id:
            doc["_id"] = self.id
        return doc
