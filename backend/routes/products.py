from flask import Blueprint, jsonify
from models import Product

products_bp = Blueprint('products', __name__)

@products_bp.route('/products', methods=['GET'])
def get_products():
    products = Product.query.all()
    return jsonify([product.to_dict() for product in products]), 200

@products_bp.route('/products/<int:category_id>', methods=['GET'])
def get_products_by_category(category_id):
    products = Product.query.filter_by(category_id=category_id).all()
    return jsonify([product.to_dict() for product in products]), 200
