-- =========================================================
-- Sistema de Reservaciones de Restaurante
-- Script de creación de base de datos + datos semilla (seed)
-- Motor: PostgreSQL 13+
-- =========================================================

-- Limpieza previa (útil en entornos de desarrollo/pruebas)
DROP TABLE IF EXISTS reservaciones CASCADE;
DROP TABLE IF EXISTS mesas CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;
DROP TYPE IF EXISTS rol_usuario;
DROP TYPE IF EXISTS estado_reservacion;

-- =========================================================
-- Tipos personalizados (ENUM)
-- =========================================================
CREATE TYPE rol_usuario AS ENUM ('cliente', 'admin');
CREATE TYPE estado_reservacion AS ENUM ('pendiente', 'confirmada', 'cancelada', 'completada');

-- =========================================================
-- Tabla: usuarios
-- =========================================================
CREATE TABLE usuarios (
    id             SERIAL PRIMARY KEY,
    nombre         VARCHAR(100) NOT NULL,
    email          VARCHAR(150) NOT NULL UNIQUE,
    password_hash  VARCHAR(255) NOT NULL,
    rol            rol_usuario NOT NULL DEFAULT 'cliente',
    creado_en      TIMESTAMP NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE usuarios IS 'Clientes y administradores del sistema';
COMMENT ON COLUMN usuarios.password_hash IS 'Contraseña encriptada con bcrypt, nunca en texto plano';

-- =========================================================
-- Tabla: mesas
-- =========================================================
CREATE TABLE mesas (
    id          SERIAL PRIMARY KEY,
    numero      INT NOT NULL UNIQUE,
    capacidad   INT NOT NULL CHECK (capacidad > 0),
    ubicacion   VARCHAR(100),
    activa      BOOLEAN NOT NULL DEFAULT TRUE, -- soft delete: FALSE = mesa desactivada
    creado_en   TIMESTAMP NOT NULL DEFAULT NOW()
);

COMMENT ON COLUMN mesas.activa IS 'Se usa para soft delete en lugar de borrar el registro';

-- =========================================================
-- Tabla: reservaciones
-- =========================================================
CREATE TABLE reservaciones (
    id              SERIAL PRIMARY KEY,
    usuario_id      INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    mesa_id         INT NOT NULL REFERENCES mesas(id) ON DELETE RESTRICT,
    fecha           DATE NOT NULL,
    hora            TIME NOT NULL,
    num_comensales  INT NOT NULL CHECK (num_comensales > 0),
    estado          estado_reservacion NOT NULL DEFAULT 'pendiente',
    creado_en       TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Evita que la misma mesa se reserve dos veces en el mismo bloque
-- de fecha/hora, siempre que la reservación no esté cancelada.
CREATE UNIQUE INDEX idx_mesa_fecha_hora_activa
    ON reservaciones (mesa_id, fecha, hora)
    WHERE estado <> 'cancelada';

-- Índices de apoyo para consultas frecuentes
CREATE INDEX idx_reservaciones_usuario ON reservaciones (usuario_id);
CREATE INDEX idx_reservaciones_estado  ON reservaciones (estado);

-- =========================================================
-- Datos semilla (seed)
-- =========================================================

-- Usuario administrador
-- Contraseña de ejemplo: "Admin123!" (debe generarse el hash real con bcrypt en el backend)
-- El hash de abajo corresponde a "Admin123!" con bcrypt (10 rounds), úsalo solo como referencia.
INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES
('Administrador General', 'admin@restaurante.com', '$2b$10$W3JmZgYQ0z8m9y2n7Kx6C.ZqYy2yqjWQwq0lU3F8yYq0m6z8u1s3S', 'admin');

-- Usuarios clientes de ejemplo
-- Contraseña de ejemplo para ambos: "Cliente123!" (mismo criterio, reemplazar con hash real)
INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES
('Juan Pérez',  'juan.perez@example.com',  '$2b$10$8kq0m6z8u1s3SW3JmZgYQ0z8m9y2n7Kx6C.ZqYy2yqjWQwq0lU3F', 'cliente'),
('María López', 'maria.lopez@example.com', '$2b$10$C.ZqYy2yqjWQwq0lU3F8yYq0m6z8u1s3SW3JmZgYQ0z8m9y2n7Kx6', 'cliente');

-- Catálogo de mesas
INSERT INTO mesas (numero, capacidad, ubicacion, activa) VALUES
(1, 2, 'Terraza',        TRUE),
(2, 4, 'Salón principal', TRUE),
(3, 4, 'Salón principal', TRUE),
(4, 6, 'Salón privado',   TRUE),
(5, 2, 'Barra',           TRUE),
(6, 8, 'Salón privado',   TRUE),
(7, 4, 'Terraza',         FALSE); -- mesa desactivada, ejemplo de soft delete

-- Reservaciones de ejemplo
INSERT INTO reservaciones (usuario_id, mesa_id, fecha, hora, num_comensales, estado) VALUES
(2, 1, CURRENT_DATE + INTERVAL '1 day', '19:00', 2, 'confirmada'),
(3, 2, CURRENT_DATE + INTERVAL '2 day', '20:30', 4, 'pendiente'),
(2, 4, CURRENT_DATE + INTERVAL '3 day', '13:00', 5, 'pendiente');

-- =========================================================
-- Notas para los estudiantes
-- =========================================================
-- 1. Los password_hash de este seed son solo ejemplos ilustrativos;
--    NO corresponden realmente a las contraseñas indicadas en los comentarios.
--    Deben generar sus propios hashes usando bcrypt desde Node.js
--    (por ejemplo con el script de seed de su backend) antes de poder
--    iniciar sesión con esos usuarios.
-- 2. El índice único parcial "idx_mesa_fecha_hora_activa" es la forma
--    recomendada de validar en base de datos que una mesa no esté
--    doblemente reservada en el mismo bloque de fecha/hora.
-- 3. Usen "activa = FALSE" en mesas para implementar el soft delete
--    del endpoint DELETE /api/mesas/:id, en vez de borrar la fila.
