#!/bin/bash
cd "$(dirname "$0")"
ok_node() { command -v node >/dev/null && node -e "const [a,b]=process.versions.node.split('.').map(Number);process.exit(a>22||(a===22&&b>=13)?0:1)"; }
if ! ok_node; then
  echo "Máy chưa có Node.js (bản 22.13 trở lên). Hãy tải bản LTS, cài đặt rồi mở lại file này."
  open "https://nodejs.org/vi/download"
  read -p "Nhấn Enter để đóng..."
  exit 1
fi
if [ ! -d node_modules ]; then
  echo "Đang cài đặt lần đầu, vui lòng chờ 1–2 phút..."
  npm install --omit=dev --no-audit --no-fund || { read -p "Cài đặt thất bại. Nhấn Enter để đóng..."; exit 1; }
fi
(sleep 3; open "http://localhost:3000") &
echo ""
echo "  Gia sư Toán đang chạy tại: http://localhost:3000"
echo "  Thu nhỏ cửa sổ này, KHÔNG đóng nó khi con đang học."
echo ""
node --env-file-if-exists=.env --disable-warning=ExperimentalWarning src/server.js
