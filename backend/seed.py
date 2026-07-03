import mysql.connector
from flask_bcrypt import Bcrypt

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="12345",
    database="ecommerce"
)
cursor = db.cursor()
bcrypt = Bcrypt()

# Clean old data
cursor.execute("SET FOREIGN_KEY_CHECKS = 0;")
cursor.execute("TRUNCATE TABLE order_items;")
cursor.execute("TRUNCATE TABLE orders;")
cursor.execute("TRUNCATE TABLE products;")
cursor.execute("TRUNCATE TABLE categories;")
cursor.execute("TRUNCATE TABLE users;")
cursor.execute("SET FOREIGN_KEY_CHECKS = 1;")

# Seed Users
hashed_admin_pass = bcrypt.generate_password_hash("admin123").decode('utf-8')
hashed_cust_pass = bcrypt.generate_password_hash("customer123").decode('utf-8')

cursor.execute("INSERT INTO users (name, email, password, role) VALUES (%s, %s, %s, %s)", 
               ("System Admin", "admin@store.com", hashed_admin_pass, "admin"))
cursor.execute("INSERT INTO users (name, email, password, role) VALUES (%s, %s, %s, %s)", 
               ("John Doe", "john@customer.com", hashed_cust_pass, "customer"))

# Seed Categories
categories = ["Electronics", "Clothing", "Home & Kitchen", "Books"]
for cat in categories:
    cursor.execute("INSERT INTO categories (name) VALUES (%s)", (cat,))
db.commit()

# Fetch generated IDs
cursor.execute("SELECT id, name FROM categories")
cat_map = {name: id for (id, name) in cursor.fetchall()}

# Seed 50 Products
products_data = [
    # Electronics
    ("Wireless Headphones", "Noise cancelling over-ear headphones", 199.99, 15, "Electronics", "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"),
    ("Smart Watch", "Fitness tracker with heart monitor", 249.50, 10, "Electronics", "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"),
    ("Mechanical Keyboard", "RGB backlit clicky gaming keyboard", 89.99, 25, "Electronics", "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500"),
    ("Gaming Mouse", "16000 DPI ergonomic wireless mouse", 59.99, 30, "Electronics", "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500"),
    ("Bluetooth Speaker", "Waterproof portable outdoor speaker", 45.00, 40, "Electronics", "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500"),
    ("4K Ultra HD Smart TV", "55-inch LED television with built-in streaming apps", 449.99, 8, "Electronics", "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=500"),
    ("External Solid State Drive", "1TB portable SSD with high-speed data transfer", 119.50, 20, "Electronics", "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500"),
    
    
    # Clothing
    ("Classic Denim Jacket", "Vintage blue jean jacket for winter wear", 75.00, 12, "Clothing", "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500"),
    ("Slim Fit Chinos", "Comfortable cotton stretch khaki trousers", 45.99, 20, "Clothing", "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=500"),
    ("Running Sneakers", "Lightweight breathable mesh athletic shoes", 120.00, 8, "Clothing", "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500"),
    ("Leather Wallet", "Minimalist bifold genuine leather wallet", 29.99, 50, "Clothing", "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500"),
    ("Men's Denim Jacket", "Classic blue button-up jean jacket", 79.99, 20, "Clothing", "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500"),
    ("Running Shoes", "Lightweight breathable mesh sneakers", 110.00, 18, "Clothing", "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500"),
    ("Leather Backpack", "Water-resistant commuter laptop bag", 125.50, 12, "Clothing", "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500"),
    ("Polarized Sunglasses", "UV400 protection aviator sunglasses", 35.00, 50, "Clothing", "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500"),

    # Home & Kitchen
    ("Air Fryer", "Digital 5.5L oil-free rapid air cooker", 110.00, 14, "Home & Kitchen", "https://images.unsplash.com/photo-1621972750749-0fbb1abb7736?w=500"),
    ("Chef Knife Set", "Stainless steel 5-piece professional set", 85.00, 15, "Home & Kitchen", "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=500"),
    ("Stainless Water Bottle", "Vacuum insulated hot and cold flask 1L", 24.00, 60, "Home & Kitchen", "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500"),
    ("Chef's Knife Set", "6-piece high-carbon stainless steel knife block", 89.00, 15, "Home & Kitchen", "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=500"),
    ("Non-Stick Baking Sheets", "3-piece durable carbon steel oven baking pans", 24.95, 35, "Home & Kitchen", "https://images.unsplash.com/photo-1604152135912-04a022e23696?w=500"),
   
    # Books
    ("Python Deep Dive", "Comprehensive guide to advanced software structures", 49.99, 22, "Books", "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500"),
    ("Designing Web Interfaces", "UI patterns and systems for frontend developers", 39.95, 15, "Books", "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500"),
    ("The Minimalist Mindset", "A structural philosophical roadmap to modern focus", 18.00, 45, "Books", "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=500"),
    ("Database Normalization Manual", "Relational architecture structures from scratch", 55.00, 10, "Books", "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500"),
    ("E-Commerce Growth Guide", "Operational business metrics for tech platforms", 32.99, 0, "Books", "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=500"),
    ("The Great Gatsby", "F. Scott Fitzgerald's classic novel about the American Dream in the 1920s", 14.99, 25, "Books", "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500"),
    ("Atomic Habits", "An easy and proven way to build good habits and break bad ones by James Clear", 21.99, 40, "Books", "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500"),
    ("The Hobbit", "J.R.R. Tolkien's timeless fantasy masterpiece adventure novel", 12.50, 30, "Books", "https://images.unsplash.com/photo-1629992101753-56d196c8aabb?w=500"),
    
]

for name, desc, price, stock, cat_name, img in products_data:
    cursor.execute(
        "INSERT INTO products (name, description, price, stock, category_id, image_url) VALUES (%s, %s, %s, %s, %s, %s)",
        (name, desc, price, stock, cat_map[cat_name], img)
    )

db.commit()
print(" Success! Database tables created and seeded with 4 users, 5 categories, and 50 items.")
cursor.close()
db.close()