-- Insert demo company
INSERT INTO companies (name, email, phone, address, city, country) 
VALUES ('Taqueen Demo', 'demo@taqueen.local', '+966123456789', '123 Main St', 'Riyadh', 'Saudi Arabia');

-- Insert demo branches
INSERT INTO branches (company_id, name, email, phone, address, city, country) 
VALUES 
  (1, 'Main Branch', 'main@taqueen.local', '+966111111111', '123 Main St', 'Riyadh', 'Saudi Arabia'),
  (1, 'Downtown Branch', 'downtown@taqueen.local', '+966222222222', '456 Downtown Ave', 'Riyadh', 'Saudi Arabia');

-- Insert demo users
INSERT INTO users (email, password, first_name, last_name, phone, role)
VALUES 
  ('admin@taqueen.local', '$2a$10$gSvqqUPYRfxxHRXF9k.9z.L8.Y0LKbBKDYQE72OiJ0Oq.FAMxHe0K', 'Super', 'Admin', '+966333333333', 'SUPER_ADMIN'),
  ('manager@taqueen.local', '$2a$10$YvDVXZHaMJ/p0fL5Qf6s5eh5g4C8L8K7L0G0T5Z5Z5Z5Z5Z5Z', 'Branch', 'Manager', '+966444444444', 'MANAGER'),
  ('cashier@taqueen.local', '$2a$10$Q0O0O0O0O0O0O0O0O0O0O0O0O0O0O0O0O0O0O0O0O0O0O0O0O0O0O0', 'Cash', 'Ier', '+966555555555', 'CASHIER'),
  ('chef@taqueen.local', '$2a$10$P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1', 'Chef', 'John', '+966666666666', 'CHEF'),
  ('waiter@taqueen.local', '$2a$10$W2W2W2W2W2W2W2W2W2W2W2W2W2W2W2W2W2W2W2W2W2W2W2W2W2W2W2', 'Wait', 'Staff', '+966777777777', 'WAITER');

-- Insert menu categories
INSERT INTO menu_categories (branch_id, name, description)
VALUES 
  (1, 'Appetizers', 'Delicious starters'),
  (1, 'Main Course', 'Our signature dishes'),
  (1, 'Beverages', 'Hot and cold drinks'),
  (1, 'Desserts', 'Sweet treats'),
  (2, 'Appetizers', 'Delicious starters'),
  (2, 'Main Course', 'Our signature dishes'),
  (2, 'Beverages', 'Hot and cold drinks'),
  (2, 'Desserts', 'Sweet treats');

-- Insert menu items
INSERT INTO menu_items (category_id, branch_id, name, description, price, preparation_time)
VALUES 
  (1, 1, 'Hummus', 'Chickpea puree with tahini', 25.00, 5),
  (1, 1, 'Tabbouleh', 'Fresh parsley salad', 30.00, 10),
  (2, 1, 'Grilled Chicken', 'Tender grilled chicken with rice', 85.00, 20),
  (2, 1, 'Kebab Plate', 'Seasoned meat kebabs', 95.00, 25),
  (3, 1, 'Arabic Coffee', 'Traditional coffee', 15.00, 3),
  (3, 1, 'Fresh Juice', 'Freshly squeezed juice', 20.00, 5),
  (4, 1, 'Baklava', 'Honey and nuts pastry', 35.00, 2),
  (4, 1, 'Umm Ali', 'Bread pudding dessert', 40.00, 10),
  (5, 2, 'Hummus', 'Chickpea puree with tahini', 25.00, 5),
  (6, 2, 'Grilled Chicken', 'Tender grilled chicken with rice', 85.00, 20),
  (7, 2, 'Arabic Coffee', 'Traditional coffee', 15.00, 3),
  (8, 2, 'Baklava', 'Honey and nuts pastry', 35.00, 2);

-- Insert ingredients
INSERT INTO ingredients (branch_id, name, unit, min_stock, current_stock, unit_price)
VALUES 
  (1, 'Chicken Breast', 'kg', 5, 20, 35.00),
  (1, 'Rice', 'kg', 10, 50, 8.00),
  (1, 'Olive Oil', 'L', 2, 10, 45.00),
  (1, 'Garlic', 'kg', 2, 8, 15.00),
  (1, 'Onion', 'kg', 5, 15, 5.00),
  (2, 'Chicken Breast', 'kg', 5, 18, 35.00),
  (2, 'Rice', 'kg', 10, 45, 8.00),
  (2, 'Olive Oil', 'L', 2, 9, 45.00);

-- Insert tables
INSERT INTO tables (branch_id, table_number, capacity, section, status)
VALUES 
  (1, 1, 4, 'Main Hall', 'AVAILABLE'),
  (1, 2, 2, 'Main Hall', 'AVAILABLE'),
  (1, 3, 6, 'Main Hall', 'AVAILABLE'),
  (1, 4, 4, 'VIP', 'AVAILABLE'),
  (1, 5, 8, 'Outdoor', 'AVAILABLE'),
  (2, 1, 4, 'Main Hall', 'AVAILABLE'),
  (2, 2, 2, 'Main Hall', 'AVAILABLE'),
  (2, 3, 6, 'Main Hall', 'AVAILABLE');

-- Insert branch staff
INSERT INTO branch_staff (branch_id, user_id, position, salary)
VALUES 
  (1, 2, 'Branch Manager', 5000.00),
  (1, 3, 'Cashier', 2500.00),
  (1, 4, 'Chef', 3500.00),
  (1, 5, 'Waiter', 2000.00),
  (2, 2, 'Branch Manager', 5000.00),
  (2, 3, 'Cashier', 2500.00),
  (2, 4, 'Chef', 3500.00),
  (2, 5, 'Waiter', 2000.00);

-- Insert customers
INSERT INTO customers (branch_id, name, phone, email, total_visits, total_spent)
VALUES 
  (1, 'Ahmed Ali', '+966912345678', 'ahmed@example.com', 5, 500.00),
  (1, 'Fatima Mohammed', '+966987654321', 'fatima@example.com', 3, 300.00),
  (2, 'Hassan Ibrahim', '+966912121212', 'hassan@example.com', 7, 750.00),
  (2, 'Sarah Ahmed', '+966954545454', 'sarah@example.com', 2, 200.00);
