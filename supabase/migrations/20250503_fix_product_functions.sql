
-- Update get_all_products function to use the new parameter name
CREATE OR REPLACE FUNCTION public.get_all_products()
RETURNS SETOF public.products
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NOT public.check_table_exists('products') THEN
    RETURN;
  END IF;
  
  RETURN QUERY SELECT * FROM public.products;
END;
$$;

-- Update insert_product function to use the new parameter name
CREATE OR REPLACE FUNCTION public.insert_product(
  p_name TEXT,
  p_price DECIMAL,
  p_category TEXT,
  p_image TEXT
)
RETURNS public.products
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_product public.products;
BEGIN
  IF NOT public.check_table_exists('products') THEN
    PERFORM public.create_products_table();
  END IF;
  
  INSERT INTO public.products (name, price, category, image)
  VALUES (p_name, p_price, p_category, p_image)
  RETURNING * INTO new_product;
  
  RETURN new_product;
END;
$$;

-- Update update_product function to use the new parameter name
CREATE OR REPLACE FUNCTION public.update_product(
  p_id INTEGER,
  p_name TEXT,
  p_price DECIMAL,
  p_category TEXT,
  p_image TEXT
)
RETURNS public.products
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  updated_product public.products;
BEGIN
  IF NOT public.check_table_exists('products') THEN
    RAISE EXCEPTION 'Table products does not exist';
  END IF;
  
  UPDATE public.products
  SET 
    name = p_name,
    price = p_price,
    category = p_category,
    image = p_image
  WHERE id = p_id
  RETURNING * INTO updated_product;
  
  RETURN updated_product;
END;
$$;

-- Update delete_product function to use the new parameter name
CREATE OR REPLACE FUNCTION public.delete_product(p_id INTEGER)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NOT public.check_table_exists('products') THEN
    RETURN false;
  END IF;
  
  DELETE FROM public.products WHERE id = p_id;
  RETURN FOUND;
END;
$$;
