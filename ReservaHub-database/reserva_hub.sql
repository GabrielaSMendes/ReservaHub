-- =====================================================
-- RESERVA HUB - BANCO DE DADOS
-- Sistema de reservas para coworkings
-- =====================================================
DROP DATABASE IF EXISTS reserva_hub;
CREATE DATABASE IF NOT EXISTS reserva_hub;
USE reserva_hub;

-- =====================================================
-- TABELA PERFIL
-- =====================================================

CREATE TABLE perfil (
    id_perfil INT AUTO_INCREMENT PRIMARY KEY,
    nome_perfil VARCHAR(30) NOT NULL UNIQUE
);

-- =====================================================
-- TABELA USUARIO
-- =====================================================

CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,

    nome VARCHAR(100) NOT NULL,

    cpf VARCHAR(14) NOT NULL UNIQUE,

    email VARCHAR(120) NOT NULL UNIQUE,

    senha VARCHAR(255) NOT NULL,

    telefone VARCHAR(20),

    ativo BOOLEAN NOT NULL DEFAULT TRUE,

    id_perfil INT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_usuario_perfil
    FOREIGN KEY (id_perfil)
    REFERENCES perfil(id_perfil)
);

-- =====================================================
-- TABELA SALA
-- =====================================================

CREATE TABLE sala (
    id_sala INT AUTO_INCREMENT PRIMARY KEY,

    nome_sala VARCHAR(100) NOT NULL,

    descricao TEXT,

    capacidade INT NOT NULL,

    status BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- TABELA RECURSO
-- =====================================================

CREATE TABLE recurso (
    id_recurso INT AUTO_INCREMENT PRIMARY KEY,

    nome_recurso VARCHAR(100) NOT NULL UNIQUE
);

-- =====================================================
-- TABELA RELACIONAL SALA_RECURSO
-- =====================================================

CREATE TABLE sala_recurso (
    id_sala INT NOT NULL,
    id_recurso INT NOT NULL,

    PRIMARY KEY (id_sala, id_recurso),

    CONSTRAINT fk_sala_recurso_sala
    FOREIGN KEY (id_sala)
    REFERENCES sala(id_sala)
    ON DELETE CASCADE,

    CONSTRAINT fk_sala_recurso_recurso
    FOREIGN KEY (id_recurso)
    REFERENCES recurso(id_recurso)
    ON DELETE CASCADE
);

-- =====================================================
-- TABELA HORARIO FUNCIONAMENTO
-- =====================================================

CREATE TABLE horario_funcionamento (
    id_horario INT AUTO_INCREMENT PRIMARY KEY,

    dia_semana ENUM(
        'SEGUNDA',
        'TERCA',
        'QUARTA',
        'QUINTA',
        'SEXTA',
        'SABADO',
        'DOMINGO'
    ) NOT NULL,

    hora_abertura TIME NOT NULL,

    hora_fechamento TIME NOT NULL
);

-- =====================================================
-- TABELA RESERVA
-- =====================================================

CREATE TABLE reserva (
    id_reserva INT AUTO_INCREMENT PRIMARY KEY,

    id_usuario INT NOT NULL,

    id_sala INT NOT NULL,

    data_reserva DATE NOT NULL,

    hora_inicio TIME NOT NULL,

    hora_fim TIME NOT NULL,

    status ENUM(
        'ATIVA',
        'CANCELADA',
        'FINALIZADA'
    ) NOT NULL DEFAULT 'ATIVA',

    observacao TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_reserva_usuario
    FOREIGN KEY (id_usuario)
    REFERENCES usuario(id_usuario),

    CONSTRAINT fk_reserva_sala
    FOREIGN KEY (id_sala)
    REFERENCES sala(id_sala)
);

ALTER TABLE reserva
ADD CONSTRAINT uq_reserva_horario
UNIQUE (
    id_sala,
    data_reserva,
    hora_inicio,
    hora_fim
);

-- =====================================================
-- TABELA HISTORICO RESERVA
-- =====================================================

CREATE TABLE historico_reserva (
    id_historico INT AUTO_INCREMENT PRIMARY KEY,

    id_reserva INT NOT NULL,

    acao ENUM(
        'CRIADA',
        'EDITADA',
        'CANCELADA'
    ) NOT NULL,

    descricao TEXT,

    data_acao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_historico_reserva
    FOREIGN KEY (id_reserva)
    REFERENCES reserva(id_reserva)
    ON DELETE CASCADE
);

-- =====================================================
-- TABELA RECUPERACAO SENHA
-- =====================================================

CREATE TABLE recuperacao_senha (
    id_recuperacao INT AUTO_INCREMENT PRIMARY KEY,

    id_usuario INT NOT NULL,

    token VARCHAR(255) NOT NULL UNIQUE,

    expiracao DATETIME NOT NULL,

    usado BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_recuperacao_usuario
    FOREIGN KEY (id_usuario)
    REFERENCES usuario(id_usuario)
    ON DELETE CASCADE
);

-- =====================================================
-- TABELA AUDITORIA
-- =====================================================

CREATE TABLE auditoria (
    id_auditoria INT AUTO_INCREMENT PRIMARY KEY,

    tabela_afetada VARCHAR(100) NOT NULL,

    acao VARCHAR(50) NOT NULL,

    usuario_responsavel VARCHAR(100),

    data_acao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- INDICES
-- =====================================================

CREATE INDEX idx_usuario_email
ON usuario(email);

CREATE INDEX idx_usuario_cpf
ON usuario(cpf);

CREATE INDEX idx_reserva_data
ON reserva(data_reserva);

CREATE INDEX idx_reserva_status
ON reserva(status);
