from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Category(db.Model):
    __tablename__ = 'categories'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    products = db.relationship('Product', backref='category', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name
        }

class Product(db.Model):
    __tablename__ = 'products'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    price = db.Column(db.Float, nullable=False)
    image = db.Column(db.String(500), nullable=True)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'price': self.price,
            'image': self.image,
            'category_id': self.category_id,
            'category_name': self.category.name if self.category else None
        }

class Order(db.Model):
    __tablename__ = 'orders'
    id = db.Column(db.Integer, primary_key=True)
    customer_name = db.Column(db.String(200), nullable=False)
    address = db.Column(db.String(500), nullable=False)
    items = db.Column(db.Text, nullable=False) # Store as JSON string
    total_price = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(50), nullable=False, default='Order Placed')
    coupon_code = db.Column(db.String(50), nullable=True) # Bonus feature

    def to_dict(self):
        import json
        return {
            'id': self.id,
            'customer_name': self.customer_name,
            'address': self.address,
            'items': json.loads(self.items) if self.items else [],
            'total_price': self.total_price,
            'status': self.status,
            'coupon_code': self.coupon_code
        }

class Coupon(db.Model):
    __tablename__ = 'coupons'
    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(50), nullable=False, unique=True)
    discount_percentage = db.Column(db.Float, nullable=False) # e.g., 10 for 10%
    is_active = db.Column(db.Boolean, default=True)

    def to_dict(self):
        return {
            'id': self.id,
            'code': self.code,
            'discount_percentage': self.discount_percentage,
            'is_active': self.is_active
        }
