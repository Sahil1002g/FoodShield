import os
from dotenv import load_dotenv
from pymongo import MongoClient
from pymongo.errors import InvalidURI

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL") or os.getenv("MONGODB_URI") or "mongodb://localhost:27017"
MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME") or os.getenv("DB_NAME") or "foodshield"

try:
    client = MongoClient(DATABASE_URL, serverSelectionTimeoutMS=5000)
except InvalidURI:
    client = MongoClient("mongodb://localhost:27017", serverSelectionTimeoutMS=5000)


db = client[MONGODB_DB_NAME]


def get_db():
    return db


def init_db():
    users = db["users"]
    users.create_index("email", unique=True)
    users.create_index("username", unique=True)

    scan_history = db["scan_history"]
    scan_history.create_index([("user_id", 1), ("created_at", -1)])
