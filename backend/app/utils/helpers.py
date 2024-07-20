import json
from bson import ObjectId

def json_serializable(data):
    if isinstance(data, list):
        for item in data:
            item = convert_objectid(item)
    elif isinstance(data, dict):
        data = convert_objectid(data)
    return data

def convert_objectid(item):
    if isinstance(item, dict):
        for key, value in item.items():
            if isinstance(value, ObjectId):
                item[key] = str(value)
            elif isinstance(value, (list, dict)):
                item[key] = json_serializable(value)
    elif isinstance(item, list):
        item = [convert_objectid(i) for i in item]
    return item
