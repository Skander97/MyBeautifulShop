# routes/analytics.py
from flask import Blueprint, request, jsonify
from utils.database import get_database
from utils.helpers import json_serializable
import joblib
import pandas as pd

analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route('/sales-report', methods=['GET'])
def get_sales_report():
    db = get_database()
    pipeline = [
        {
            "$group": {
                "_id": {"year": {"$year": "$order_purchase_timestamp"}, "month": {"$month": "$order_purchase_timestamp"}},
                "total_sales": {"$sum": "$payment_value"}
            }
        },
        {"$sort": {"_id.year": 1, "_id.month": 1}}
    ]
    results = list(db['orders'].aggregate(pipeline))
    results = json_serializable(results)
    return jsonify(results)

@analytics_bp.route('/average-sales-by-product', methods=['GET'])
def get_average_sales_by_product():
    db = get_database()
    pipeline = [
        {
            "$group": {
                "_id": "$product_id",
                "average_sales": {"$avg": "$payment_value"}
            }
        },
        {"$sort": {"average_sales": -1}}
    ]
    results = list(db['order_items'].aggregate(pipeline))
    results = json_serializable(results)
    return jsonify(results)

@analytics_bp.route('/sales-by-region', methods=['GET'])
def get_sales_by_region():
    db = get_database()
    pipeline = [
        {
            "$lookup": {
                "from": "orders",
                "localField": "order_id",
                "foreignField": "order_id",
                "as": "order_details"
            }
        },
        {"$unwind": "$order_details"},
        {
            "$lookup": {
                "from": "customers",
                "localField": "order_details.customer_id",
                "foreignField": "customer_id",
                "as": "customer_details"
            }
        },
        {"$unwind": "$customer_details"},
        {
            "$group": {
                "_id": "$customer_details.customer_state",
                "total_sales": {"$sum": "$payment_value"}
            }
        },
        {"$sort": {"total_sales": -1}}
    ]
    results = list(db['order_items'].aggregate(pipeline))
    results = json_serializable(results)
    return jsonify(results)

@analytics_bp.route('/underperforming-products', methods=['GET'])
def get_underperforming_products():
    db = get_database()
    pipeline = [
        {
            "$group": {
                "_id": "$product_id",
                "total_sales": {"$sum": "$payment_value"}
            }
        },
        {"$sort": {"total_sales": 1}},
        {"$limit": 10}
    ]
    results = list(db['order_items'].aggregate(pipeline))
    results = json_serializable(results)
    return jsonify(results)

@analytics_bp.route('/top-performing-products', methods=['GET'])
def get_top_performing_products():
    db = get_database()
    pipeline = [
        {
            "$group": {
                "_id": "$product_id",
                "total_sales": {"$sum": "$payment_value"}
            }
        },
        {"$sort": {"total_sales": -1}},
        {"$limit": 10}
    ]
    results = list(db['order_items'].aggregate(pipeline))
    results = json_serializable(results)
    return jsonify(results)

@analytics_bp.route('/classify-vendors', methods=['POST'])
def classify_vendors():
    model = joblib.load('vendor_classification_model.pkl')
    data = request.get_json()
    df = pd.DataFrame(data)
    predictions = model.predict(df)
    return jsonify({"predictions": predictions.tolist()})
