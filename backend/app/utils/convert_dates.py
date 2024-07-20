from pymongo import MongoClient
from datetime import datetime

client = MongoClient('mongodb://localhost:27017/')
db = client['my_beautiful_shop']

def convert_dates():
    orders_collection = db['orders']
    # Ajouter une vérification pour les dates sous forme de chaînes de caractères
    orders = list(orders_collection.find({"order_purchase_timestamp": {"$type": "string"}}))

    for order in orders:
        try:
            # Conversion de la date en utilisant le format correct
            order_date = datetime.strptime(order['order_purchase_timestamp'], '%Y-%m-%d %H:%M:%S')
            # Mise à jour de la collection avec la nouvelle date
            orders_collection.update_one(
                {"_id": order["_id"]},
                {"$set": {"order_purchase_timestamp": order_date}}
            )
            print(f"Updated order {order['_id']}")
        except Exception as e:
            print(f"Failed to update order {order['_id']}: {e}")

if __name__ == "__main__":
    convert_dates()
