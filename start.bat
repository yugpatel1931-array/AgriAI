@echo off
setlocal EnableExtensions EnableDelayedExpansion
cd /d "%~dp0"
title VASUDHA - Smart Agriculture

set "ROOT=%~dp0"
set "BACKEND=%ROOT%backend"
set "VENV=%BACKEND%\.venv"
set "PYTHON=%VENV%\Scripts\python.exe"
set "URL=http://127.0.0.1:8000/"

if not exist "%BACKEND%\api_server.py" (
  echo [ERROR] backend\api_server.py not found.
  pause
  exit /b 1
)
if not exist "%BACKEND%\.env" (
  echo [INFO] backend\.env not found. Core local model can still run, but connected AI/database features may be unavailable.
)

where py >nul 2>&1
if not errorlevel 1 set "PYLAUNCH=py -3"
if not defined PYLAUNCH (
  where python >nul 2>&1
  if not errorlevel 1 set "PYLAUNCH=python"
)
if not defined PYLAUNCH (
  echo [ERROR] Python 3 is required. Install Python 3 and run this launcher again.
  pause
  exit /b 1
)

if not exist "%PYTHON%" (
  echo [1/3] Creating VASUDHA Python environment...
  %PYLAUNCH% -m venv "%VENV%"
  if errorlevel 1 (
    echo [ERROR] Could not create the Python environment.
    pause
    exit /b 1
  )
)

if not exist "%VENV%\.vasudha_deps_ok" (
  echo [2/3] Installing required dependencies (first run only)...
  "%PYTHON%" -m pip install --upgrade pip
  if errorlevel 1 (
    echo [ERROR] pip upgrade failed.
    pause
    exit /b 1
  )
  "%PYTHON%" -m pip install -r "%BACKEND%\requirements.txt"
  if errorlevel 1 (
    echo [ERROR] Dependency installation failed. Check your internet connection and try again.
    pause
    exit /b 1
  )
  type nul > "%VENV%\.vasudha_deps_ok"
) else (
  echo [2/3] Dependencies already installed.
)

rem Stop stale VASUDHA launcher processes from a previous run when possible.
for /f "tokens=5" %%P in ('netstat -ano ^| findstr ":8000 .*LISTENING"') do (
  tasklist /FI "PID eq %%P" /FI "IMAGENAME eq python.exe" 2>nul | findstr /I "python.exe" >nul
  if not errorlevel 1 taskkill /PID %%P /T /F >nul 2>&1
)

if exist "%ROOT%frontend\index.html" (
  echo [3/3] Starting VASUDHA...
) else (
  echo [ERROR] frontend\index.html not found.
  pause
  exit /b 1
)

start "VASUDHA Backend" /min cmd /c "cd /d "%BACKEND%" && "%PYTHON%" api_server.py"

set /a tries=0
:wait
set /a tries+=1
curl -s -o nul -w "%%{http_code}" "http://127.0.0.1:8000/api/health" 2>nul | findstr /R /C:"^200$" >nul
if not errorlevel 1 goto ready
if !tries! GEQ 45 goto timeout
timeout /t 1 /nobreak >nul
goto wait

:ready
echo.
echo ==============================================
echo   VASUDHA is ready
 echo   http://127.0.0.1:8000/
echo ==============================================
echo.
start "" "%URL%"
exit /b 0

:timeout
echo.
echo [ERROR] VASUDHA backend did not become ready within 45 seconds.
echo Check the backend window for the actual error.
pause
exit /b 1
