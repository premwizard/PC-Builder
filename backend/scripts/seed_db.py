import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.db import get_db, init_db
from models.user import UserModel
from models.component import ComponentModel
from services.auth_service import bcrypt
from flask import Flask
from config.settings import get_config

def seed():
    app = Flask(__name__)
    app.config.from_object(get_config())
    bcrypt.init_app(app)
    init_db(app)

    db = get_db()
    
    print("Clearing collections...")
    db.users.delete_many({})
    db.components.delete_many({})

    print("Creating admin user...")
    admin_password = bcrypt.generate_password_hash("admin123").decode('utf-8')
    admin_user = {
        "username": "admin",
        "email": "admin@icpcs.com",
        "password": admin_password,
        "role": "ADMIN",
        "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
    }
    UserModel.create_user(admin_user)

    print("Seeding components...")
    sample_components = [
        {
            "id": "cpu-1",
            "name": "Intel Core i9-14900K",
            "brand": "Intel",
            "category": "cpu",
            "price": 52999,
            "rating": 4.8,
            "benchmarkScore": 96,
            "valueScore": 58,
            "specs": { "socket": "LGA1700", "cores": 24, "threads": 32, "tdp": 125 }
        },
        {
            "id": "gpu-1",
            "name": "NVIDIA GeForce RTX 4090",
            "brand": "NVIDIA",
            "category": "gpu",
            "price": 185000,
            "rating": 4.9,
            "benchmarkScore": 100,
            "valueScore": 45,
            "specs": { "vram": "24GB GDDR6X", "length": "336mm", "wattage": 450 }
        }
    ]
    
    for comp in sample_components:
        ComponentModel.create(comp)

    print("Database seeded successfully!")

if __name__ == "__main__":
    seed()
