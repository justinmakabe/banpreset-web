-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES (Thông tin người dùng)
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  avatar_url text,
  role text default 'user',
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- RLS cho Profiles
alter table profiles enable row level security;
create policy "Public profiles are viewable by everyone." on profiles for select using (true);
create policy "Users can insert their own profile." on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on profiles for update using (auth.uid() = id);

-- 2. PRODUCTS (Sản phẩm - Thông tin công khai)
create table products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  price numeric not null,
  image_url text,
  owner_id uuid references auth.users(id), -- Người tạo/Admin
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS cho Products
alter table products enable row level security;
create policy "Products are viewable by everyone." on products for select using (true);
create policy "Only admin/owner can insert/update products." on products for all using (auth.uid() = owner_id);

-- 3. ORDERS (Lịch sử mua hàng)
-- 3. ORDERS (Lịch sử mua hàng)
create table orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) not null,
  total_amount numeric not null,
  status text default 'completed', -- pending, completed, refunded
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS cho Orders
alter table orders enable row level security;
create policy "Users can view their own orders." on orders for select using (
  auth.uid() = user_id OR 
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);
create policy "Users can create orders." on orders for insert with check (auth.uid() = user_id);

-- 3.5 ORDER ITEMS (Chi tiết đơn hàng)
create table order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references orders(id) on delete cascade not null,
  product_id uuid references products(id) on delete cascade not null,
  price numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS cho Order Items
alter table order_items enable row level security;
create policy "Users can view their own order items." on order_items for select using (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND (orders.user_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'))
  )
);
create policy "Users can insert order items." on order_items for insert with check (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  )
);

-- 4. PRODUCT FILES (File sản phẩm - BẢO MẬT)
-- Tách file_url ra bảng riêng để bảo mật tuyệt đối. Nếu để trong bảng products, ai cũng có thể query thấy link.
create table product_files (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid references products(id) on delete cascade not null,
  file_url text not null, -- Link download (Google Drive, S3, v.v.)
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- RLS cho Product Files (QUAN TRỌNG: Chỉ người đã mua mới xem được)
alter table product_files enable row level security;

create policy "Buyers can view purchased files." on product_files
for select using (
  -- Cho phép xem nếu user đã mua sản phẩm này và đơn hàng đã hoàn thành
  exists (
    select 1 from order_items
    join orders on orders.id = order_items.order_id
    where order_items.product_id = product_files.product_id
    and orders.user_id = auth.uid()
    and orders.status = 'completed'
  )
  or 
  -- Hoặc là người sở hữu sản phẩm (Admin)
  exists (
    select 1 from products
    where products.id = product_files.product_id
    and products.owner_id = auth.uid()
  )
);

-- Trigger để tự động tạo profile khi user đăng ký mới
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- RPC Function: Cancel Order (Delete pending orders)
create or replace function cancel_order(p_order_id uuid)
returns json as $$
declare
  v_user_id uuid;
  v_order_status text;
  v_result json;
begin
  -- Get current user ID
  v_user_id := auth.uid();
  
  -- Check if user is authenticated
  if v_user_id is null then
    return json_build_object('success', false, 'error', 'Not authenticated');
  end if;
  
  -- Get order info and verify ownership
  select status into v_order_status
  from orders
  where id = p_order_id and user_id = v_user_id;
  
  -- Check if order exists and belongs to user
  if not found then
    return json_build_object('success', false, 'error', 'Order not found');
  end if;
  
  -- Only allow canceling pending orders
  if v_order_status != 'pending' then
    return json_build_object('success', false, 'error', 'Only pending orders can be canceled');
  end if;
  
  -- Delete order items first (cascade will delete them, but explicit is better)
  delete from order_items where order_id = p_order_id;
  
  -- Delete the order
  delete from orders where id = p_order_id;
  
  return json_build_object('success', true, 'message', 'Order canceled successfully');
end;
$$ language plpgsql security definer;

-- Grant execute permission to authenticated users
grant execute on function cancel_order(uuid) to authenticated;

