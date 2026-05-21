@echo off
cd /d "%~dp0"
call mvnw.cmd clean package -DskipTests
if errorlevel 1 (
  echo.
  echo BUILD FALHOU. Veja a mensagem acima.
  pause
  exit /b 1
)
echo.
echo BUILD OK.
pause
