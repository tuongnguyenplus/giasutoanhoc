# 📐 Gia sư Toán

Ứng dụng web gia sư Toán cho học sinh **lớp 1–12**, bám theo bộ SGK **"Kết nối tri thức với cuộc sống"**. Đây là bộ sách Bộ GD&ĐT chọn dùng thống nhất toàn quốc từ năm học 2026–2027 (Quyết định 3588/QĐ-BGDĐT ngày 26/12/2025, Chương trình GDPT 2018).

## Tính năng

| Yêu cầu | Cách ứng dụng thực hiện |
|---|---|
| Chọn cấp độ | Mỗi học sinh có hồ sơ riêng và chọn lớp 1–12 để ôn. Có thể chọn thêm một chủ đề cụ thể để ôn, hoặc để mặc định là tự động theo tiến độ. |
| Ra bài theo tiến độ SGK | Từ ngày khai giảng (mặc định 05/09), ứng dụng tính tuần học hiện tại, bỏ qua các tuần nghỉ Tết nếu có khai báo, rồi chọn chủ đề tương ứng trong phân phối chương trình (`src/curriculum.js`). Mùa hè thì ôn xoay vòng cả năm. |
| 10 câu mỗi ngày, dễ → khó | Đề gồm 10 câu chia 5 mức (nhận biết, thông hiểu, vận dụng, vận dụng cao). Trong đó có 2 câu ôn chủ đề cũ, ưu tiên chủ đề em còn yếu, và 2 câu **tư duy** ở cuối. |
| Trắc nghiệm và tự luận | Câu trắc nghiệm trả lời ngay trên app. Câu tự luận em làm ra vở, chụp ảnh (tối đa 4 ảnh, app tự nén) rồi nộp. |
| Chấm và giảng giải | Câu đúng: app vẫn giải thích vì sao đúng. Câu sai: app chỉ ra sai ở đâu, vì sao sai, nêu phương pháp và lời giải chi tiết. |
| Luyện lại tới khi đúng hết | Mỗi câu sai sinh thêm **3 bài cùng dạng**. Nếu lại sai thì sinh tiếp, mỗi vòng dễ hơn một chút. Đề chỉ hoàn thành khi mọi câu đều đúng. |
| Nhận xét và biểu đồ | Biểu đồ điểm theo ngày (kèm đường trung bình 7 ngày), tỉ lệ đúng theo chủ đề và theo mức độ, chuỗi ngày học liên tục, nhận xét sau mỗi bài và nhận xét tổng quát. |
| Báo cáo cho phụ huynh | Gửi tự động mỗi ngày theo giờ cài đặt, qua **email** (SMTP) và/hoặc **Zalo OA**. Cũng có nút xem trước và nút gửi ngay. |

### Chuyên sâu lớp 5 và bậc thang tư duy

- **68 dạng bài riêng cho lớp 5** (`src/grade5.js`), chia theo đúng 11 chủ đề SGK. Mỗi chủ đề có bậc thang mức độ: **1 Nhận biết → 2 Thông hiểu → 3 Vận dụng → 4 Vận dụng nhiều bước → 5 Vận dụng cao → 6 Nâng cao** (dạng bồi dưỡng học sinh giỏi). Ví dụ các dạng nâng cao: so sánh phân số bằng phần bù, tính nhanh dãy phân số, cùng thêm vào tử và mẫu, quên hoặc dời dấu phẩy, làm tròn ngược, chuyển kho, tuổi sau n năm, tỉ lệ bản đồ với diện tích, kéo dài đáy tam giác hoặc hình thang, hình vuông nội tiếp hình tròn, phơi khô hạt tươi, pha loãng nước muối, tăng rồi giảm phần trăm, thả đá vào bể, sơn khối lập phương rồi cắt nhỏ, tàu qua cầu, vận tốc trung bình đi – về, chạy quanh hồ, làm chung công việc, đánh số trang sách, đếm hình.
- Các dạng này dùng cho cả **trắc nghiệm** (có phương án nhiễu là sai lầm thường gặp) và **tự luận**.
- **Bậc thang tư duy tự điều chỉnh** (4 bậc: Khởi động, Cơ bản, Khá, Giỏi). Ứng dụng xét 40 câu gần nhất, trong đó câu đúng ở mức khó được tính nhiều điểm hơn. Làm tốt thì đề có nhiều câu mức 5–6 hơn; gặp khó thì đề hạ xuống để củng cố. Mỗi ngày chỉ lên hoặc xuống tối đa 1 bậc. Bậc hiện tại hiển thị trên trang của học sinh.

### Hai chế độ

- **Có AI (Claude)**: đặt `ANTHROPIC_API_KEY`. AI soạn đề đa dạng, có câu tư duy theo tình huống thực tế. AI đọc **ảnh chụp bài làm** để chấm cả cách làm lẫn kết quả, chỉ ra bước sai, rồi ra 3 bài tương tự và viết nhận xét.
- **Offline** (không có khóa, hoặc khi AI lỗi): đề lấy từ bộ sinh bài có sẵn, phủ mọi chủ đề lớp 1–12 (`src/generators.js`). Câu **tự luận** lấy từ ngân hàng **152 mẫu bài có lời văn nhiều bước** (`src/wordproblems.js`), soạn theo các dạng điển hình trong SGK, sách bài tập, vở bài tập và đề kiểm tra: rút về đơn vị, tổng – hiệu, tổng – tỉ, giả thiết tạm, tính ngược, tỉ số phần trăm, chuyển động, lập phương trình hoặc hệ phương trình, bài toán thực tế THPT… Số liệu được sinh ngẫu nhiên nên đề không lặp. Lời giải trình bày theo kiểu "Bài giải … Đáp số". Bài tự luận được chấm theo **đáp số cuối** em nhập; ảnh vẫn được lưu để phụ huynh xem. Đề offline lặp dạng nhiều hơn đề do AI soạn.

## Cài trên máy của con (miễn phí, không cần máy chủ)

Ứng dụng chạy ngay trên máy tính của con và được mở bằng trình duyệt tại **http://localhost:3000**.

1. **Tải ứng dụng về máy:** trên GitHub, chọn nhánh chứa mã, bấm **Code → Download ZIP**, rồi giải nén vào một thư mục cố định, ví dụ `Tài liệu\GiaSuToan`. Đừng để trong thư mục Tải về vì dễ bị xoá nhầm.
2. **Mở ứng dụng:**
   - **Windows:** bấm đúp `Mo-Gia-su-Toan-Windows.bat`.
     - Lần đầu, nếu máy chưa có Node.js, file sẽ tự cài (hoặc mở trang tải về). Cài xong, **bấm đúp lại** file này.
     - Nếu Windows hiện cảnh báo *"Windows protected your PC"*, chọn **More info → Run anyway**.
   - **macOS:** chuột phải vào `Mo-Gia-su-Toan-Mac.command` rồi chọn **Open**.
   - Lần đầu ứng dụng cài thư viện mất 1–2 phút (cần mạng). Sau đó trình duyệt tự mở trang học.
3. **Khi con học:** thu nhỏ cửa sổ đen, **không đóng nó**. Nên tạo dấu trang (bookmark) `http://localhost:3000` trên trình duyệt.
4. **Tự chạy khi bật máy (Windows, nên làm):** bấm đúp `Tu-khoi-dong-cung-Windows.bat` một lần. Từ đó ứng dụng tự chạy ngầm mỗi khi bật máy, nên báo cáo cho phụ huynh được gửi đúng giờ. Nếu máy tắt vào giờ gửi, báo cáo sẽ được gửi ngay khi máy bật lại trong cùng ngày.

**Gửi email báo cáo (miễn phí):** sao chép `.env.example` thành `.env` và mở bằng Notepad. Điền `SMTP_USER` là Gmail của bạn, `SMTP_PASS` là *Mật khẩu ứng dụng* của Gmail (tạo tại myaccount.google.com → Bảo mật → Mật khẩu ứng dụng), và `SMTP_FROM`. Sau đó mở lại ứng dụng.

**AI (tuỳ chọn, có tính phí theo lượt dùng):** không có khóa `ANTHROPIC_API_KEY` thì ứng dụng chạy chế độ offline và hoàn toàn miễn phí. Có khóa thì đề phong phú hơn và chấm được ảnh bài làm, nhưng tính tiền theo lượng sử dụng. Có thể đặt `CLAUDE_MODEL` sang mô hình rẻ hơn để giảm chi phí.

**Dữ liệu** (kết quả học, ảnh bài làm) nằm trong thư mục `data` cạnh ứng dụng. Thỉnh thoảng hãy sao lưu thư mục này. Khi cập nhật phiên bản mới, giữ lại thư mục `data` và file `.env`.

## Dùng trên iPad (miễn phí)

iPad không chạy được phần máy chủ, nên máy tính trong nhà sẽ chạy ứng dụng và iPad mở bằng Safari qua Wi‑Fi.

1. Trên **máy tính** (Windows hoặc Mac), mở ứng dụng như hướng dẫn ở trên. Cửa sổ đen sẽ hiện dòng:
   `Mở trên iPad / điện thoại (cùng mạng Wi‑Fi): http://192.168.1.25:3000`. Địa chỉ này cũng hiện trên trang chủ của ứng dụng khi mở trên máy tính.
   - Lần đầu, **Windows** có thể hỏi về tường lửa: tích *Private networks* rồi bấm **Allow access**. **Mac** hỏi có cho phép kết nối đến không thì bấm **Allow**.
2. Trên **iPad**: kết nối **cùng mạng Wi‑Fi**, mở **Safari** và gõ đúng địa chỉ đó.
3. Bấm nút **Chia sẻ** (ô vuông có mũi tên) → **Thêm vào MH chính** (Add to Home Screen). Từ đó ứng dụng có biểu tượng riêng và mở toàn màn hình như một app.
4. Câu tự luận: bấm chọn ảnh → **Chụp ảnh** bằng camera iPad. Ảnh tự được nén nhỏ trước khi gửi.

Lưu ý:
- Máy tính phải **đang bật và đang chạy ứng dụng** khi con học trên iPad. Nên bật chế độ tự khởi động (`Tu-khoi-dong-cung-Windows.bat`) và cài máy tính không tự ngủ khi cắm điện.
- Nếu đổi mạng hoặc khởi động lại modem, địa chỉ có thể thay đổi; hãy xem lại dòng địa chỉ trong cửa sổ đen. Muốn địa chỉ cố định thì đặt "IP tĩnh" (DHCP reservation) cho máy tính trong trang quản lý modem.
- iPad chỉ dùng được khi ở nhà, tức là cùng mạng Wi‑Fi với máy tính.

## Chạy thử (dành cho lập trình viên)

Cần Node.js ≥ 22.13 (dùng SQLite có sẵn của Node).

```bash
npm install
```

```bash
cp .env.example .env
```

```bash
node --env-file=.env --disable-warning=ExperimentalWarning src/server.js
```

Mở http://localhost:3000, tạo hồ sơ học sinh rồi bấm **"Làm bài tập hôm nay"**.

Chạy kiểm thử (sinh thử mọi chủ đề × mọi mức độ, kiểm tra bộ so đáp số và tiến độ):

```bash
npm test
```

## Cấu hình gửi báo cáo

**Email**: điền `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`. Nếu dùng Gmail, tạo *Mật khẩu ứng dụng* rồi dùng `smtp.gmail.com:587`.

**Zalo**: cần một **Zalo Official Account**. Phụ huynh nhấn *Quan tâm* OA, sau đó lấy `user_id` của phụ huynh (theo OA) và nhập vào phần Cài đặt của học sinh. Trên máy chủ, cấu hình `ZALO_APP_ID`, `ZALO_APP_SECRET` và `ZALO_REFRESH_TOKEN`; app tự làm mới token và lưu vào `data/zalo_token.json`.
> Lưu ý: tin nhắn "tư vấn" của OA chỉ gửi được trong một khoảng thời gian sau lần tương tác gần nhất của phụ huynh. Muốn gửi chủ động không giới hạn thì cần đăng ký mẫu **ZNS** (Zalo Notification Service). Hàm `sendZalo` trong `src/report.js` là nơi để thêm ZNS.

## Cấu trúc

```
src/
  curriculum.js  Phân phối chương trình lớp 1–12 (SGK Kết nối tri thức) và cách tính tuần học
  generators.js  Bộ sinh bài offline (~70 dạng) kèm lời giải, phương pháp và phương án nhiễu
  wordproblems.js Ngân hàng mẫu bài có lời văn (tổng 152 mẫu, lớp 1–12)
  grade5.js      Bộ chuyên sâu lớp 5: 68 dạng, mức 1–6
  answer.js      So khớp đáp số (dấu phẩy/chấm, phân số, thứ tự nghiệm…)
  ai.js          Gọi Claude: ra đề, chấm ảnh tự luận, bài tương tự, nhận xét
  tutor.js       Lập đề hằng ngày, chấm bài, vòng luyện lại, thống kê tiến bộ
  report.js      Báo cáo phụ huynh (email/Zalo) và lịch gửi tự động
  server.js      API Express và phục vụ giao diện
public/          Giao diện web (chạy tốt trên điện thoại), KaTeX hiển thị công thức, Chart.js vẽ biểu đồ
test/            Kiểm thử
```

## Điều chỉnh giáo trình

Số tuần của từng chủ đề trong `src/curriculum.js` là ước lượng theo mục lục SGK. Mỗi trường có thể dạy nhanh hoặc chậm hơn, nên thầy cô/phụ huynh có thể sửa trường `week` cho khớp lịch thực tế. Học sinh cũng có thể chọn chủ đề ôn tập ngay trên trang của mình.

## Bảo mật

Ứng dụng dành cho gia đình hoặc nhóm nhỏ. Nếu đưa lên Internet, hãy đặt `ACCESS_CODE` để yêu cầu mã truy cập và chạy sau HTTPS. Ảnh bài làm và cơ sở dữ liệu nằm trong thư mục `data/`.
