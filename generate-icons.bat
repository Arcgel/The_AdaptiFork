@echo off
echo ========================================
echo Ultimate Web Toolkit - Icon Generator
echo ========================================
echo.

REM Check if Python is available
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Python not found! Opening browser method instead...
    echo.
    start create-icons.html
    echo Browser opened. Download the 3 icons and save them here.
    pause
    exit /b
)

echo Python found! Attempting to generate icons...
echo.

REM Try to generate icons with Python
python generate_icons.py

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo SUCCESS! Icons generated.
    echo ========================================
) else (
    echo.
    echo Python method failed. Opening browser method...
    start create-icons.html
    echo Browser opened. Download the 3 icons and save them here.
)

echo.
pause
