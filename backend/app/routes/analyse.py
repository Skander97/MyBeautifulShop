# routes/analyse.py
from flask import Blueprint, request, jsonify
from utils.database import get_analytics_collection
from utils.helpers import json_serializable

analyse_bp = Blueprint('analyse', __name__)

@analyse_bp.route('/financial-indicators', methods=['GET'])
def get_financial_indicators():
    analytics_collection = get_analytics_collection()
    indicators = {"total_payments": analytics_collection.count_documents({})}
    return jsonify(indicators)

@analyse_bp.route('/financial-reports', methods=['GET'])
def get_financial_reports():
    analytics_collection = get_analytics_collection()
    reports = list(analytics_collection.find())
    reports = json_serializable(reports)
    return jsonify(reports)

@analyse_bp.route('/treasury-data', methods=['POST'])
def provide_treasury_data():
    data = request.get_json()
    analytics_collection = get_analytics_collection()
    analytics_collection.insert_one(data)
    return jsonify({"message": "Data inserted successfully", "data": json_serializable(data)})
