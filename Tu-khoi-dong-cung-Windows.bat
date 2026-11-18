@echo off
set "APPDIR=%~dp0"
set "STARTUP=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"
(
  echo @echo off
  echo start "Gia su Toan" /min "%APPDIR%Mo-Gia-su-Toan-Windows.bat" --an
) > "%STARTUP%\Gia-su-Toan.bat"
echo Da bat che do tu khoi dong: Gia su Toan se tu chay (thu nho) moi khi bat may.
echo Muon tat: xoa file "Gia-su-Toan.bat" trong thu muc:
echo %STARTUP%
pause
