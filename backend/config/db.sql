-- backend/config/db.sql

-- Base de datos para 'granja_avicola' en PostgreSQL

-- Tabla: metodos_pago -ad
CREATE TABLE metodos_pago (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50),
    observaciones TEXT
);

-- Tabla: inventario...
CREATE TABLE inventario (
    id SERIAL PRIMARY KEY,
    nombre_producto VARCHAR(100) NOT NULL,
    descripcion TEXT,
    categoria VARCHAR(50) NOT NULL CHECK (categoria IN ('alimento', 'insumo', 'medicamento', 'herramienta', 'otro')),
    cantidad NUMERIC(10,2) NOT NULL DEFAULT 0,
    unidad VARCHAR(20) NOT NULL, -- Ej: kg, litros, unidades
    costo_unitario NUMERIC(10,2) NOT NULL CHECK (costo_unitario >= 0),
    valor_total NUMERIC(12,2) GENERATED ALWAYS AS (cantidad * costo_unitario) STORED,
    fecha_ingreso DATE NOT NULL DEFAULT CURRENT_DATE,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    proveedor VARCHAR(100),
    ubicacion VARCHAR(100), -- Ej: bodega 1, estante A2
    responsable VARCHAR(100),
    metodo_pago_id INT REFERENCES metodos_pago(id),
    observaciones TEXT
);



-- Tabla: incubadoras...
CREATE TABLE incubadoras (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    capacidad INT,
    ubicacion VARCHAR(100),
    estado VARCHAR(20) CHECK (estado IN ('operativa', 'mantenimiento', 'inactiva')) DEFAULT 'operativa',
    observaciones TEXT
);

-- Tabla: lotes_huevos...
CREATE TABLE lotes_huevos (
    id SERIAL PRIMARY KEY,
    incubadora_id INT REFERENCES incubadoras(id),
    fecha_ingreso DATE,
    cantidad_huevos INT,
    fecha_salida DATE,
    observaciones TEXT
);

-- Tabla: pollitos...
CREATE TABLE pollitos (
    id SERIAL PRIMARY KEY,
    lote_id INT REFERENCES lotes_huevos(id),
    fecha_nacimiento DATE,
    cantidad_vivos INT,
    cantidad_muertos INT,
    peso_promedio NUMERIC(5,2),
    observaciones TEXT
);

-- Tabla: pollos_produccion...
CREATE TABLE pollos_produccion (
    id SERIAL PRIMARY KEY,
    pollito_id INT REFERENCES pollitos(id),
    nombre VARCHAR(40),
    fecha_ingreso DATE NOT NULL,
    cantidad INT CHECK (cantidad > 0) NOT NULL,
    peso_inicial NUMERIC(5,2),
    fecha_actualizacion DATE DEFAULT CURRENT_DATE,
    observaciones TEXT
);
 
 
 CREATE TABLE bajas_pollos (
    id SERIAL PRIMARY KEY,
    pollo_id INT REFERENCES pollos_produccion(id),
    lote_id INT,
    causa VARCHAR(20) NOT NULL CHECK (causa IN ('muerte', 'venta')),
    cantidad INT CHECK (cantidad > 0) NOT NULL,
    fecha DATE DEFAULT CURRENT_DATE,
    observaciones TEXT
);

-- Tabla: vacunas...
CREATE TABLE vacunas (
    id SERIAL PRIMARY KEY,
    pollito_id INT REFERENCES pollitos(id),
    pollo_id INT REFERENCES pollos_produccion(id),
    fecha_aplicacion DATE,
    nombre_vacuna VARCHAR(100),
    cantidad_dosis INT,
    observaciones TEXT
);

-- Tabla: ventas_pollitos...
CREATE TABLE ventas_pollitos (
    id SERIAL PRIMARY KEY,
    pollito_id INT REFERENCES pollitos(id),
    fecha_venta DATE,
    cantidad_vendida INT,
    precio_unitario NUMERIC(10,2),
    cliente VARCHAR(100),
    metodo_pago_id INT REFERENCES metodos_pago(id),
    observaciones TEXT
);

-- Tabla: alimentacion_pollos...
CREATE TABLE alimentacion_pollos (
    id SERIAL PRIMARY KEY,
    pollo_id INT REFERENCES pollos_produccion(id),
    fecha DATE,
    tipo_alimento VARCHAR(100),
    cantidad_kg NUMERIC(10,2),
    proveedor VARCHAR(100),
    hora_aplicacion TIME,
    etapa_produccion VARCHAR(50) CHECK (etapa_produccion IN ('inicio', 'crecimiento', 'final')),
    observaciones TEXT
);

-- Tabla: ventas_pollos...
CREATE TABLE ventas_pollos (
    id SERIAL PRIMARY KEY,
    pollo_id INT REFERENCES pollos_produccion(id),
    fecha_venta DATE,
    peso_kg NUMERIC(5,2),
    precio_total NUMERIC(10,2),
    cliente_nombre VARCHAR(100),
    cliente_contacto VARCHAR(100),
    metodo_pago_id INT REFERENCES metodos_pago(id),
    observaciones TEXT
);

-- Tabla: trabajadores...
CREATE TABLE trabajadores (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    cedula VARCHAR(20),
    telefono VARCHAR(20),
    cargo VARCHAR(50),
    fecha_ingreso DATE,
    estado VARCHAR(20) CHECK (estado IN ('activo', 'inactivo')) DEFAULT 'activo',
    observaciones TEXT
);

-- Tabla: pagos_trabajadores...
CREATE TABLE pagos_trabajadores (
    id SERIAL PRIMARY KEY,
    trabajador_id INT REFERENCES trabajadores(id),
    fecha_pago DATE,
    monto NUMERIC(10,2),
    metodo_pago_id INT REFERENCES metodos_pago(id),
    observaciones TEXT
);

-- Tabla: gastos_generales...
CREATE TABLE gastos_generales (
    id SERIAL PRIMARY KEY,
    fecha DATE,
    descripcion VARCHAR(255),
    monto NUMERIC(10,2),
    tipo VARCHAR(20) CHECK (tipo IN ('compra', 'mantenimiento', 'sueldo', 'otro')),
    observaciones TEXT
);

-- Tabla: compra_esencial...
CREATE TABLE inversion_compras (
    id SERIAL PRIMARY KEY,
    nombre_producto VARCHAR(100),
    cantidad NUMERIC(10,2),
    unidad VARCHAR(20),
    costo_unitario NUMERIC(10,2),
    fecha_compra DATE,
    proveedor VARCHAR(100),
    metodo_pago_id INT REFERENCES metodos_pago(id),
    observaciones TEXT
);

-- Tabla: usuarios...
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre_usuario VARCHAR(50) UNIQUE,
    contraseña VARCHAR(255),
    rol VARCHAR(20) CHECK (rol IN ('admin', 'empleado')) DEFAULT 'empleado',
    observaciones TEXT
);

-- Tabla: contabilidad_general
CREATE TABLE contabilidad_general (
    id SERIAL PRIMARY KEY,
    fecha DATE NOT NULL,
    descripcion TEXT NOT NULL,
    tipo_operacion VARCHAR(10) CHECK (tipo_operacion IN ('ingreso', 'egreso')),
    monto NUMERIC(12,2) NOT NULL,
    origen VARCHAR(50),
    referencia_id INT,
    observaciones TEXT
);

-- Tabla: eventos_generales
CREATE TABLE eventos_generales (
    id SERIAL PRIMARY KEY,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tabla_origen VARCHAR(50) NOT NULL,
    registro_id INT NOT NULL,          
    tipo_evento VARCHAR(100),
    descripcion TEXT,
    solucion TEXT,
    observaciones TEXT
);


-- Tabla: eventos
CREATE TABLE eventos (
    id SERIAL PRIMARY KEY,
    lote_id INT REFERENCES lotes_huevos(id),
    fecha DATE,
    tipo_evento VARCHAR(100),
    descripcion TEXT,
    solucion TEXT,
    observaciones TEXT
);


-- Índices adicionales
CREATE INDEX idx_fecha_venta ON ventas_pollitos(fecha_venta);
CREATE INDEX idx_pago_trabajador ON pagos_trabajadores(trabajador_id, fecha_pago);

-- Datos iniciales
INSERT INTO metodos_pago (nombre) VALUES ('efectivo'), ('transferencia'), ('otro');

-- FUNCIONES Y TRIGGERS PARA EVENTOS

CREATE OR REPLACE FUNCTION validar_baja_pollos()
RETURNS TRIGGER AS $$
DECLARE
    cantidad_disponible INT;
BEGIN
    SELECT 
        p.cantidad - COALESCE(SUM(b.cantidad), 0)
    INTO cantidad_disponible
    FROM pollos_produccion p
    LEFT JOIN bajas_pollos b ON p.id = b.pollo_id
    WHERE p.id = NEW.pollo_id
    GROUP BY p.cantidad;

    IF NEW.cantidad > cantidad_disponible THEN
        RAISE EXCEPTION 'No se pueden dar de baja % pollos. Solo hay % disponibles.', NEW.cantidad, cantidad_disponible;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_validar_bajas
BEFORE INSERT ON bajas_pollos
FOR EACH ROW
EXECUTE FUNCTION validar_baja_pollos();







--funcion para agregar observaciones a vento 

CREATE OR REPLACE FUNCTION registrar_evento()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO eventos_generales (fecha, tabla_origen, registro_id, tipo_evento, descripcion, solucion, observaciones)
    VALUES (
        CURRENT_TIMESTAMP,
        TG_TABLE_NAME,
        NEW.id,
        'registro',
        'Nuevo registro insertado en la tabla ' || TG_TABLE_NAME,
        NULL,
        NEW.observaciones
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- TRIGGERS para evento

CREATE TRIGGER trigger_evento_eventos
AFTER INSERT ON eventos
FOR EACH ROW
EXECUTE FUNCTION registrar_evento();

CREATE TRIGGER trigger_evento_inventario
AFTER INSERT ON inventario
FOR EACH ROW
EXECUTE FUNCTION registrar_evento();

CREATE TRIGGER trigger_evento_incubadoras
AFTER INSERT ON incubadoras
FOR EACH ROW
EXECUTE FUNCTION registrar_evento();

CREATE TRIGGER trigger_evento_lotes_huevos
AFTER INSERT ON lotes_huevos
FOR EACH ROW
EXECUTE FUNCTION registrar_evento();

CREATE TRIGGER trigger_evento_pollitos
AFTER INSERT ON pollitos
FOR EACH ROW
EXECUTE FUNCTION registrar_evento();

CREATE TRIGGER trigger_evento_pollos_produccion
AFTER INSERT ON pollos_produccion
FOR EACH ROW
EXECUTE FUNCTION registrar_evento();

CREATE TRIGGER trigger_evento_vacunas
AFTER INSERT ON vacunas
FOR EACH ROW
EXECUTE FUNCTION registrar_evento();

CREATE TRIGGER trigger_evento_ventas_pollitos
AFTER INSERT ON ventas_pollitos
FOR EACH ROW
EXECUTE FUNCTION registrar_evento();

CREATE TRIGGER trigger_evento_alimentacion_pollos
AFTER INSERT ON alimentacion_pollos
FOR EACH ROW
EXECUTE FUNCTION registrar_evento();

CREATE TRIGGER trigger_evento_metodos_pago
AFTER INSERT ON metodos_pago
FOR EACH ROW
EXECUTE FUNCTION registrar_evento();

CREATE TRIGGER trigger_evento_ventas_pollos
AFTER INSERT ON ventas_pollos
FOR EACH ROW
EXECUTE FUNCTION registrar_evento();

CREATE TRIGGER trigger_evento_trabajadores
AFTER INSERT ON trabajadores
FOR EACH ROW
EXECUTE FUNCTION registrar_evento();

CREATE TRIGGER trigger_evento_pagos_trabajadores
AFTER INSERT ON pagos_trabajadores
FOR EACH ROW
EXECUTE FUNCTION registrar_evento();

CREATE TRIGGER trigger_evento_gastos_generales
AFTER INSERT ON gastos_generales
FOR EACH ROW
EXECUTE FUNCTION registrar_evento();

CREATE TRIGGER trigger_evento_inversion_compras
AFTER INSERT ON inversion_compras
FOR EACH ROW
EXECUTE FUNCTION registrar_evento();

CREATE TRIGGER trigger_evento_usuarios
AFTER INSERT ON usuarios
FOR EACH ROW
EXECUTE FUNCTION registrar_evento();

CREATE TRIGGER trigger_evento_contabilidad_general
AFTER INSERT ON contabilidad_general
FOR EACH ROW
EXECUTE FUNCTION registrar_evento();

-- FUNCIONES Y TRIGGERS PARA CONTABILIDAD

-- Función: agregar ingreso o egreso a contabilidad
CREATE OR REPLACE FUNCTION insertar_contabilidad()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_TABLE_NAME = 'ventas_pollitos' THEN
        INSERT INTO contabilidad_general (fecha, descripcion, tipo_operacion, monto, origen, referencia_id, observaciones)
        VALUES (NEW.fecha_venta, 'Venta de pollitos', 'ingreso', NEW.cantidad_vendida * NEW.precio_unitario, TG_TABLE_NAME, NEW.id, NEW.observaciones);

    ELSIF TG_TABLE_NAME = 'ventas_pollos' THEN
        INSERT INTO contabilidad_general (fecha, descripcion, tipo_operacion, monto, origen, referencia_id, observaciones)
        VALUES (NEW.fecha_venta, 'Venta de pollos', 'ingreso', NEW.precio_total, TG_TABLE_NAME, NEW.id, NEW.observaciones);

    ELSIF TG_TABLE_NAME = 'pagos_trabajadores' THEN
        INSERT INTO contabilidad_general (fecha, descripcion, tipo_operacion, monto, origen, referencia_id, observaciones)
        VALUES (NEW.fecha_pago, 'Pago a trabajador', 'egreso', NEW.monto, TG_TABLE_NAME, NEW.id, NEW.observaciones);

    ELSIF TG_TABLE_NAME = 'gastos_generales' THEN
        INSERT INTO contabilidad_general (fecha, descripcion, tipo_operacion, monto, origen, referencia_id, observaciones)
        VALUES (NEW.fecha, 'Gasto general: ' || NEW.tipo, 'egreso', NEW.monto, TG_TABLE_NAME, NEW.id, NEW.observaciones);

    ELSIF TG_TABLE_NAME = 'inversion_compras' THEN
        INSERT INTO contabilidad_general (fecha, descripcion, tipo_operacion, monto, origen, referencia_id, observaciones)
        VALUES (NEW.fecha_compra, 'Inversión en compra: ' || NEW.nombre_producto, 'egreso', NEW.cantidad * NEW.costo_unitario, TG_TABLE_NAME, NEW.id, NEW.observaciones);

    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- Triggers para insertar contabilidad
CREATE TRIGGER trigger_contabilidad_ventas_pollitos
AFTER INSERT ON ventas_pollitos
FOR EACH ROW EXECUTE FUNCTION insertar_contabilidad();

CREATE TRIGGER trigger_contabilidad_ventas_pollos
AFTER INSERT ON ventas_pollos
FOR EACH ROW EXECUTE FUNCTION insertar_contabilidad();

CREATE TRIGGER trigger_contabilidad_pagos_trabajadores
AFTER INSERT ON pagos_trabajadores
FOR EACH ROW EXECUTE FUNCTION insertar_contabilidad();

CREATE TRIGGER trigger_contabilidad_gastos_generales
AFTER INSERT ON gastos_generales
FOR EACH ROW EXECUTE FUNCTION insertar_contabilidad();

CREATE TRIGGER trigger_contabilidad_inversion_compras
AFTER INSERT ON inversion_compras
FOR EACH ROW EXECUTE FUNCTION insertar_contabilidad();



-- -- Insertar trabajadores
 INSERT INTO trabajadores (nombre, cedula, telefono, cargo, fecha_ingreso)
 VALUES ('Carlos Pérez', '1234567890', '3001234567', 'Operario', '2024-12-01');

-- -- Insertar métodos de pago ya fue hecho, pero repetimos para prueba si es necesario
 INSERT INTO metodos_pago (nombre) VALUES ('tarjeta');

-- -- Insertar inventario
 INSERT INTO inventario (nombre_producto, descripcion, categoria, cantidad, unidad, costo_unitario, proveedor, ubicacion, responsable, metodo_pago_id, observaciones)
 VALUES ('Maíz molido', 'Alimento para pollos', 'alimento', 100.0, 'kg', 1.50, 'AgroInsumos S.A.', 'Bodega 1', 'Carlos Pérez', 1, 'Compra inicial');

-- -- Insertar incubadora
 INSERT INTO incubadoras (nombre, capacidad, ubicacion, estado)
 VALUES ('Incubadora A1', 500, 'Zona 1', 'operativa');

-- -- Insertar lote de huevos
 INSERT INTO lotes_huevos (incubadora_id, fecha_ingreso, cantidad_huevos, observaciones)
 VALUES (1, '2025-01-01', 300, 'Huevos fértiles');

-- -- Insertar pollitos
 INSERT INTO pollitos (lote_id, fecha_nacimiento, cantidad_vivos, cantidad_muertos, peso_promedio, observaciones)
 VALUES (1, '2025-01-21', 280, 20, 0.05, 'Buena eclosión');

-- -- Insertar pollos producción
INSERT INTO pollos_produccion (pollito_id, nombre, fecha_ingreso, cantidad, peso_inicial)
 VALUES (1, 'diego', '2025-01-22', 5, 0.05);

-- -- Insertar vacunas
 INSERT INTO vacunas (pollito_id, pollo_id, fecha_aplicacion, nombre_vacuna, cantidad_dosis, observaciones)
 VALUES (1, 1, '2025-01-23', 'Vacuna A', 1, 'Primera dosis aplicada');

-- -- Alimentación pollos
 INSERT INTO alimentacion_pollos (pollo_id, fecha, tipo_alimento, cantidad_kg, proveedor, hora_aplicacion, etapa_produccion, observaciones)
 VALUES (1, '2025-01-25', 'Concentrado inicial', 0.1, 'NutriPollos', '07:00', 'inicio', 'Primera ración');

-- -- Venta de pollitos
 INSERT INTO ventas_pollitos (pollito_id, fecha_venta, cantidad_vendida, precio_unitario, cliente, metodo_pago_id, observaciones)
 VALUES (1, '2025-01-30', 50, 2000, 'Granja Aliada', 1, 'Primera venta');

-- -- Venta de pollos
 INSERT INTO ventas_pollos (pollo_id, fecha_venta, peso_kg, precio_total, cliente_nombre, cliente_contacto, metodo_pago_id, observaciones)
 VALUES (1, '2025-02-15', 2.5, 25000, 'Mercado Central', '3111234567', 1, 'Venta completa');

-- -- Pagos a trabajadores
 INSERT INTO pagos_trabajadores (trabajador_id, fecha_pago, monto, metodo_pago_id, observaciones)
 VALUES (1, '2025-01-31', 1500000, 1, 'Pago mensual enero');

-- -- Gastos generales
 INSERT INTO gastos_generales (fecha, descripcion, monto, tipo, observaciones)
 VALUES ('2025-01-05', 'Reparación incubadora', 50000, 'mantenimiento', 'Revisión de motor');

-- -- Compras esenciales (inversiones)
 INSERT INTO inversion_compras (nombre_producto, cantidad, unidad, costo_unitario, fecha_compra, proveedor, metodo_pago_id, observaciones)
 VALUES ('Bebederos', 20, 'unidades', 15000, '2025-01-03', 'AvícolaPro', 1, 'Compra inicial de equipos');

-- -- Usuarios
 INSERT INTO usuarios (nombre_usuario, contraseña, rol, observaciones)
 VALUES ('admin01', '123456', 'admin', 'Usuario de prueba');

-- -- Eventos adicionales manuales
 INSERT INTO eventos (lote_id, fecha, tipo_evento, descripcion, solucion, observaciones)
 VALUES (1, '2025-01-10', 'temperatura', 'Incubadora con temperatura baja', 'Ajustar termostato', 'Evento crítico');

-- -- Verificar contenido de eventos_generales
 SELECT * FROM eventos_generales;

 -- Verificar contabilidad
 SELECT * FROM contabilidad_general;
