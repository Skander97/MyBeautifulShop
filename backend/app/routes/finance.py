# routes/finance.py
from flask import Blueprint, request, jsonify
from utils.database import get_finance_collection, get_payments_collection, get_outstanding_collection
from utils.helpers import json_serializable

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
