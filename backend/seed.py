from app import create_app
from models import db, Category, Product, Coupon

app = create_app()

def seed_database():
    with app.app_context():
        # Drop and recreate tables for a fresh start
        db.drop_all()
        db.create_all()

        print("Seeding Categories...")
        fruits = Category(name='Fruits & Vegetables')
        dairy = Category(name='Dairy & Eggs')
        meat = Category(name='Meat & Seafood')
        bakery = Category(name='Bakery')
        pantry = Category(name='Pantry Staples')
        snacks = Category(name='Snacks & Beverages')

        db.session.add_all([fruits, dairy, meat, bakery, pantry, snacks])
        db.session.commit()

        print("Seeding Products...")
        products = [
            Product(name='Organic Bananas', price=2.99, image='https://images.unsplash.com/photo-1571501715214-cb51beebceae?w=300&q=80', category_id=fruits.id),
            Product(name='Fresh Strawberries', price=4.49, image='https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=300&q=80', category_id=fruits.id),
            Product(name='Red Apples', price=3.99, image='https://images.unsplash.com/photo-1560806887-1e4cd0b6caa6?w=300&q=80', category_id=fruits.id),
            Product(name='Carrots', price=1.99, image='https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=300&q=80', category_id=fruits.id),
            
            Product(name='Whole Milk', price=3.49, image='https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&q=80', category_id=dairy.id),
            Product(name='Large Eggs (1 Dozen)', price=4.99, image='https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=300&q=80', category_id=dairy.id),
            Product(name='Cheddar Cheese', price=5.49, image='https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=300&q=80', category_id=dairy.id),
            
            Product(name='Chicken Breast', price=8.99, image='https://images.unsplash.com/photo-1604503468506-a8da13fc1ecb?w=300&q=80', category_id=meat.id),
            Product(name='Ground Beef', price=7.99, image='https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=300&q=80', category_id=meat.id),
            Product(name='Fresh Salmon', price=12.99, image='https://images.unsplash.com/photo-1599084942153-f75e7a8335dc?w=300&q=80', category_id=meat.id),
            
            Product(name='Sourdough Bread', price=4.99, image='https://images.unsplash.com/photo-1589367920969-ab8e050eb0e9?w=300&q=80', category_id=bakery.id),
            Product(name='Croissants', price=3.99, image='https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=300&q=80', category_id=bakery.id),
            
            Product(name='Pasta', price=1.49, image='https://images.unsplash.com/photo-1551462147-16fbdbca1fa3?w=300&q=80', category_id=pantry.id),
            Product(name='Olive Oil', price=9.99, image='https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&q=80', category_id=pantry.id),
            Product(name='Rice', price=3.49, image='https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&q=80', category_id=pantry.id),
            
            Product(name='Potato Chips', price=3.49, image='https://images.unsplash.com/photo-1566478989037-e505cc3b02ce?w=300&q=80', category_id=snacks.id),
            Product(name='Sparkling Water', price=4.99, image='https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300&q=80', category_id=snacks.id)
        ]
        db.session.add_all(products)
        
        print("Seeding Coupons...")
        welcome_coupon = Coupon(code='WELCOME10', discount_percentage=10.0, is_active=True)
        db.session.add(welcome_coupon)

        db.session.commit()
        print("Database seeded successfully!")

if __name__ == '__main__':
    seed_database()
