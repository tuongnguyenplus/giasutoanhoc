@echo off
cd /d "%~dp0"
title Gia su Toan - KHONG DONG CUA SO NAY khi dang hoc

where node >nul 2>nul
if errorlevel 1 goto :install_node
node -e "const [a,b]=process.versions.node.split('.').map(Number);process.exit(a>22||(a===22&&b>=13)?0:1)"
if errorlevel 1 goto :install_node

if not exist node_modules (
  echo Dang cai dat lan dau, vui long cho 1-2 phut...
  call npm install --omit=dev --no-audit --no-fund
  if errorlevel 1 (
    echo Cai dat that bai. Kiem tra ket noi Internet roi chay lai.
    pause
    exit /b 1
  )
)

if /i not "%1"=="--an" start "" cmd /c "timeout /t 3 /nobreak >nul & start http://localhost:3000"
echo.
echo  Gia su Toan dang chay tai: http://localhost:3000
echo  Thu nho cua so nay xuong, KHONG dong no khi con dang hoc.
echo  Dung tren iPad: xem dong "Mo tren iPad" ben duoi. Neu Windows hoi tuong lua,
echo  hay tich "Private networks" roi bam "Allow access".
echo.
node --env-file-if-exists=.env --disable-warning=ExperimentalWarning src/server.js
pause
exit /b 0

:install_node
echo May chua co Node.js (phien ban 22.13 tro len). Dang thu cai tu dong...
winget install -e --id OpenJS.NodeJS.LTS --accept-source-agreements --accept-package-agreements
if errorlevel 1 (
  echo Khong cai tu dong duoc. Trinh duyet se mo trang tai Node.js:
  echo hay tai ban "LTS", cai dat, roi bam dup lai file nay.
  start https://nodejs.org/vi/download
) else (
  echo Da cai xong Node.js. Hay DONG cua so nay va bam dup lai file nay.
)
pause
exit /b 1
