from flask import Blueprint, request, jsonify
from utils.database import get_finance_collection, get_payments_collection, get_outstanding_collection, get_database
from utils.helpers import json_serializable
from datetime import datetime

finance_bp = Blueprint('finance', __name__)

@finance_bp.route('/orders', methods=['GET'])
def get_orders():
    finance_collection = get_finance_collection()
    orders = list(finance_collection.find())
    orders = json_serializable(orders)
    return jsonify(orders)

@finance_bp.route('/payments', methods=['GET'])
def get_payments():
    payments_collection = get_payments_collection()
    payments = list(payments_collection.find())
    payments = json_serializable(payments)
    return jsonify(payments)

@finance_bp.route('/outstanding', methods=['GET'])
def get_outstanding():
    outstanding_collection = get_outstanding_collection()
    outstanding = list(outstanding_collection.find())
    outstanding = json_serializable(outstanding)
    return jsonify(outstanding)

@finance_bp.route('/anomalies', methods=['GET'])
def detect_anomalies():
    payments_collection = get_payments_collection()
    finance_collection = get_finance_collection()
    anomalies = list(payments_collection.find({"payment_value": {"$gt": 10000}}))
    anomalies = json_serializable(anomalies)

    for anomaly in anomalies:
        order_details = finance_collection.find_one({"order_id": anomaly["order_id"]})
        anomaly["order_details"] = order_details

    anomalies = json_serializable(anomalies)
    return jsonify(anomalies)

@finance_bp.route('/integrity-check', methods=['GET'])
def integrity_check():
    finance_collection = get_finance_collection()
    payments_collection = get_payments_collection()

    orders = list(finance_collection.find())
    payments = list(payments_collection.find())

    order_ids_with_payments = {payment['order_id'] for payment in payments}
    orders_without_payments = [order for order in orders if order['order_id'] not in order_ids_with_payments]

    integrity_issues = {
        "orders_without_payments": json_serializable(orders_without_payments)
    }
    
    for issue in integrity_issues["orders_without_payments"]:
        payment_details = payments_collection.find_one({"order_id": issue["order_id"]})
        issue["payment_details"] = payment_details

    integrity_issues = json_serializable(integrity_issues)
    return jsonify(integrity_issues)

@finance_bp.route('/payments-by-type', methods=['GET'])
def get_payments_by_type():
    payments_collection = get_payments_collection()
    pipeline = [
        {"$group": {"_id": "$payment_type", "total": {"$sum": "$payment_value"}}}
    ]
    results = list(payments_collection.aggregate(pipeline))
    results = json_serializable(results)
    return jsonify(results)

@finance_bp.route('/payments-by-month', methods=['GET'])
def get_payments_by_month():
    print("Route /payments-by-month atteinte")
    db = get_database()

    # Extraire les paiements et les dates de commande
    payments = list(db['order_payments'].find())
    orders = list(db['orders'].find())

    # Créer un dictionnaire pour accéder aux dates de commande par order_id
    order_dates = {order['order_id']: order['order_purchase_timestamp'] for order in orders}

    # Calculer les paiements par mois
    payments_by_month = {}
    for payment in payments:
        order_id = payment['order_id']
        if order_id in order_dates:
            date = order_dates[order_id]
            if isinstance(date, str):
                date = datetime.strptime(date, '%Y-%m-%d %H:%M:%S')
            month = date.strftime('%Y-%m')
            if month not in payments_by_month:
                payments_by_month[month] = 0
            payments_by_month[month] += payment['payment_value']

    results = [{"month": month, "total": total} for month, total in payments_by_month.items()]
    results = sorted(results, key=lambda x: x['month'])
    
    print("Payments by month results:", results)  # Log the results
    results = json_serializable(results)
    return jsonify(results)

@finance_bp.route('/payments-by-year', methods=['GET'])
def get_payments_by_year():
    print("Route /payments-by-year atteinte")
    db = get_database()

    # Extraire les paiements et les dates de commande
    payments = list(db['order_payments'].find())
    orders = list(db['orders'].find())

    # Créer un dictionnaire pour accéder aux dates de commande par order_id
    order_dates = {order['order_id']: order['order_purchase_timestamp'] for order in orders}

    # Calculer les paiements par année
    payments_by_year = {}
    for payment in payments:
        order_id = payment['order_id']
        if order_id in order_dates:
            date = order_dates[order_id]
            if isinstance(date, str):
                date = datetime.strptime(date, '%Y-%m-%d %H:%M:%S')
            year = date.strftime('%Y')
            if year not in payments_by_year:
                payments_by_year[year] = 0
            payments_by_year[year] += payment['payment_value']

    results = [{"year": year, "total": total} for year, total in payments_by_year.items()]
    results = sorted(results, key=lambda x: x['year'])
    
    print("Payments by year results:", results)  # Log the results
    results = json_serializable(results)
    return jsonify(results)

@finance_bp.route('/precalculate-payments-by-category', methods=['POST'])
def precalculate_payments_by_category():
    db = get_database()

    pipeline = [
        {
            "$lookup": {
                "from": "order_items",
                "localField": "order_id",
                "foreignField": "order_id",
                "as": "order_items"
            }
        },
        {"$unwind": "$order_items"},
        {
            "$lookup": {
                "from": "products",
                "localField": "order_items.product_id",
                "foreignField": "product_id",
                "as": "product_details"
            }
        },
        {"$unwind": "$product_details"},
        {
            "$group": {
                "_id": "$product_details.product_category_name",
                "total": {"$sum": "$payment_value"}
            }
        },
        {"$sort": {"total": -1}}
    ]

    results = list(db['order_payments'].aggregate(pipeline, allowDiskUse=True))
    db['payments_by_category'].delete_many({})
    db['payments_by_category'].insert_many(results)
    return jsonify({"message": "Pre-calculation done"}), 200

@finance_bp.route('/payments-by-category', methods=['GET'])
def get_payments_by_category():
    db = get_database()
    results = list(db['payments_by_category'].find())
    results = json_serializable(results)
    return jsonify(results)


@finance_bp.route('/orders-by-month', methods=['GET'])
def get_orders_by_month():
    db = get_database()
    pipeline = [
        {"$match": {"order_purchase_timestamp": {"$exists": True, "$ne": None}}},
        {"$project": {"month": {"$month": "$order_purchase_timestamp"}}},
        {"$group": {"_id": {"month": "$month"}, "total": {"$sum": 1}}},
        {"$sort": {"_id.month": 1}}
    ]
    results = list(db['orders'].aggregate(pipeline))
    results = json_serializable(results)
    return jsonify(results)