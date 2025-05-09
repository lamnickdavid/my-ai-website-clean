import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'antd';

function NavBar() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));
  const [highlight, setHighlight] = useState(false);
  const navigate = useNavigate();

  // 全局余额同步，监听 localStorage user 变化
  useEffect(() => {
    const interval = setInterval(() => {
      const u = JSON.parse(localStorage.getItem('user') || 'null');
      if (!user || !u || user.balance !== u.balance || user.username !== u.username) {
        setUser(u);
        setHighlight(true);
        setTimeout(() => setHighlight(false), 1200);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div style={{ width: '100%', background: '#fff', borderBottom: '1px solid #eee', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 1200, margin: '0 auto', height: 70, padding: '0 32px' }}>
        {/* LOGO+菜单 靠左 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <img src="https://huggingface.co/front/assets/huggingface_logo-noborder.svg" alt="logo" style={{ height: 28, marginRight: 10 }} />
          <span style={{ color: '#222', fontWeight: 800, fontSize: 20, letterSpacing: 1, marginRight: 18 }}>AI 应用平台</span>
          <Link to="/" style={{ color: '#222', fontWeight: 500, fontSize: 16, textDecoration: 'none', padding: '4px 0', marginRight: 10 }}>首页</Link>
          {user && (
            <Link to="/profile" style={{ color: '#222', fontWeight: 500, fontSize: 16, textDecoration: 'none', padding: '4px 0' }}>个人中心</Link>
          )}
        </div>
        {/* 用户区 右侧 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {user && (
            <span style={{ color: '#222', fontWeight: 400, fontSize: 15, borderRadius: 8, padding: '2px 12px', marginRight: 4, transition: 'box-shadow 0.4s', boxShadow: highlight ? '0 0 12px 2px #ffe06688' : undefined, background: highlight ? '#fffbe6' : '#f5f5f5' }}>
              {user.username} | 余额: <span style={{ color: highlight ? '#faad14' : '#ffd700', fontWeight: 700, transition: 'color 0.4s' }}>{user.balance}</span>
            </span>
          )}
          {user ? (
            <Button type="primary" ghost size="small" onClick={handleLogout} style={{ borderRadius: 18, color: '#222', borderColor: '#ddd', fontWeight: 500, background: '#fafafa' }}>
              退出登录
            </Button>
          ) : (
            <>
              <Button type="primary" ghost size="small" style={{ borderRadius: 6, marginRight: 6 }} onClick={() => navigate('/login')}>登录</Button>
              <Button type="primary" ghost size="small" style={{ borderRadius: 6 }} onClick={() => navigate('/register')}>注册</Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// 响应式样式
const navResponsiveStyle = `
@media (max-width: 600px) {
  /* 顶部导航栏移动端纵向堆叠，居中 */
  div[style*='max-width: 1200px'] {
    flex-direction: column !important;
    height: auto !important;
    padding: 0 2vw !important;
    align-items: center !important;
    gap: 10px !important;
  }
  div[style*='max-width: 1200px'] > div {
    justify-content: center !important;
    margin: 0 !important;
    gap: 8px !important;
  }
  div[style*='max-width: 1200px'] span, div[style*='max-width: 1200px'] a {
    font-size: 16px !important;
  }
  div[style*='max-width: 1200px'] .ant-btn {
    font-size: 15px !important;
    padding: 8px 18px !important;
    border-radius: 16px !important;
    margin: 0 2vw !important;
  }
}

  .navbar-responsive {
    height: 54px !important;
  }
  .navbar-responsive > div {
    padding: 0 8px !important;
    height: 54px !important;
  }
  .navbar-responsive img {
    height: 22px !important;
    margin-right: 6px !important;
  }
  .navbar-responsive span, .navbar-responsive a {
    font-size: 15px !important;
  }
  .navbar-responsive .ant-btn {
    font-size: 13px !important;
    padding: 2px 10px !important;
    border-radius: 14px !important;
  }
  .navbar-responsive div[style*='gap: 32px'] {
    gap: 12px !important;
  }
}
@media (max-width: 600px) {
  .navbar-responsive {
    height: auto !important;
    flex-direction: column !important;
    align-items: stretch !important;
    border-bottom: 1px solid #eee !important;
    padding-bottom: 8px !important;
  }
  .navbar-responsive > div {
    flex-direction: column !important;
    align-items: center !important;
    width: 100vw !important;
    padding: 0 2vw !important;
    height: auto !important;
    gap: 10px !important;
  }
  .navbar-responsive span, .navbar-responsive a {
    font-size: 16px !important;
    margin: 0 2vw !important;
  }
  .navbar-responsive .ant-btn {
    font-size: 15px !important;
    padding: 8px 18px !important;
    border-radius: 16px !important;
    margin: 0 2vw !important;
  }
  .navbar-responsive div[style*='gap: 32px'] {
    gap: 10px !important;
    flex-direction: column !important;
    align-items: center !important;
  }
}

  .navbar-responsive {
    height: auto !important;
    flex-direction: column !important;
    align-items: flex-start !important;
    border-bottom: 1px solid #eee !important;
  }
  .navbar-responsive > div {
    flex-direction: column !important;
    align-items: flex-start !important;
    width: 100vw !important;
    padding: 0 2vw !important;
    height: auto !important;
    gap: 6px !important;
  }
  .navbar-responsive span, .navbar-responsive a {
    font-size: 14px !important;
  }
  .navbar-responsive .ant-btn {
    font-size: 12px !important;
    padding: 2px 8px !important;
    border-radius: 12px !important;
  }
  .navbar-responsive div[style*='gap: 32px'] {
    gap: 8px !important;
    flex-direction: column !important;
    align-items: flex-start !important;
  }
}
`;

if (typeof window !== 'undefined' && !document.getElementById('nav-responsive-style')) {
  const style = document.createElement('style');
  style.id = 'nav-responsive-style';
  style.innerHTML = navResponsiveStyle;
  document.head.appendChild(style);
}

export default NavBar;
