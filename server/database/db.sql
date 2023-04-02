/*-------------------------------------- E-COMMERCE DATABASE DEVELOPED WITH POSGRESQL -------------------------------------------*/
/*DDL*/
DROP TABLE IF EXISTS products, client, shops cascade;
DROP TRIGGER IF EXISTS update_products_trigger ON products;
DROP TRIGGER IF EXISTS update_clients_trigger ON client;
DROP TRIGGER IF EXISTS update_shops_trigger ON shops;

DROP FUNCTION IF EXISTS register_user, 
getCashFormat(decimal), 
update_column_date;

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
	client_dni varchar(10) not null,
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

create or replace function register_user(p_dni varchar(10), p_name varchar(32))
  returns varchar(32) as $$
  declare
  	v_max_dni integer :=10;
  	v_max_name integer := 32; 
  
  begin 
    if p_dni is null or length(p_dni) != v_max_dni then
      return 'Error: La cédula debe tener 10 caracteres';
	elsif p_name is null then
	  return 'Error: El nombre no es obligatorio';
	elsif trim(p_name) = '' or length(trim(p_name)) > v_max_name then
	  return 'Error: El nombre debe tener entre 1 y 32 caracteres';
	else
	  insert into client(client_dni, client_name) 
	  values(p_dni, p_name);
	  return 'Registrado con éxito';
	end if;
  end;
$$ LANGUAGE plpgsql;

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


/*DML*/
ALTER TABLE shops ADD CONSTRAINT product_id_FK 
FOREIGN KEY (product_id) REFERENCES products(product_id)
ON DELETE CASCADE;

ALTER TABLE shops ADD CONSTRAINT client_id_FK 
FOREIGN KEY (client_id) REFERENCES client(client_id)
ON DELETE CASCADE;

ALTER TABLE client ADD CONSTRAINT shops_id_FK 
FOREIGN KEY (shops_id) REFERENCES shops(shops_id)
ON DELETE CASCADE;

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

create or replace view products_view as 
select  product_id, product_name, getCashFormat(product_price) 
as product_price from  products;

select * from products_view;
select * from register_user('1234567899', 'Jefferson mejia');
select * from client;


