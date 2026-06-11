@echo off
title ReservaHub - Setup e Inicializacao
cd /d "%~dp0"

echo ========================================
echo   ReservaHub - Setup Automatico
echo ========================================
echo.

:: Verificar Java
where java >nul 2>&1
if errorlevel 1 (
    echo [ERRO] Java nao encontrado. Instale Java 21: https://adoptium.net
    pause & exit /b 1
)
echo [OK] Java encontrado

:: Verificar Node.js
where node >nul 2>&1
if errorlevel 1 (
    echo [ERRO] Node.js nao encontrado. Instale em: https://nodejs.org
    pause & exit /b 1
)
echo [OK] Node.js encontrado

:: Verificar MySQL
where mysql >nul 2>&1
if errorlevel 1 (
    echo [ERRO] MySQL nao encontrado no PATH. Verifique a instalacao.
    pause & exit /b 1
)
echo [OK] MySQL encontrado

echo.
echo --- Configurando banco de dados ---
echo.

:: Credenciais do banco (edite aqui se necessario)
set DB_USER=root
set DB_PASS=12345678
set DB_NAME=reserva_hub

mysql -u%DB_USER% -p%DB_PASS% -e "CREATE DATABASE IF NOT EXISTS %DB_NAME%;" 2>nul
if errorlevel 1 (
    echo [ERRO] Nao foi possivel conectar ao MySQL.
    echo Verifique se o servico esta rodando e as credenciais no topo deste arquivo.
    pause & exit /b 1
)
echo [OK] Banco de dados verificado

mysql -u%DB_USER% -p%DB_PASS% %DB_NAME% < ReservaHub-database\reserva_hub.sql
echo [OK] Schema importado

echo.
set /p DADOS_TESTE=Carregar dados de teste? (s/n):
if /i "%DADOS_TESTE%"=="s" (
    mysql -u%DB_USER% -p%DB_PASS% %DB_NAME% < ReservaHub-database\popular_dados_teste.sql
    echo [OK] Dados de teste carregados
)

echo.
echo --- Iniciando Backend (nova janela) ---
start "ReservaHub - Backend" cmd /k "cd /d "%~dp0ReservaHub-backend" && mvnw.cmd spring-boot:run"

echo Aguardando backend inicializar (30 segundos)...
timeout /t 30 /nobreak >nul

echo.
echo --- Iniciando Frontend (nova janela) ---
if not exist "ReservaHub-frontend\node_modules" (
    echo Instalando dependencias npm...
    cd ReservaHub-frontend
    call npm install
    cd ..
)
start "ReservaHub - Frontend" cmd /k "cd /d "%~dp0ReservaHub-frontend" && npm run dev"

echo Aguardando frontend inicializar (10 segundos)...
timeout /t 10 /nobreak >nul

start http://localhost:5173

echo.
echo ========================================
echo   Aplicacao iniciada com sucesso!
echo   Frontend : http://localhost:5173
echo   Backend  : http://localhost:8080
echo   Swagger  : http://localhost:8080/swagger-ui.html
echo ========================================
echo.
echo Para encerrar, feche as janelas Backend e Frontend.
pause
