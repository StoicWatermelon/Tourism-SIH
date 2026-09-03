@echo off
setlocal enabledelayedexpansion
title Bharat Explore - SIH 2026 AI Tourism Platform

echo ============================================================
echo   🇮🇳  BHARAT EXPLORE - SIH 2026 ENVIRONMENT LAUNCHER
echo ============================================================

:: 1. Validate Python availability
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not in system PATH.
    echo Please install Python 3.10+ from python.org and check "Add to PATH".
    pause
    exit /b 1
)

:: 2. Auto-resolve or create virtual environment
set "VENV_DIR=.venv"
if not exist ".venv\" (
    if exist "venv\" (
        set "VENV_DIR=venv"
    ) else (
        echo [*] Creating local virtual environment in .venv...
        python -m venv .venv
        set "VENV_DIR=.venv"
    )
)

:: 3. Validate Python executable in venv
set "PYTHON_EXE=!VENV_DIR!\Scripts\python.exe"
if not exist "!PYTHON_EXE!" (
    echo [ERROR] Python executable not found in !VENV_DIR!\Scripts\python.exe
    pause
    exit /b 1
)

:: 4. Install / Verify dependencies quietly
echo [*] Checking dependencies from requirements.txt...
"!PYTHON_EXE!" -m pip install -r requirements.txt --quiet

:: 5. Resolve path to backend server
set "PY_SERVER=backend\server.py"
if not exist "!PY_SERVER!" (
    if exist "server.py" (
        set "PY_SERVER=server.py"
    ) else (
        echo [ERROR] Could not locate server.py.
        pause
        exit /b 1
    )
)

:: 6. Launch FastAPI + SQLite backend in independent console
echo [*] Launching Bharat Explore AI ^& Tourism Backend...
start "Bharat Explore Backend Server" "!PYTHON_EXE!" "!PY_SERVER!"

:: 7. Launch web application in default browser
echo [*] Waiting for server to initialize...
timeout /t 2 /nobreak >nul

echo [*] Opening Bharat Explore in your default browser...
start "" "http://127.0.0.1:8000/"

echo ============================================================
echo   [SUCCESS] Bharat Explore is running at:
echo   - Web Application: http://127.0.0.1:8000/
echo   - Interactive API Docs: http://127.0.0.1:8000/docs
echo   - Mountain Pass Telemetry: http://127.0.0.1:8000/api/passes
echo
echo   Keep this launcher window open during the SIH presentation.
echo ============================================================
pause