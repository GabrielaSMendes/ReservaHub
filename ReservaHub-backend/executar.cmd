@echo off
cd /d "%~dp0"
echo Iniciando ReservaHub-backend em http://localhost:8080
echo (Ctrl+C para parar)
call mvnw.cmd spring-boot:run
