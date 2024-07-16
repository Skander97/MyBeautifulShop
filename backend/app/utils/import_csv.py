# utils/import_csv.py

import pandas as pd
from pymongo import MongoClient

def import_csv_to_mongo(file_path, collection_name):
    # Connexion à la base de données MongoDB
    client = MongoClient('mongodb://localhost:27017/')
    db = client['my_beautiful_shop']
    collection = db[collection_name]
    
    # Lire le fichier CSV
    df = pd.read_csv(file_path)
    
    # Convertir le DataFrame en dictionnaire et insérer dans MongoDB
    collection.insert_many(df.to_dict('records'))

    print(f'Données du fichier {file_path} importées dans la collection {collection_name}.')

if __name__ == "__main__":
    files_collections = {
        'C://data_archive/olist_customers_dataset.csv': 'customers',
        'C://data_archive/olist_geolocation_dataset.csv': 'geolocation',
        'C://data_archive/olist_order_items_dataset.csv': 'order_items',
        'C://data_archive/olist_order_payments_dataset.csv': 'order_payments',
        'C://data_archive/olist_order_reviews_dataset.csv': 'order_reviews',
        'C://data_archive/olist_orders_dataset.csv': 'orders',
        'C://data_archive/olist_products_dataset.csv': 'products',
        'C://data_archive/olist_sellers_dataset.csv': 'sellers'
    }

    for file_path, collection_name in files_collections.items():
        import_csv_to_mongo(file_path, collection_name)
