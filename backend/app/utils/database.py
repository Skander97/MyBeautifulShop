# utils/database.py
import os
from pymongo import MongoClient

MONGO_URI = os.getenv('MONGO_URI', 'mongodb://mongo:27017/my_beautiful_shop')
client = MongoClient(MONGO_URI)
db = client['my_beautiful_shop']

def get_sales_collection():
    return db['sales']

def get_finance_collection():
    return db['orders']

def get_payments_collection():
    return db['order_payments']

def get_outstanding_collection():
    return db['outstanding']

def get_analytics_collection():
    return db['analytics']

def get_database():
    return db
