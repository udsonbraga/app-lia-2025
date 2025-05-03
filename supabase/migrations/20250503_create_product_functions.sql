
-- Função para verificar se uma tabela existe
CREATE OR REPLACE FUNCTION public.check_table_exists(table_name text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  exists_bool boolean;
BEGIN
  SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public'
    AND table_name = check_table_exists.table_name
  ) INTO exists_bool;
  
  RETURN exists_bool;
END;
$$;

-- Função para criar a tabela de produtos
CREATE OR REPLACE FUNCTION public.create_products_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS public.products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    category TEXT NOT NULL,
    image TEXT NOT NULL
  );
END;
$$;

-- Função para contar produtos
CREATE OR REPLACE FUNCTION public.count_products()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  count_int integer;
BEGIN
  IF NOT public.check_table_exists('products') THEN
    RETURN 0;
  END IF;
  
  SELECT COUNT(*) FROM public.products INTO count_int;
  RETURN count_int;
END;
$$;

-- Função para obter todos os produtos
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

-- Função para inserir um produto
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

-- Função para atualizar um produto
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

-- Função para deletar um produto
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

-- Função auxiliar para executar SQL dinâmico (para uso em edge functions)
CREATE OR REPLACE FUNCTION public.exec_sql(sql text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE sql;
END;
$$;
