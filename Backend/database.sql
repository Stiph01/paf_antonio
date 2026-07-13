-- Script para la Base de Datos de Gestión de Eventos Académicos
-- Este script crea la base de datos y sus tablas asociadas e introduce datos de prueba.

CREATE DATABASE IF NOT EXISTS `gestion_eventos_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `gestion_eventos_db`;

-- 1. Tabla de Eventos
CREATE TABLE IF NOT EXISTS `eventos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `titulo` VARCHAR(255) NOT NULL,
  `descripcion` TEXT,
  `tipo` VARCHAR(50) NOT NULL, -- 'Conferencia', 'Taller', 'Seminario'
  `fecha` DATE NOT NULL,
  `hora` TIME NOT NULL,
  `lugar` VARCHAR(255) NOT NULL,
  `capacidad` INT NOT NULL,
  `expositor` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Tabla de Participantes
CREATE TABLE IF NOT EXISTS `participantes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(255) NOT NULL,
  `correo` VARCHAR(255) NOT NULL UNIQUE,
  `rol` VARCHAR(50) NOT NULL, -- 'Estudiante', 'Docente'
  `codigo` VARCHAR(50) NOT NULL UNIQUE, -- Código Universitario
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Tabla de Inscripciones (Relación Muchos a Muchos con validación de unicidad)
CREATE TABLE IF NOT EXISTS `inscripciones` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `evento_id` INT NOT NULL,
  `participante_id` INT NOT NULL,
  `fecha_inscripcion` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`evento_id`) REFERENCES `eventos`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`participante_id`) REFERENCES `participantes`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `inscripcion_unica` (`evento_id`, `participante_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Inserción de Datos Iniciales (Seed Data)
-- Eventos
INSERT INTO `eventos` (`titulo`, `descripcion`, `tipo`, `fecha`, `hora`, `lugar`, `capacidad`, `expositor`) VALUES
('Congreso de Inteligencia Artificial 2026', 'Explorando las fronteras del Machine Learning, Deep Learning y la IA generativa aplicada en la educación universitaria.', 'Conferencia', '2026-08-15', '09:00:00', 'Auditorio Principal Pabellón A', 150, 'Dr. Roberto Thorne'),
('Taller Práctico de React & Node.js', 'Construcción y despliegue de una aplicación web moderna paso a paso. Se requiere laptop propia.', 'Taller', '2026-08-20', '14:00:00', 'Laboratorio de Computación L-204', 30, 'Mg. Ana Cecilia Pérez'),
('Seminario de Metodologías Ágiles', 'Gestión de proyectos con Scrum, Kanban y XP en entornos de desarrollo ágiles.', 'Seminario', '2026-08-25', '11:00:00', 'Aula Magna 102', 80, 'Ing. Carlos Mendoza');

-- Participantes
INSERT INTO `participantes` (`nombre`, `correo`, `rol`, `codigo`) VALUES
('Antonio Flores', 'antonio.flores@universidad.edu.pe', 'Estudiante', '202110543'),
('María Rodríguez', 'maria.rodriguez@universidad.edu.pe', 'Estudiante', '202220491'),
('Dr. Julio Cerna', 'julio.cerna@universidad.edu.pe', 'Docente', 'D-99882'),
('Ing. Patricia Ruiz', 'patricia.ruiz@universidad.edu.pe', 'Docente', 'D-99415');

-- Inscripciones
INSERT INTO `inscripciones` (`evento_id`, `participante_id`) VALUES
(1, 1), -- Antonio en Congreso de IA
(1, 2), -- María en Congreso de IA
(2, 1), -- Antonio en Taller React
(3, 3); -- Dr. Julio en Seminario Ágil
