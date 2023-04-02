/*-------------------------------------- E-COMMERCE DATABASE DEVELOPED WITH POSGRESQL -------------------------------------------*/
/*DDL*/
DROP TABLE IF EXISTS products, client, shops cascade;

CREATE TABLE products(
	product_id serial PRIMARY KEY,
	product_name varchar(32) not null,
	product_price integer not null,
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

CREATE OR REPLACE FUNCTION getCashFormat(v_number integer)
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

CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_column_date();

CREATE TRIGGER update_shops_updated_at
BEFORE UPDATE ON shops
FOR EACH ROW
EXECUTE FUNCTION update_column_date();

CREATE TRIGGER update_client_updated_at
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
('iPhone 12', 799),
('iPhone 12 mini', 699),
('iPhone SE', 399),
('iPhone 11', 599),
('iPhone XR', 499),
('iPhone Xs', 899),
('iPhone Xs Max', 1099),
('iPhone 8', 449),
('iPhone 8 Plus', 549),
('iPhone 7', 349),
('iPhone 7 Plus', 449),
('iPhone 6s', 199),
('iPhone 6s Plus', 299),
('iPhone 6', 149);

create or replace view products_view as 
select  product_id, product_name, getCashFormat(product_price) as product_price 
from  products;

select * from products_view;