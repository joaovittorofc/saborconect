
-- Create comprehensive database structure for food ordering SaaS platform

-- Enable storage for file uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('store-assets', 'store-assets', true);

-- Create stores table
CREATE TABLE public.stores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  banner_url TEXT,
  primary_color TEXT DEFAULT '#3B82F6',
  button_color TEXT DEFAULT '#10B981',
  language TEXT DEFAULT 'en',
  gamified_ordering BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  store_url TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create menu_items table
CREATE TABLE public.menu_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  is_customizable BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create custom_options table for customizable products
CREATE TABLE public.custom_options (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID NOT NULL REFERENCES public.menu_items(id) ON DELETE CASCADE,
  group_label TEXT NOT NULL,
  option_name TEXT NOT NULL,
  extra_cost DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create customers table
CREATE TABLE public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  last_order_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.customers(id),
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  items_json JSONB NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- RLS Policies for stores
CREATE POLICY "Users can view their own stores" ON public.stores FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own stores" ON public.stores FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own stores" ON public.stores FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own stores" ON public.stores FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for categories
CREATE POLICY "Users can manage categories of their stores" ON public.categories FOR ALL USING (
  EXISTS (SELECT 1 FROM public.stores WHERE id = categories.store_id AND user_id = auth.uid())
);

-- RLS Policies for menu_items
CREATE POLICY "Users can manage menu items of their stores" ON public.menu_items FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.categories c 
    JOIN public.stores s ON c.store_id = s.id 
    WHERE c.id = menu_items.category_id AND s.user_id = auth.uid()
  )
);

-- RLS Policies for custom_options
CREATE POLICY "Users can manage custom options of their menu items" ON public.custom_options FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.menu_items mi
    JOIN public.categories c ON mi.category_id = c.id
    JOIN public.stores s ON c.store_id = s.id 
    WHERE mi.id = custom_options.item_id AND s.user_id = auth.uid()
  )
);

-- RLS Policies for customers
CREATE POLICY "Users can view customers of their stores" ON public.customers FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.stores WHERE id = customers.store_id AND user_id = auth.uid())
);
CREATE POLICY "Anyone can create customers" ON public.customers FOR INSERT WITH CHECK (true);

-- RLS Policies for orders
CREATE POLICY "Users can view orders of their stores" ON public.orders FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.stores WHERE id = orders.store_id AND user_id = auth.uid())
);
CREATE POLICY "Anyone can create orders" ON public.orders FOR INSERT WITH CHECK (true);

-- Storage policies for store assets
CREATE POLICY "Users can upload their store assets" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'store-assets' AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their store assets" ON storage.objects FOR SELECT USING (
  bucket_id = 'store-assets' AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their store assets" ON storage.objects FOR UPDATE USING (
  bucket_id = 'store-assets' AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their store assets" ON storage.objects FOR DELETE USING (
  bucket_id = 'store-assets' AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Public access for published store assets
CREATE POLICY "Public access to published store assets" ON storage.objects FOR SELECT USING (
  bucket_id = 'store-assets'
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates on stores
CREATE TRIGGER update_stores_updated_at
  BEFORE UPDATE ON public.stores
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to generate store URL
CREATE OR REPLACE FUNCTION public.generate_store_url()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.store_url IS NULL THEN
    NEW.store_url := 'store-' || LOWER(REPLACE(NEW.name, ' ', '-')) || '-' || SUBSTRING(NEW.id::text FROM 1 FOR 8);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate store URL
CREATE TRIGGER generate_store_url_trigger
  BEFORE INSERT ON public.stores
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_store_url();
