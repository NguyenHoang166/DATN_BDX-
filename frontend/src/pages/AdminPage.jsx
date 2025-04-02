import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPage.css';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

// Đăng ký các thành phần của Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const AdminPage = ({ onLogout }) => {
  const navigate = useNavigate();
  const [showAccountList, setShowAccountList] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showParkingApprovalForm, setShowParkingApprovalForm] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchCriteria, setSearchCriteria] = useState('name');
  const [statusFilter, setStatusFilter] = useState('all');
  const [accountList, setAccountList] = useState([
    { id: 1, type: 'Khách hàng', name: 'Nguyễn Văn Hoàng', password: 'vanhoang123', email: 'vanhoang@gmail.com', date: '19/03/2025', active: true, image: 'https://via.placeholder.com/50' },
    { id: 2, type: 'Chủ bãi', name: 'Nguyễn Trí Ngọcc', password: 'tringocb9', email: 'tringocb9@gmail.com', date: '20/03/2025', active: true, image: 'https://via.placeholder.com/50' },
    { id: 3, type: 'Khách hàng', name: 'Nguyễn Minh Khoa', password: 'khoavipro', email: 'minhkhoa@gmail.com', date: '20/03/2025', active: true, image: 'https://via.placeholder.com/50' },
    { id: 4, type: 'Chủ bãi', name: 'Nguyễn Phí Long', password: 'filonge', email: 'filong@gmail.com', date: '22/03/2025', active: true, image: 'https://via.placeholder.com/50' },
    { id: 5, type: 'Khách hàng', name: 'Nguyễn Đức Hiếu', password: 'duchieu257', email: 'duchieu@gmail.com', date: '22/03/2025', active: true, image: 'https://via.placeholder.com/50' },
    { id: 6, type: 'Khách hàng', name: 'Nguyễn Văn Sơn', password: 'vansonzc', email: 'vanson@gmail.com', date: '23/03/2025', active: true, image: 'https://via.placeholder.com/50' },
    { id: 7, type: 'Khách hàng', name: 'Nguyễn Văn Nhật', password: 'nhat123abc', email: 'nhat123@gmail.com', date: '23/03/2025', active: true, image: 'https://via.placeholder.com/50' },
    { id: 8, type: 'Chủ bãi', name: 'Nguyễn Nhật Sinh', password: 'sinh12ba', email: 'sinh12@gmail.com', date: '25/03/2025', active: true, image: 'https://via.placeholder.com/50' },
  ]);

  const parkingList = [
    {
      id: 1,
      ownerName: 'Nguyễn Văn Hoàng',
      dob: '03/05/2003',
      phone: '0379443448',
      email: 'vanhoang@gmail.com',
      ownerImage: 'https://via.placeholder.com/100',
      parkingName: 'Bãi XE ĐN',
      location: '22 Bạch Đằng Cửu Cường',
      capacity: '120',
      vehicleTypes: 'Ô tô, xe tải, xe máy',
      image: 'https://via.placeholder.com/300',
    },
  ];

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const role = localStorage.getItem('role');
    console.log('AdminPage - isLoggedIn:', isLoggedIn, 'role:', role);
    if (!isLoggedIn) {
      navigate('/login');
    } else if (role !== 'Admin') {
      navigate('/');
    }
  }, [navigate]);

  const barData = {
    labels: ['04/03', '07/03', '10/03', '13/03', '16/03', '19/03', '22/03', '25/03', '28/03', '30/03'],
    datasets: [
      {
        label: 'Xe máy',
        data: [2000000, 2500000, 3000000, 2800000, 3200000, 3500000, 3000000, 2700000, 3100000, 3000000],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
      {
        label: 'Xe tải',
        data: [1500000, 1800000, 2000000, 2200000, 1900000, 2100000, 2300000, 2000000, 1800000, 1700000],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
      {
        label: 'Xe oto',
        data: [1500000, 1800000, 2000000, 2200000, 1900000, 2100000, 2300000, 2000000, 1800000, 1700000],
        backgroundColor: 'rgba(253, 215, 88, 0.6)',
      },
    ],
  };

  const pieData = {
    labels: ['Xe ô tô', 'Xe máy', 'Xe tải'],
    datasets: [
      {
        data: [19, 54, 27],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const handleLock = (id) => {
    setAccountList((prevList) =>
      prevList.map((account) =>
        account.id === id ? { ...account, active: !account.active } : account
      )
    );
  };

  const handleEdit = (account) => {
    setSelectedAccount(account);
    setShowEditForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tài khoản này?')) {
      setAccountList((prevList) => prevList.filter((account) => account.id !== id));
    }
  };

  const filteredAccounts = accountList.filter((account) => {
    const keyword = searchKeyword.toLowerCase();
    const matchesKeyword =
      searchCriteria === 'name'
        ? account.name.toLowerCase().includes(keyword)
        : searchCriteria === 'password'
        ? account.password.toLowerCase().includes(keyword)
        : account.email.toLowerCase().includes(keyword);

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && account.active) ||
      (statusFilter === 'inactive' && !account.active);

    return matchesKeyword && matchesStatus;
  });

  const AddAccountForm = () => {
    const [formData, setFormData] = useState({
      name: '',
      password: '',
      email: '',
      type: 'Khách hàng',
      active: true,
      date: new Date().toLocaleDateString('vi-VN'),
      image: 'https://via.placeholder.com/50',
    });

    const handleChange = (e) => {
      const { name, value, type, checked, files } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: type === 'checkbox' ? checked : type === 'file' ? URL.createObjectURL(files[0]) : value,
      }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      const newAccount = {
        id: accountList.length + 1,
        ...formData,
      };
      setAccountList((prevList) => [...prevList, newAccount]);
      setShowAddForm(false);
    };

    return (
      <div className="add-form-overlay">
        <div className="add-form">
          <h3>Thêm tài khoản mới</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Họ và Tên:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Mật khẩu:</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Loại tài khoản:</label>
              <select name="type" value={formData.type} onChange={handleChange}>
                <option value="Khách hàng">Khách hàng</option>
                <option value="Chủ bãi">Chủ bãi</option>
              </select>
            </div>
            <div className="form-group">
              <label>Hình ảnh:</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
              />
              {formData.image && <img src={formData.image} alt="Preview" className="image-preview" />}
            </div>
            <div className="form-group">
              <label>Hoạt động:</label>
              <input
                type="checkbox"
                name="active"
                checked={formData.active}
                onChange={handleChange}
              />
            </div>
            <div className="form-buttons">
              <button type="submit">Thêm</button>
              <button type="button" onClick={() => setShowAddForm(false)}>
                Đóng
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const EditAccountForm = () => {
    const [formData, setFormData] = useState({
      name: selectedAccount.name,
      password: selectedAccount.password,
      email: selectedAccount.email,
      type: selectedAccount.type,
      active: selectedAccount.active,
      image: selectedAccount.image,
    });

    const handleChange = (e) => {
      const { name, value, type, checked, files } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: type === 'checkbox' ? checked : type === 'file' ? URL.createObjectURL(files[0]) : value,
      }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      setAccountList((prevList) =>
        prevList.map((account) =>
          account.id === selectedAccount.id
            ? { ...account, ...formData }
            : account
        )
      );
      setShowEditForm(false);
      setSelectedAccount(null);
    };

    return (
      <div className="edit-form-overlay">
        <div className="edit-form">
          <h3>Chỉnh sửa tài khoản</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Họ và Tên:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Mật khẩu:</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Loại tài khoản:</label>
              <select name="type" value={formData.type} onChange={handleChange}>
                <option value="Khách hàng">Khách hàng</option>
                <option value="Chủ bãi">Chủ bãi</option>
              </select>
            </div>
            <div className="form-group">
              <label>Hình ảnh:</label>
              {formData.image && <img src={formData.image} alt="Current" className="image-preview" />}
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Hoạt động:</label>
              <input
                type="checkbox"
                name="active"
                checked={formData.active}
                onChange={handleChange}
              />
            </div>
            <div className="form-buttons">
              <button type="submit">Lưu</button>
              <button type="button" onClick={() => setShowEditForm(false)}>
                Đóng
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const AccountListTable = () => {
    return (
      <div className="account-list-overlay">
        <div className="account-list">
          <div className="account-list-header">
            <input
              type="text"
              placeholder="Nhập từ khóa tìm kiếm..."
              className="search-input"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              maxLength="255" // Thêm giới hạn 255 ký tự
            />
            <select
              value={searchCriteria}
              onChange={(e) => setSearchCriteria(e.target.value)}
            >
              <option value="name">Tìm kiếm theo họ và tên</option>
              <option value="password">Tìm kiếm theo mật khẩu</option>
              <option value="email">Tìm kiếm theo email</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Không hoạt động</option>
            </select>
            <button className="search-btn">Tìm kiếm</button>
            <button className="add-btn" onClick={() => setShowAddForm(true)}>
              Thêm tài khoản
            </button>
          </div>
          <table className="account-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Loại tài khoản</th>
                <th>Họ và Tên</th>
                <th>Mật khẩu</th>
                <th>Email</th>
                <th>Ngày đăng ký</th>
                <th>Hình ảnh</th>
                <th>Hoạt động</th>
                <th>Chức năng</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.map((account) => (
                <tr key={account.id}>
                  <td>{account.id}</td>
                  <td>{account.type}</td>
                  <td>{account.name}</td>
                  <td>{account.password}</td>
                  <td>{account.email}</td>
                  <td>{account.date}</td>
                  <td>
                    <img src={account.image} alt={account.name} className="account-image" />
                  </td>
                  <td>
                    <input type="checkbox" checked={account.active} readOnly />
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="lock-btn"
                        onClick={() => handleLock(account.id)}
                        title={account.active ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                      >
                        {account.active ? '🔒' : '🔓'}
                      </button>
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(account)}
                        title="Sửa tài khoản"
                      >
                        ✏️
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(account.id)}
                        title="Xóa tài khoản"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="close-btn" onClick={() => setShowAccountList(false)}>Đóng</button>
        </div>
      </div>
    );
  };

  const ParkingApprovalForm = () => {
    const [approvalCode, setApprovalCode] = useState('');

    const handleApprove = () => {
      if (approvalCode.trim() === '') {
        alert('Vui lòng nhập mã để duyệt bãi đỗ!');
        return;
      }
      alert(`Bãi đỗ đã được phê duyệt với mã: ${approvalCode}`);
      setShowParkingApprovalForm(false);
    };

    const handleReject = () => {
      if (window.confirm('Bạn có chắc chắn muốn từ chối bãi đỗ này?')) {
        alert('Bãi đỗ đã bị từ chối.');
        setShowParkingApprovalForm(false);
      }
    };

    const parking = parkingList[0];

    return (
      <div className="parking-approval-overlay">
        <div className="parking-approval-form">
          <h3>Đơn Đăng Ký</h3>
          <div className="parking-approval-content">
            <div className="parking-info">
              <h4>Hồ sơ cá nhân</h4>
              {parking.ownerImage && (
                <img src={parking.ownerImage} alt="Owner" className="owner-image" />
              )}
              <p><strong>Họ và Tên:</strong> {parking.ownerName}</p>
              <p><strong>Ngày sinh:</strong> {parking.dob}</p>
              <p><strong>Số điện thoại:</strong> {parking.phone}</p>
              <p><strong>Email:</strong> {parking.email}</p>
            </div>
            <div className="parking-details">
              <h4>Thông tin bãi</h4>
              <p><strong>Tên bãi:</strong> {parking.parkingName}</p>
              <p><strong>Trị trí:</strong> {parking.location}</p>
              <p><strong>Số lượng xe:</strong> {parking.capacity}</p>
              <p><strong>Loại xe:</strong> {parking.vehicleTypes}</p>
              <img src={parking.image} alt="Parking Lot" className="parking-image" />
            </div>
          </div>
          <div className="form-group">
            <label>Nhập mã để duyệt bãi đỗ xe:</label>
            <input
              type="text"
              value={approvalCode}
              onChange={(e) => setApprovalCode(e.target.value)}
              placeholder="Nhập mã..."
            />
          </div>
          <div className="form-buttons">
            <button className="approve-btn" onClick={handleApprove}>Phê duyệt</button>
            <button className="reject-btn" onClick={handleReject}>Từ chối</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="admin-page">
      <div className="sidebar">
        <ul>
          <li>Trang Chủ</li>
          <li onClick={() => setShowAccountList(true)}>Quản Lý Tài Khoản</li>
          <li onClick={() => setShowParkingApprovalForm(true)}>Duyệt Bãi Đỗ</li>
          <li>Xử Lý Vi Phạm</li>
          <li>Khuyến Mãi</li>
          <li>Thống Kê</li>
        </ul>
        <div className="logout-btn" onClick={handleLogout}>Đăng xuất</div>
      </div>

      <div className="main-content">
        <div className="header">
          <h3>Admin</h3>
          <div className="header-icons">
            <span>🔍</span>
            <span>🔔</span>
          </div>
        </div>

        <div className="content-wrapper">
          <div className="cards">
            <div className="card">
              <h4>Tổng quan doanh thu</h4>
              <p>7,500,000 VNĐ</p>
              <span className="percentage positive">+16%</span>
            </div>
            <div className="card">
              <h4>Xe máy</h4>
              <p>3,000,000 VNĐ</p>
              <span className="percentage negative">-42%</span>
            </div>
            <div className="card">
              <h4>Xe tải</h4>
              <p>2,700,000 VNĐ</p>
              <span className="percentage negative">-10%</span>
            </div>
          </div>

          <div className="charts">
            <div className="bar-chart">
              <h3>Tổng quan doanh thu (04/03/2023 - 30/03/2023)</h3>
              <Bar data={barData} />
            </div>
            <div className="pie-chart">
              <h3>Tháng 3/2023</h3>
              <Pie data={pieData} />
            </div>
          </div>
        </div>
      </div>

      {showAccountList && <AccountListTable />}
      {showEditForm && <EditAccountForm />}
      {showAddForm && <AddAccountForm />}
      {showParkingApprovalForm && <ParkingApprovalForm />}
    </div>
  );
};

export default AdminPage;