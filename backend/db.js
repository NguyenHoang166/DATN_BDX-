const mysql = require('mysql2');

// Tạo kết nối tới cơ sở dữ liệu MySQL
const db = mysql.createConnection({
  host: 'localhost', // Tên máy chủ của MySQL
  user: 'root', // Tên người dùng MySQL
  password: 'Minhkhoa1@', // Mật khẩu MySQL (nếu có)
  database: 'QuanLyBDX' // Tên cơ sở dữ liệu của bạn
});

db.connect((err) => {
  if (err) {
    console.error('Lỗi kết nối cơ sở dữ liệu: ', err);
    return;
  }
  console.log('Kết nối cơ sở dữ liệu thành công!');
});

module.exports = db; // Xuất kết nối db để dùng ở file khác
