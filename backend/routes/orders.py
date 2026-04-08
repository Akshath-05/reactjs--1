import json
from flask import Blueprint, request, jsonify
from models import db, Order, Coupon

orders_bp = Blueprint('orders', __name__)

@orders_bp.route('/orders', methods=['GET'])
def get_orders():
    orders = Order.query.all()
    return jsonify([order.to_dict() for order in orders]), 200

@orders_bp.route('/order', methods=['POST'])
def create_order():
    data = request.get_json()
    
    # Required fields
    if not data or 'customer_name' not in data or 'address' not in data or 'items' not in data or 'total_price' not in data:
        return jsonify({'error': 'Missing required fields'}), 400
        
    # Check for coupon code
    coupon_code = data.get('coupon_code')
    discount = 0
    if coupon_code:
        coupon = Coupon.query.filter_by(code=coupon_code, is_active=True).first()
        if coupon:
            discount = coupon.discount_percentage
            
    # Calculate final price
    final_price = data['total_price']
    if discount > 0:
        final_price = final_price - (final_price * (discount / 100))
        
    try:
        new_order = Order(
            customer_name=data['customer_name'],
            address=data['address'],
            items=json.dumps(data['items']),
            total_price=final_price,
            coupon_code=coupon_code if discount > 0 else None
        )
        db.session.add(new_order)
        db.session.commit()
        return jsonify(new_order.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@orders_bp.route('/coupons/validate', methods=['POST'])
def validate_coupon():
    data = request.get_json()
    if not data or 'code' not in data:
        return jsonify({'error': 'Missing coupon code'}), 400
        
    coupon = Coupon.query.filter_by(code=data['code'], is_active=True).first()
    if coupon:
        return jsonify(coupon.to_dict()), 200
    else:
        return jsonify({'error': 'Invalid or expired coupon'}), 404
