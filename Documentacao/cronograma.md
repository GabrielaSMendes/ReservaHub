# Cronograma de Desenvolvimento - ReservaHub

## Visao Geral

Este cronograma organiza o desenvolvimento do ReservaHub em sprints incrementais, considerando os requisitos funcionais, requisitos nao funcionais e a modelagem inicial do banco de dados.

O objetivo e entregar primeiro a base tecnica do sistema, depois os fluxos principais de usuario e administrador, e por fim estabilizar seguranca, desempenho, documentacao e validacoes finais.

## Premissas

- Duracao sugerida de cada sprint: 1 semana.
- Projeto web para gestao de reservas de coworking.
- Perfis principais: usuario comum e administrador.
- Banco de dados inicial baseado no script `ReservaHub-database/reserva_hub.sql`.
- O sistema deve possuir interface responsiva, autenticacao segura, controle de acesso por perfil e documentacao tecnica.

## Sprint 0 - Planejamento e Preparacao

### Objetivo

Preparar o projeto para desenvolvimento, validar requisitos e definir a base tecnica da aplicacao.

### Atividades

- Revisar requisitos funcionais e nao funcionais.
- Revisar o modelo do banco de dados.
- Definir arquitetura do projeto.
- Definir stack de desenvolvimento.
- Criar estrutura inicial do frontend, backend e banco.
- Configurar repositorio, padrao de commits e organizacao das branches.
- Criar ambiente local de desenvolvimento.
- Revisar o RNF03, pois "SHA-5" deve ser validado ou substituido por um algoritmo de hash seguro.

### Entregaveis

- Estrutura inicial do projeto.
- Ambiente local documentado.
- Banco de dados criado localmente.
- Arquitetura definida.
- Requisitos revisados.

### Requisitos relacionados

- RNF10 - Arquitetura.
- RNF11 - Documentacao tecnica.

## Sprint 1 - Autenticacao e Usuarios

### Objetivo

Implementar o cadastro, login, logout e estrutura de perfis de acesso.

### Atividades

- Implementar cadastro de usuario com nome, CPF, email, senha e telefone.
- Implementar login com CPF e senha.
- Implementar logout.
- Implementar criptografia de senha.
- Implementar autenticacao com JWT.
- Criar controle de perfil de usuario.
- Criar validacoes basicas de cadastro.
- Criar telas de cadastro e login.

### Entregaveis

- Usuario consegue se cadastrar.
- Usuario consegue fazer login e logout.
- Senhas sao armazenadas com hash seguro.
- Token JWT e gerado no login.
- Perfil do usuario e carregado na sessao.

### Requisitos relacionados

- RF01 - Cadastro.
- RF02 - Login.
- RNF03 - Criptografia.
- RNF04 - Seguranca.
- RNF05 - Restricao por perfil.

## Sprint 2 - Administracao de Usuarios

### Objetivo

Permitir que administradores gerenciem usuarios e tenham acesso restrito as funcionalidades administrativas.

### Atividades

- Implementar middleware ou guarda de acesso administrativo.
- Criar listagem de usuarios.
- Permitir edicao de dados de usuarios.
- Permitir bloqueio e reativacao de usuarios.
- Permitir exclusao ou desativacao de usuarios.
- Registrar acoes administrativas em auditoria.
- Criar telas administrativas de usuarios.

### Entregaveis

- Administrador acessa area restrita.
- Administrador visualiza usuarios cadastrados.
- Administrador edita, bloqueia e remove usuarios.
- Acoes relevantes sao registradas em auditoria.

### Requisitos relacionados

- RF04 - Administrador.
- RNF05 - Restricao por perfil.
- RNF11 - Documentacao tecnica.

## Sprint 3 - Gestao de Salas, Posicoes e Recursos

### Objetivo

Implementar o cadastro e gerenciamento dos espacos de coworking.

### Atividades

- Criar cadastro de salas.
- Criar cadastro de posicoes de trabalho, se forem tratadas separadamente de salas.
- Definir capacidade das salas.
- Criar cadastro de recursos.
- Vincular recursos as salas.
- Criar listagem e edicao de salas.
- Implementar status ativo/inativo das salas.
- Criar telas de administracao de espacos.

### Entregaveis

- Administrador cadastra e edita salas.
- Administrador define capacidade e recursos.
- Salas podem ser ativadas ou desativadas.
- Usuario visualiza lista inicial de espacos.

### Requisitos relacionados

- RF05 - Cadastrar salas.
- RF06 - Capacidade e recursos.
- RF07 - Lista de espacos.
- RNF06 - Interface responsiva.
- RNF07 - Navegacao intuitiva.

## Sprint 4 - Disponibilidade e Horarios

### Objetivo

Permitir que usuarios visualizem espacos e horarios disponiveis antes de realizar reservas.

### Atividades

- Implementar cadastro ou configuracao de horario de funcionamento.
- Criar consulta de disponibilidade por sala, data e horario.
- Exibir lista de espacos disponiveis.
- Exibir horarios disponiveis.
- Filtrar salas por capacidade, recurso e status.
- Criar regras para considerar apenas salas ativas.
- Criar telas de busca e disponibilidade.

### Entregaveis

- Usuario consulta espacos disponiveis.
- Usuario visualiza horarios livres.
- Sistema respeita horario de funcionamento.
- Sistema nao exibe salas inativas para reserva.

### Requisitos relacionados

- RF07 - Lista de espacos.
- RF08 - Horarios disponiveis.
- RNF02 - Tempo de resposta.
- RNF06 - Interface responsiva.

## Sprint 5 - Reservas e Cancelamentos

### Objetivo

Implementar o fluxo principal de reserva, cancelamento e prevencao de conflitos.

### Atividades

- Criar funcionalidade de realizar reserva.
- Validar conflito de reserva por sala, data e horario.
- Validar horario de funcionamento.
- Validar usuario ativo.
- Criar cancelamento de reserva.
- Criar visualizacao de reservas ativas.
- Registrar historico de criacao, edicao e cancelamento.
- Criar telas de minhas reservas.

### Entregaveis

- Usuario realiza reservas.
- Sistema impede reservas conflitantes.
- Usuario cancela reservas.
- Usuario visualiza reservas ativas.
- Historico de reservas e atualizado.

### Requisitos relacionados

- RF09 - Reservar.
- RF10 - Cancelamento.
- RF11 - Conflitos.
- RF12 - Visualizacao.
- RF14 - Historico.
- RNF01 - Multiplos usuarios simultaneos.
- RNF02 - Tempo de resposta.

## Sprint 6 - Recuperacao de Senha e Confirmacoes

### Objetivo

Finalizar os fluxos complementares de usuario, incluindo recuperacao de senha e confirmacao de reservas.

### Atividades

- Implementar solicitacao de recuperacao de senha.
- Gerar token de recuperacao com expiracao.
- Validar token e permitir alteracao de senha.
- Marcar token como usado.
- Implementar envio de confirmacao de reserva.
- Definir canal de confirmacao, como email ou notificacao interna.
- Criar templates de mensagem.

### Entregaveis

- Usuario recupera senha com token valido.
- Token expirado ou ja usado e recusado.
- Usuario recebe confirmacao apos reserva.

### Requisitos relacionados

- RF03 - Recuperacao.
- RF13 - Confirmacao.
- RNF04 - Seguranca.

## Sprint 7 - Relatorios, Historico e Auditoria

### Objetivo

Dar ao administrador uma visao centralizada da ocupacao, historico e acoes importantes do sistema.

### Atividades

- Criar tela de historico de reservas.
- Criar filtros por usuario, sala, data e status.
- Exibir dados de ocupacao das salas.
- Exibir reservas canceladas e finalizadas.
- Consolidar registros de auditoria.
- Criar indicadores basicos para administradores.

### Entregaveis

- Administrador visualiza historico de reservas.
- Administrador filtra registros importantes.
- Administrador acompanha ocupacao dos espacos.
- Auditoria pode ser consultada.

### Requisitos relacionados

- RF14 - Historico.
- RNF11 - Documentacao tecnica.

## Sprint 8 - Qualidade, Seguranca e Finalizacao

### Objetivo

Estabilizar o sistema, corrigir problemas e preparar a entrega final.

### Atividades

- Realizar testes funcionais dos fluxos principais.
- Testar autenticacao, autorizacao e permissoes.
- Testar conflitos de reserva com multiplos usuarios.
- Otimizar consultas de disponibilidade.
- Validar tempo de resposta.
- Validar responsividade em mobile e desktop.
- Configurar rotina de backup.
- Atualizar documentacao tecnica.
- Criar manual basico de uso.
- Corrigir bugs encontrados nos testes.

### Entregaveis

- Sistema testado e estavel.
- Fluxos principais validados.
- Interface responsiva validada.
- Documentacao final atualizada.
- Backup definido.
- Entrega final pronta para apresentacao.

### Requisitos relacionados

- RNF01 - Multiplos usuarios simultaneos.
- RNF02 - Tempo de resposta.
- RNF06 - Interface responsiva.
- RNF07 - Navegacao intuitiva.
- RNF08 - Disponibilidade.
- RNF09 - Backup.
- RNF11 - Documentacao tecnica.

## Ordem Recomendada de Entrega

1. Base tecnica e banco de dados.
2. Autenticacao e perfis.
3. Administracao de usuarios.
4. Gestao de salas e recursos.
5. Consulta de disponibilidade.
6. Criacao e cancelamento de reservas.
7. Recuperacao de senha e confirmacoes.
8. Historico, auditoria e relatorios.
9. Testes, seguranca, documentacao e apresentacao final.

## Criterios Gerais de Aceite

- O usuario deve conseguir se cadastrar, autenticar e reservar espacos disponiveis.
- O sistema deve impedir reservas conflitantes.
- O administrador deve conseguir gerenciar usuarios, salas e historico.
- O acesso administrativo deve ser restrito por perfil.
- A interface deve funcionar em desktop e mobile.
- As senhas devem ser armazenadas de forma segura.
- As principais acoes devem ser registradas em historico ou auditoria.
- O projeto deve possuir documentacao tecnica suficiente para instalacao, execucao e manutencao.
