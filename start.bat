@echo off
REM ============================================================
REM AgriSmart AI - one-command launcher (Windows)
REM
REM What this does:
REM   1. Installs backend dependencies (skip with START_SKIP_INSTALL=1)
REM   2. Starts the Flask API server in its own window (port 8000)
REM   3. Picks a free port for the frontend (tries 5500, 5501, 5502,
REM      5173, 8080, 3000 in order - these match the backend's default
REM      CORS_ORIGINS, so whichever one is actually free still works)
REM   4. Serves the frontend folder as static files on that port
REM   5. Waits until /api/health responds, THEN opens the app in your
REM      default browser
REM
REM Usage: double-click start.bat, or run it from a terminal:
REM   start.bat
REM ============================================================

setlocal enabledelayedexpansion
cd /d "%~dp0"

if "%START_SKIP_INSTALL%"=="1" (
    echo Skipping dependency install ^(START_SKIP_INSTALL=1^)
) else (
    echo Installing backend dependencies...
    python -m pip install -r "%~dp0backend\requirements.txt"
)

echo.
echo Starting AgriAI backend on http://127.0.0.1:8000 ...
start "AgriAI Backend" cmd /k "cd /d "%~dp0backend" && python api_server.py"

echo.
echo Looking for a free port for the frontend...
set FRONTEND_PORT=
for %%P in (5500 5501 5502 5173 8080 3000) do (
    if not defined FRONTEND_PORT (
        netstat -ano | findstr ":%%P " | findstr "LISTENING" >nul
        if errorlevel 1 set FRONTEND_PORT=%%P
    )
)

if not defined FRONTEND_PORT (
    echo All of 5500/5501/5502/5173/8080/3000 are in use on this machine.
    echo Close whatever is using one of them ^(often VS Code's Live Server^)
    echo and re-run start.bat, or edit start.bat to add another port -
    echo just remember to also add it to CORS_ORIGINS in backend\.env.
    pause
    exit /b 1
)

echo Using port !FRONTEND_PORT! for the frontend ^(first free port found^).
start "AgriAI Frontend" cmd /k "cd /d "%~dp0frontend" && python -m http.server !FRONTEND_PORT!"

echo.
echo Waiting for the backend to come online...
set tries=0

:waitloop
curl -s -o nul -w "%%{http_code}" http://127.0.0.1:8000/api/health 2>nul | findstr "200" >nul
if not errorlevel 1 goto ready

set /a tries+=1
if !tries! GEQ 40 (
    echo.
    echo Backend did not respond after 40 seconds - opening the app anyway.
    echo Check the "AgriAI Backend" window for errors ^(e.g. Mongo connection^).
    goto openbrowser
)
timeout /t 1 >nul
goto waitloop

:ready
echo Backend is up.

:openbrowser
echo Opening AgriSmart AI in your browser...
start "" http://127.0.0.1:!FRONTEND_PORT!/index.html

endlocal
