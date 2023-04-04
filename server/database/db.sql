/*-------------------------------------- E-COMMERCE DATABASE DEVELOPED WITH POSGRESQL -------------------------------------------*/
/*DDL*/
DROP TABLE IF EXISTS products, client, shops cascade;
DROP TRIGGER IF EXISTS update_products_trigger ON products;
DROP TRIGGER IF EXISTS update_clients_trigger ON client;
DROP TRIGGER IF EXISTS update_shops_trigger ON shops;

drop FUNCTION if exists register_user,
add_shop,
getCashFormat(decimal), 
update_column_date,
get_shops,
get_client_shops,
get_user_payment,
pay_products;

CREATE TABLE products(
	product_id serial PRIMARY KEY,
	product_name varchar(32) not null,
	product_price decimal not null,
	created_at timestamp default now(),
	updated_at timestamp default now()
);

create table shops(
	shops_id serial PRIMARY KEY,
	product_id integer,
	client_id integer,
	created_at timestamp default now(),
	updated_at timestamp default now()
);

CREATE TABLE client(
	client_id serial PRIMARY KEY,
	client_dni varchar(10) unique not null,
	client_name varchar(32) not null,
	shops_id integer,
	created_at timestamp default now(),
	updated_at timestamp default now(),
	client_active boolean default true
);

CREATE OR REPLACE FUNCTION getCashFormat(v_number decimal)
RETURNS varchar AS $$
begin
    RETURN concat('$',v_number) ;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_column_date()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;



CREATE OR REPLACE FUNCTION user_exists(p_dni varchar(10)) 
RETURNS boolean AS $$
DECLARE
  v_exists boolean := false;
BEGIN
  SELECT EXISTS(SELECT 1 FROM client WHERE client_dni = p_dni) INTO v_exists;
  RETURN v_exists;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION register_user(p_dni varchar(10), p_name varchar(32))
RETURNS TABLE (message varchar(56), code integer, id text) AS $$
DECLARE
  v_max_dni integer :=10;
  v_max_name integer := 32;
  v_user_exists BOOLEAN := false;
BEGIN 
  SELECT user_exists(p_dni) INTO v_user_exists;
	
  if v_user_exists = true then
  	RETURN QUERY SELECT 'Error: El usuario ya existe'::varchar(56), 400, NULL;
  
  ELSIF p_dni IS NULL OR length(p_dni) != v_max_dni THEN
    RETURN QUERY SELECT 'Error: La cédula debe tener 10 caracteres'::varchar(56), 400, NULL;
   
  ELSIF p_name IS NULL THEN
    RETURN QUERY SELECT 'Error: El nombre no es obligatorio'::varchar(56), 400, NULL;
  ELSIF trim(p_name) = '' OR length(trim(p_name)) > v_max_name THEN
    RETURN QUERY SELECT 'Error: El nombre debe tener entre 1 y 32 caracteres'::varchar(40), 400, NULL;
  ELSE
    INSERT INTO client(client_dni, client_name) 
    VALUES(p_dni, p_name);
    SELECT client_id INTO id FROM client WHERE client_dni = p_dni;
    RETURN QUERY SELECT 'Registrado con éxito'::varchar(56), 200, id;
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_client_shops_id()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE client SET shops_id = NEW.shops_id WHERE client_id = NEW.client_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_user_payment(param_client_id integer)
returns table (
	payment_subtotal text,
	payment_iva text,
	payment_total text
) as $$
declare
	var_has_shops text;
begin
	select shops_id into var_has_shops from shops where client_id = param_client_id;
	if var_has_shops is null then
	return query values('--', '--','--');
	
	else
	return query 
	SELECT concat('$',round(SUM(p.product_price - (p.product_price * 0.12 )), 2)) as payment_subtotal,
	concat('$',round(SUM(p.product_price * 0.12 ), 2)) as payment_iva,
	concat('$',round(SUM(p.product_price), 2)) as payment_total
	FROM shops s
	INNER JOIN client c ON s.client_id = c.client_id
	INNER JOIN products p ON s.product_id = p.product_id
	WHERE c.client_id = param_client_id;
	
	end if;
end;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_products_by_client_id(param_client_id integer)
RETURNS TABLE (
    product_name VARCHAR(32),
    products_shops VARCHAR(3),
    product_unit text,
    products_total text
) AS $$
BEGIN
    RETURN QUERY
    SELECT p.product_name, 
           CAST(COUNT(p.product_id) AS VARCHAR(3)) AS products_shops, 
           CONCAT('$', p.product_price) AS product_unit,
           CONCAT('$', (COUNT(p.product_id) * p.product_price)) AS products_total
    FROM shops s
    INNER JOIN client c ON s.client_id = c.client_id
    INNER JOIN products p ON s.product_id = p.product_id
    WHERE c.client_id = param_client_id
    GROUP BY p.product_name, p.product_price
    ORDER BY p.product_name;
END;
$$ LANGUAGE plpgsql;

CREATE or replace FUNCTION get_client_shops(p_client_id INTEGER) 
RETURNS INTEGER as $$
    DECLARE cart_shops INTEGER;
BEGIN
    SELECT COUNT(p.product_id) INTO cart_shops
    FROM shops s
    INNER JOIN client c ON s.client_id = c.client_id
    INNER JOIN products p ON s.product_id = p.product_id
    WHERE c.client_id = p_client_id;
    RETURN cart_shops;
END;
$$ language plpgsql;

CREATE OR REPLACE FUNCTION pay_products(param_client_id integer) 
RETURNS void AS $$
BEGIN 
	UPDATE client SET shops_id = NULL WHERE client_id = param_client_id;
	DELETE FROM shops WHERE client_id = param_client_id;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_client_shops_id_trigger
AFTER INSERT OR UPDATE ON shops
FOR EACH ROW
EXECUTE FUNCTION update_client_shops_id();


create or replace trigger update_products_trigger
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_column_date();

CREATE or replace TRIGGER update_shops_trigger
BEFORE UPDATE ON shops
FOR EACH ROW
EXECUTE FUNCTION update_column_date();

create or replace TRIGGER update_client_trigger
BEFORE UPDATE ON client
FOR EACH ROW
EXECUTE FUNCTION update_column_date();

create or replace view products_view as 
select  product_id, product_name, getCashFormat(product_price) 
as product_price from  products;

/*DML*/
ALTER TABLE shops ADD CONSTRAINT product_id_FK 
FOREIGN KEY (product_id) REFERENCES products(product_id)
ON DELETE CASCADE
ON update CASCADE;

ALTER TABLE shops ADD CONSTRAINT client_id_FK 
FOREIGN KEY (client_id) REFERENCES client(client_id)
ON delete cascade 
ON update CASCADE;

ALTER TABLE client ADD CONSTRAINT shops_id_FK 
FOREIGN KEY (shops_id) REFERENCES shops(shops_id)
ON delete cascade 
ON update CASCADE;

INSERT INTO products (product_name, product_price)
VALUES 
('iPhone 12', 799.00),
('iPhone 12 mini', 699.50),
('iPhone SE', 399.35),
('iPhone 11', 599.60),
('iPhone XR', 499.40),
('iPhone Xs', 899.20),
('iPhone Xs Max', 1099.20),
('iPhone 8', 449.22),
('iPhone 8 Plus', 549.56),
('iPhone 7', 349.87),
('iPhone 7 Plus', 449.24),
('iPhone 6s', 196.20),
('iPhone 6s Plus', 299.00),
('iPhone 6', 149.00);

insert into client(client_dni, client_name)  values('9999999999', 'Mathew Scars');
insert into client(client_dni, client_name)  values('1111111111', 'Mary Jane');
insert into client(client_dni, client_name)  values('2525252525', 'Jeff Mejia');
insert into shops(product_id, client_id) values(3, 1);
insert into shops(product_id, client_id) values(4, 1);
insert into shops(product_id, client_id) values(5, 1);
insert into shops(product_id, client_id) values(6, 2);
insert into shops(product_id, client_id) values(7, 2);
insert into shops(product_id, client_id) values(8, 2);
insert into shops(product_id, client_id) values(6, 3);
insert into shops(product_id, client_id) values(7, 3);
insert into shops(product_id, client_id) values(8, 3);