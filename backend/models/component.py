from database.db import get_db
from bson.objectid import ObjectId

class ComponentModel:
    @staticmethod
    def get_collection():
        return get_db()["components"]
        
    @staticmethod
    def create(data):
        collection = ComponentModel.get_collection()
        result = collection.insert_one(data)
        data["_id"] = str(result.inserted_id)
        return data

    @staticmethod
    def find_by_id(component_id):
        collection = ComponentModel.get_collection()
        try:
            return collection.find_one({"_id": ObjectId(component_id)})
        except:
            return None

    @staticmethod
    def find_all(filters=None, sort_by=None, limit=0):
        collection = ComponentModel.get_collection()
        query = filters if filters else {}
        cursor = collection.find(query)
        if sort_by:
            cursor = cursor.sort(sort_by[0], sort_by[1])
        if limit > 0:
            cursor = cursor.limit(limit)
        return list(cursor)

    @staticmethod
    def update(component_id, data):
        collection = ComponentModel.get_collection()
        try:
            result = collection.update_one({"_id": ObjectId(component_id)}, {"$set": data})
            return result.modified_count > 0
        except:
            return False

    @staticmethod
    def delete(component_id):
        collection = ComponentModel.get_collection()
        try:
            result = collection.delete_one({"_id": ObjectId(component_id)})
            return result.deleted_count > 0
        except:
            return False

    @staticmethod
    def format_component(comp):
        if not comp: return None
        comp["_id"] = str(comp["_id"])
        # Some components might use 'id' from mock data
        if "id" not in comp:
            comp["id"] = comp["_id"]
        return comp
