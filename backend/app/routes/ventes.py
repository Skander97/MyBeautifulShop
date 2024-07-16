# routes/ventes.py
from flask import Blueprint, request, jsonify
from utils.database import get_sales_collection
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
