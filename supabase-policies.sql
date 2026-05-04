-- Enable RLS
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;

-- Restaurants policies
CREATE POLICY "Restaurants are viewable by everyone" ON restaurants FOR SELECT USING (true);
CREATE POLICY "Restaurants are insertable by authenticated users" ON restaurants FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Restaurants are updatable by owner" ON restaurants FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Restaurants are deletable by owner" ON restaurants FOR DELETE USING (auth.uid() = user_id);

-- Categories policies
CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (true);
CREATE POLICY "Categories are insertable by restaurant owner" ON categories FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM restaurants WHERE id = restaurant_id AND user_id = auth.uid())
);

-- Items policies
CREATE POLICY "Items are viewable by everyone" ON items FOR SELECT USING (true);
CREATE POLICY "Items are insertable by restaurant owner" ON items FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM categories c 
    JOIN restaurants r ON c.restaurant_id = r.id 
    WHERE c.id = category_id AND r.user_id = auth.uid()
  )
);

-- Orders policies
CREATE POLICY "Orders are viewable by restaurant owner" ON orders FOR SELECT USING (
  EXISTS (SELECT 1 FROM restaurants WHERE id = restaurant_id AND user_id = auth.uid())
);
CREATE POLICY "Orders are insertable by everyone" ON orders FOR INSERT WITH CHECK (true);

-- Order items policies
CREATE POLICY "Order items are viewable by restaurant owner" ON order_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM orders o 
    JOIN restaurants r ON o.restaurant_id = r.id 
    WHERE o.id = order_id AND r.user_id = auth.uid()
  )
);

-- Reservations policies
CREATE POLICY "Reservations are viewable by restaurant owner" ON reservations FOR SELECT USING (
  EXISTS (SELECT 1 FROM restaurants WHERE id = restaurant_id AND user_id = auth.uid())
);
CREATE POLICY "Reservations are insertable by everyone" ON reservations FOR INSERT WITH CHECK (true);

-- Tables policies
CREATE POLICY "Tables are viewable by everyone" ON tables FOR SELECT USING (true);
CREATE POLICY "Tables are insertable by restaurant owner" ON tables FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM restaurants WHERE id = restaurant_id AND user_id = auth.uid())
);
