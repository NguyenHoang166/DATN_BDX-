const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const db = require('./db'); // Kết nối DB từ file db.js

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json()); 

// === ĐĂNG KÝ ===
app.post('/register', (req, res) => {
  const { ho_ten, email, so_dien_thoai, mat_khau } = req.body;

  if (!ho_ten || !email || !so_dien_thoai || !mat_khau) {
    return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
  }

  const checkSql = 'SELECT * FROM NguoiDung WHERE email = ? OR so_dien_thoai = ?';
  db.query(checkSql, [email, so_dien_thoai], (err, results) => {
    if (err) return res.status(500).json({ message: 'Lỗi máy chủ' });
    if (results.length > 0) return res.status(400).json({ message: 'Email hoặc số điện thoại đã tồn tại' });

    const hashedPassword = bcrypt.hashSync(mat_khau, 10);
    const insertSql = `
      INSERT INTO NguoiDung (ho_ten, email, so_dien_thoai, mat_khau, vai_tro, ngay_tao, is_active, is_locked)
      VALUES (?, ?, ?, ?, 'User', NOW(), TRUE, FALSE)
    `;
    db.query(insertSql, [ho_ten, email, so_dien_thoai, hashedPassword], (err) => {
      if (err) return res.status(500).json({ message: 'Lỗi khi đăng ký' });
      res.status(201).json({ message: 'Đăng ký thành công' });
    });
  });
});

// === ĐĂNG NHẬP ===
app.post('/login', (req, res) => {
  const { email, mat_khau } = req.body;

  if (!email || !mat_khau) {
    return res.status(400).json({ message: 'Thiếu thông tin' });
  }

  const sql = 'SELECT * FROM NguoiDung WHERE email = ?';
  db.query(sql, [email], (err, results) => {
    if (err) return res.status(500).json({ message: 'Lỗi máy chủ' });
    if (results.length === 0) return res.status(400).json({ message: 'Email không tồn tại' });

    const user = results[0];

    if (!user.is_active) return res.status(403).json({ message: 'Tài khoản chưa được kích hoạt' });
    if (user.is_locked) return res.status(403).json({ message: 'Tài khoản đã bị khóa' });

    if (!bcrypt.compareSync(mat_khau, user.mat_khau)) {
      return res.status(400).json({ message: 'Sai mật khẩu' });
    }

    res.json({
      message: 'Đăng nhập thành công',
      user: {
        id: user.id_nguoi_dung,
        ho_ten: user.ho_ten,
        email: user.email,
        so_dien_thoai: user.so_dien_thoai,
        vai_tro: user.vai_tro,
        avatar: user.avatar || null
      }
    });
  });
});

// === API Quản lý người dùng ===
app.get('/api/users', (req, res) => {
  const sql = 'SELECT ho_ten, email, so_dien_thoai FROM NguoiDung WHERE is_active = TRUE';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

/// API tạo đơn đặt chỗ
app.post('/api/dondatcho', (req, res) => {
  const { id_nguoi_dung, thoi_gian, trang_thai, vi_tri } = req.body;

  // Kiểm tra dữ liệu
  if (!id_nguoi_dung || !thoi_gian || !trang_thai || !vi_tri) {
    return res.status(400).json({ message: 'Thiếu thông tin khi tạo đơn' });
  }

  // Kiểm tra xem id_nguoi_dung có tồn tại trong bảng NguoiDung không
  const checkUserSql = 'SELECT * FROM NguoiDung WHERE id_nguoi_dung = ?';
  db.query(checkUserSql, [id_nguoi_dung], (err, results) => {
    if (err) {
      console.error('Lỗi truy vấn kiểm tra người dùng:', err);
      return res.status(500).json({ message: 'Lỗi máy chủ' });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: 'Người dùng không tồn tại' });
    }

    // Câu truy vấn SQL để tạo đơn
    const insertSql = `
      INSERT INTO DonDatCho (id_nguoi_dung, thoi_gian, trang_thai, vi_tri)
      VALUES (?, ?, ?, ?)
    `;

    db.query(insertSql, [id_nguoi_dung, thoi_gian, trang_thai, vi_tri], (err, results) => {
      if (err) {
        console.error('Lỗi khi tạo đơn:', err);
        return res.status(500).json({ message: 'Lỗi khi tạo đơn', error: err.message });
      }
      res.status(201).json({ message: 'Tạo đơn đặt chỗ thành công', id_don: results.insertId });
    });
  });
});


// === Start server ===
app.listen(port, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${port}`);
});
