-- =====================================================
-- RESERVA HUB - DADOS PARA TESTE
-- Execute este script depois de criar o banco com reserva_hub.sql
-- =====================================================

USE reserva_hub;

SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE auditoria;
TRUNCATE TABLE recuperacao_senha;
TRUNCATE TABLE historico_reserva;
TRUNCATE TABLE reserva;
TRUNCATE TABLE sala_recurso;
TRUNCATE TABLE horario_funcionamento;
TRUNCATE TABLE recurso;
TRUNCATE TABLE sala;
TRUNCATE TABLE usuario;
TRUNCATE TABLE perfil;

SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================
-- PERFIS
-- O backend atual usa id_perfil = 1 ao criar usuarios.
-- =====================================================

INSERT INTO perfil (id_perfil, nome_perfil) VALUES
(1, 'CLIENTE'),
(2, 'ADMINISTRADOR');

-- =====================================================
-- USUARIOS
-- Senhas simples apenas para ambiente de teste.
-- =====================================================

INSERT INTO usuario (id_usuario, nome, cpf, email, senha, telefone, ativo, id_perfil) VALUES
(1, 'Ana Souza', '111.111.111-11', 'ana.souza@email.com', '123456', '(11) 99999-1111', TRUE, 1),
(2, 'Bruno Lima', '222.222.222-22', 'bruno.lima@email.com', '123456', '(11) 99999-2222', TRUE, 1),
(3, 'Carla Mendes', '333.333.333-33', 'carla.mendes@email.com', '123456', '(11) 99999-3333', TRUE, 1),
(4, 'Diego Admin', '444.444.444-44', 'admin@reservahub.com', 'admin123', '(11) 99999-4444', TRUE, 2);

-- =====================================================
-- SALAS
-- =====================================================

INSERT INTO sala (id_sala, nome_sala, descricao, capacidade, status) VALUES
(1, 'Sala Azul', 'Sala pequena para reunioes rapidas.', 4, TRUE),
(2, 'Sala Verde', 'Sala media com projetor.', 8, TRUE),
(3, 'Sala Premium', 'Sala grande para treinamentos e apresentacoes.', 20, TRUE),
(4, 'Sala Manutencao', 'Sala indisponivel temporariamente.', 6, FALSE);

-- =====================================================
-- RECURSOS
-- =====================================================

INSERT INTO recurso (id_recurso, nome_recurso) VALUES
(1, 'Projetor'),
(2, 'Quadro branco'),
(3, 'TV'),
(4, 'Videoconferencia'),
(5, 'Ar-condicionado');

INSERT INTO sala_recurso (id_sala, id_recurso) VALUES
(1, 2),
(1, 5),
(2, 1),
(2, 2),
(2, 5),
(3, 1),
(3, 2),
(3, 3),
(3, 4),
(3, 5),
(4, 2);

-- =====================================================
-- HORARIOS DE FUNCIONAMENTO
-- =====================================================

INSERT INTO horario_funcionamento (id_horario, dia_semana, hora_abertura, hora_fechamento) VALUES
(1, 'SEGUNDA', '08:00:00', '18:00:00'),
(2, 'TERCA', '08:00:00', '18:00:00'),
(3, 'QUARTA', '08:00:00', '18:00:00'),
(4, 'QUINTA', '08:00:00', '18:00:00'),
(5, 'SEXTA', '08:00:00', '18:00:00'),
(6, 'SABADO', '09:00:00', '13:00:00');

-- =====================================================
-- RESERVAS
-- Inclui reservas ativas, canceladas e finalizadas.
-- =====================================================

INSERT INTO reserva (
    id_reserva,
    id_usuario,
    id_sala,
    data_reserva,
    hora_inicio,
    hora_fim,
    status,
    observacao
) VALUES
(1, 1, 1, '2026-06-01', '09:00:00', '10:00:00', 'ATIVA', 'Reuniao com cliente.'),
(2, 2, 2, '2026-06-01', '10:00:00', '12:00:00', 'ATIVA', 'Planejamento da equipe.'),
(3, 3, 3, '2026-06-02', '14:00:00', '17:00:00', 'ATIVA', 'Treinamento interno.'),
(4, 1, 2, '2026-05-20', '09:00:00', '10:00:00', 'FINALIZADA', 'Reserva ja finalizada.'),
(5, 2, 1, '2026-05-21', '15:00:00', '16:00:00', 'CANCELADA', 'Cancelada pelo usuario.');

-- =====================================================
-- HISTORICO DE RESERVAS
-- =====================================================

INSERT INTO historico_reserva (id_historico, id_reserva, acao, descricao) VALUES
(1, 1, 'CRIADA', 'Reserva criada para teste.'),
(2, 2, 'CRIADA', 'Reserva criada para teste.'),
(3, 3, 'CRIADA', 'Reserva criada para teste.'),
(4, 4, 'CRIADA', 'Reserva criada para teste.'),
(5, 5, 'CRIADA', 'Reserva criada para teste.'),
(6, 5, 'CANCELADA', 'Reserva cancelada para teste.');

-- =====================================================
-- AUDITORIA
-- =====================================================

INSERT INTO auditoria (id_auditoria, tabela_afetada, acao, usuario_responsavel) VALUES
(1, 'usuario', 'INSERT', 'popular_dados_teste.sql'),
(2, 'sala', 'INSERT', 'popular_dados_teste.sql'),
(3, 'reserva', 'INSERT', 'popular_dados_teste.sql');

