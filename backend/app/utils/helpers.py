# utils/helpers.py
from bson import ObjectId

def json_serializable(doc):
    """
    Convert MongoDB document to a JSON-serializable dictionary.
    """
    if isinstance(doc, list):
        return [json_serializable(d) for d in doc]
    if isinstance(doc, dict):
        return {k: json_serializable(v) for k, v in doc.items()}
    if isinstance(doc, ObjectId):
        return str(doc)
    return doc
