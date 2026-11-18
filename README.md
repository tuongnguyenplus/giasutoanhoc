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

### Hai chế độ

- **Có AI (Claude)**: đặt `ANTHROPIC_API_KEY`. AI soạn đề đa dạng, có câu tư duy theo tình huống thực tế. AI đọc **ảnh chụp bài làm** để chấm cả cách làm lẫn kết quả, chỉ ra bước sai, rồi ra 3 bài tương tự và viết nhận xét.
- **Offline** (không có khóa, hoặc khi AI lỗi): đề lấy từ bộ sinh bài có sẵn, phủ mọi chủ đề lớp 1–12 (`src/generators.js`). Bài tự luận được chấm theo **đáp số cuối** em nhập; ảnh vẫn được lưu để phụ huynh xem. Đề offline lặp dạng nhiều hơn đề do AI soạn.

## Chạy thử

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
