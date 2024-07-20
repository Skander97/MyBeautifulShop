# routes/ventes.py
from bson import ObjectId
from flask import Blueprint, request, jsonify
from utils.database import get_sales_collection, get_database
from utils.helpers import json_serializable

ventes_bp = Blueprint('ventes', __name__)

@ventes_bp.route('/', methods=['GET'])
def get_sales():
    sales_collection = get_sales_collection()
    sales = list(sales_collection.find())
    sales = json_serializable(sales)
    return jsonify(sales)

@ventes_bp.route('/indicators', methods=['GET'])
def get_sales_indicators():
    sales_collection = get_sales_collection()
    indicators = {"total_sales": sales_collection.count_documents({})}
    return jsonify(indicators)

@ventes_bp.route('/data', methods=['POST'])
def provide_sales_data():
    data = request.get_json()
    sales_collection = get_sales_collection()
    sales_collection.insert_one(data)
    return jsonify({"message": "Data inserted successfully", "data": json_serializable(data)})

@ventes_bp.route('/sales-by-product', methods=['GET'])
def get_sales_by_product():
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
            "$group": {
                "_id": "$order_items.product_id",
                "total_sales": {"$sum": "$order_items.price"}  # Assurez-vous que 'price' est le bon champ
            }
        },
        {"$sort": {"total_sales": -1}}
    ]
    results = list(db['orders'].aggregate(pipeline))
    results = json_serializable(results)
    return jsonify(results)

@ventes_bp.route('/top-products', methods=['GET'])
def get_top_products():
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
            "$group": {
                "_id": "$order_items.product_id",
                "total_sales": {"$sum": "$order_items.price"},  # Assurez-vous que 'price' est le bon champ
                "count": {"$sum": 1}
            }
        },
        {"$sort": {"count": -1}},
        {"$limit": 10}
    ]
    results = list(db['orders'].aggregate(pipeline))
    results = json_serializable(results)
    return jsonify(results)

@ventes_bp.route('/sales-by-customer', methods=['GET'])
def get_sales_by_customer():
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
            "$group": {
                "_id": "$order_details.customer_id",
                "total_sales": {"$sum": "$price"}
            }
        },
        {"$sort": {"total_sales": -1}}
    ]
    results = list(db['order_items'].aggregate(pipeline))
    results = json_serializable(results)
    return jsonify(results)


@ventes_bp.route('/sales-by-category', methods=['GET'])
def get_sales_by_category():
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
                "total_sales": {"$sum": "$order_items.price"}  # Assurez-vous que 'price' est le bon champ
            }
        },
        {"$sort": {"total_sales": -1}}
    ]
    results = list(db['order_items'].aggregate(pipeline))
    results = json_serializable(results)
    return jsonify(results)

@ventes_bp.route('/sales-by-state', methods=['GET'])
def get_sales_by_state():
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
                "total_sales": {"$sum": "$price"}
            }
        },
        {"$sort": {"total_sales": -1}}
    ]
    results = list(db['order_items'].aggregate(pipeline))
    results = json_serializable(results)
    return jsonify(results)

@ventes_bp.route('/sales-by-region', methods=['GET'])
def get_sales_by_region():
    db = get_database()
    
    # Collecter les données des collections vérifiées
    customers = list(db['customers'].find({}, {"customer_id": 1, "customer_zip_code_prefix": 1, "customer_city": 1, "customer_state": 1}))
    geolocations = list(db['geolocation'].find({}, {"geolocation_zip_code_prefix": 1, "geolocation_city": 1, "geolocation_state": 1}))
    orders = list(db['orders'].find({}, {"order_id": 1, "customer_id": 1, "order_purchase_timestamp": 1}))

    # Créer des dictionnaires pour un accès rapide
    customer_dict = {customer['customer_id']: customer for customer in customers}
    geolocation_dict = {geo['geolocation_zip_code_prefix']: geo for geo in geolocations}

    sales_by_region = {}

    for order in orders:
        customer_id = order.get('customer_id')
        if customer_id in customer_dict:
            customer = customer_dict[customer_id]
            zip_code = customer.get('customer_zip_code_prefix')
            if zip_code in geolocation_dict:
                geolocation = geolocation_dict[zip_code]
                region_key = f"{geolocation['geolocation_city']}, {geolocation['geolocation_state']}"
                if region_key not in sales_by_region:
                    sales_by_region[region_key] = 0
                sales_by_region[region_key] += 1  # Incrémente le compteur de ventes pour la région

    sales_by_region = [{"region": key, "total_sales": value} for key, value in sales_by_region.items()]
    sales_by_region = sorted(sales_by_region, key=lambda x: x['total_sales'], reverse=True)

    return jsonify(sales_by_region)


@ventes_bp.route('/kpis', methods=['GET'])
def get_sales_kpis():
    db = get_database()
    total_sales = db['order_items'].aggregate([
        {"$group": {"_id": None, "total_sales": {"$sum": "$price"}}}  # Assurez-vous que 'price' est le bon champ
    ]).next()["total_sales"]
    
    avg_sales = db['order_items'].aggregate([
        {"$group": {"_id": None, "avg_sales": {"$avg": "$price"}}}  # Assurez-vous que 'price' est le bon champ
    ]).next()["avg_sales"]
    
    total_orders = db['orders'].count_documents({})
    
    total_customers = db['customers'].count_documents({})
    
    kpis = {
        "total_sales": total_sales,
        "avg_sales": avg_sales,
        "total_orders": total_orders,
        "total_customers": total_customers
    }
    return jsonify(kpis)

def convert_objectid_to_str(document):
    if isinstance(document, list):
        for item in document:
            convert_objectid_to_str(item)
    elif isinstance(document, dict):
        for key, value in document.items():
            if isinstance(value, ObjectId):
                document[key] = str(value)
            elif isinstance(value, dict):
                convert_objectid_to_str(value)
            elif isinstance(value, list):
                convert_objectid_to_str(value)
    return document

@ventes_bp.route('/check-collections', methods=['GET'])
def check_collections():
    db = get_database()
    orders = db['orders'].find_one()
    customers = db['customers'].find_one()
    geolocation = db['geolocation'].find_one()
    
    collections_info = {
        "orders": convert_objectid_to_str(orders),
        "customers": convert_objectid_to_str(customers),
        "geolocation": convert_objectid_to_str(geolocation)
    }
    
    return jsonify(collections_info)

@ventes_bp.route('/test-joins', methods=['GET'])
def test_joins():
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
            "$lookup": {
                "from": "geolocation",
                "localField": "customer_details.customer_zip_code_prefix",
                "foreignField": "geolocation_zip_code_prefix",
                "as": "geo_details"
            }
        },
        {"$unwind": "$geo_details"},
        {"$limit": 5}
    ]
    results = list(db['order_items'].aggregate(pipeline))
    results = json_serializable(results)
    return jsonify(results)


@ventes_bp.route('/verify-data', methods=['GET'])
def verify_data():
    db = get_database()
    orders = list(db['orders'].find().limit(5))
    customers = list(db['customers'].find().limit(5))
    geolocation = list(db['geolocation'].find().limit(5))
    order_items = list(db['order_items'].find().limit(5))
    data = {
        "orders": orders,
        "customers": customers,
        "geolocation": geolocation,
        "order_items": order_items
    }
    data = json_serializable(data)
    return jsonify(data)
