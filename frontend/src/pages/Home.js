import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Card, Button, message } from 'antd';
import { authFetch } from '../auth';
import { RobotOutlined, PictureOutlined, AudioOutlined } from '@ant-design/icons';

const { Content, Footer } = Layout;

function Home() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [apps, setApps] = useState([]);
  const [loadingAppId, setLoadingAppId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://174.129.175.43:8000/apps/list')
      .then(res => res.json())
      .then(data => setApps(data.apps || []));
  }, []);

  const handleUseApp = async (appId, price) => {
    if (!user) {
      message.warning('请先登录');
      setTimeout(() => navigate('/login'), 800);
      return;
    }
    setLoadingAppId(appId);
    try {
      const res = await authFetch('http://174.129.175.43:8000/apps/use', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ app_id: appId }),
      });
      if (res.ok) {
        const data = await res.json();
        const newUser = { ...user, balance: data.balance };
        localStorage.setItem('user', JSON.stringify(newUser));

        message.success({
          content: (
            <>
              <div>体验成功，已扣费 <span style={{color:'#fa541c'}}>￥{price}</span>！</div>
              <div>当前余额：<span style={{color:'#52c41a',fontWeight:700}}>{data.balance}</span> 元</div>
              <a href="/profile" style={{marginLeft:0}} onClick={e => {e.preventDefault(); window.location.href='/profile?tab=history';}}>查看历史记录</a>
            </>
          ),
          duration: 3
        });
      } else {
        const data = await res.json();
        message.error(data.detail || '调用失败');
        // 按钮抖动动画
        const btn = document.querySelector(`#use-app-btn-${appId}`);
        if(btn) {
          btn.classList.add('shake');
          setTimeout(()=>btn.classList.remove('shake'), 600);
        }
      }
    } catch (err) {
      message.error('请求出错');
    }
    setLoadingAppId(null);
  };


  // icon映射
  const iconMap = {
    1: <RobotOutlined style={{ fontSize: 40, color: '#2f54eb' }} />, // 智能文案生成
    2: <PictureOutlined style={{ fontSize: 40, color: '#faad14' }} />, // 图片风格转换
    3: <AudioOutlined style={{ fontSize: 40, color: '#13c2c2' }} />, // 语音转文字
  };

  return (
    <Layout style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e0e7ff 0%, #f0f5ff 100%)' }}>

      <Content style={{ padding: 0, minHeight: 600, background: '#f7f8fa' }}>
        {/* Tabela风格主视觉区 */}
        <div className="home-hero-responsive" style={{ maxWidth: 1040, margin: '0 auto', padding: '56px 0 0 0', display: 'flex', flexWrap: 'nowrap', alignItems: 'flex-start', gap: 36 }}>
          {/* 左侧标题区 */}
          <div style={{ flex: 1, minWidth: 320, maxWidth: 520 }}>
            <div style={{ position: 'relative', marginBottom: 24 }}>
              <h1 style={{ fontWeight: 800, fontSize: 44, color: '#222', margin: 0, lineHeight: 1.18, textAlign: 'left' }}>
                您的
                <span style={{ position: 'relative', display: 'inline-block', margin: '0 10px' }}>
                  <svg width="120" height="48" style={{ position: 'absolute', left: '-18px', top: '-20px', zIndex: 0 }}>
                    <ellipse cx="60" cy="24" rx="56" ry="18" fill="none" stroke="#ffe066" strokeWidth="6" style={{ filter: 'blur(0.5px)' }} />
                  </svg>
                  <span style={{ position: 'relative', zIndex: 1, color: '#222', fontWeight: 900, fontSize: 48 }}>终极</span>
                </span>
                AI应用平台
              </h1>
              <div style={{ fontSize: 32, color: '#222', fontWeight: 700, margin: '18px 0 0 0', textAlign: 'left' }}>管理与体验，尽在一站</div>
            </div>
            <div style={{ fontSize: 17, color: '#555', margin: '18px 0 0 0', textAlign: 'left', maxWidth: 420 }}>
              所有AI应用管理与体验功能，尽在一个统一平台。
            </div>
          </div>
          {/* 右侧功能描述或插画区 */}
          <div style={{ flex: 1, minWidth: 260, maxWidth: 520, display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 16px #0001', padding: '24px 20px', minHeight: 70, display: 'flex', alignItems: 'center', gap: 14 }}>
              <RobotOutlined style={{ fontSize: 28, color: '#2f54eb' }} />
              <span style={{ fontWeight: 600, color: '#222', fontSize: 17 }}>多种AI应用一站式体验</span>
            </div>
            <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 16px #0001', padding: '24px 20px', minHeight: 70, display: 'flex', alignItems: 'center', gap: 14 }}>
              <PictureOutlined style={{ fontSize: 28, color: '#faad14' }} />
              <span style={{ fontWeight: 600, color: '#222', fontSize: 17 }}>充值即可一键使用</span>
            </div>
            <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 16px #0001', padding: '24px 20px', minHeight: 70, display: 'flex', alignItems: 'center', gap: 14 }}>
              <AudioOutlined style={{ fontSize: 28, color: '#13c2c2' }} />
              <span style={{ fontWeight: 600, color: '#222', fontSize: 17 }}>安全支付，余额透明</span>
            </div>
          </div>
        </div>
        {/* 卡片区，Tabela风格大留白+阴影+简化内容 */}
        <div id="ai-apps" className="home-apps-responsive" style={{ maxWidth: 1040, margin: '56px auto 0 auto', padding: '0 16px 48px 16px', display: 'flex', flexWrap: 'wrap', gap: 36, justifyContent: 'flex-start' }}>
          {apps.map(app => (
            <Card
              key={app.id}
              style={{
                width: 300,
                minHeight: 210,
                borderRadius: 22,
                boxShadow: '0 8px 32px #0001',
                cursor: 'pointer',
                marginLeft: 0, // 保证卡片左对齐
                background: '#fff',
                border: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.18s, box-shadow 0.18s'
              }}
              bodyStyle={{ padding: 26, textAlign: 'center' }}
              hoverable
              onMouseOver={e => (e.currentTarget.style.transform = 'translateY(-7px) scale(1.025)')}
              onMouseOut={e => (e.currentTarget.style.transform = 'none')}
            >
              <div style={{ marginBottom: 10 }}>
                {iconMap[app.id] || <RobotOutlined style={{ fontSize: 38, color: '#aaa' }} />}
              </div>
              <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 6 }}>{app.name}</div>
              <div style={{ color: '#888', fontSize: 15, marginBottom: 8, minHeight: 36 }}>{app.desc}</div>
              <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 12 }}>价格：<span style={{ color: '#faad14', fontWeight: 800 }}>{app.price} 元</span></div>
              <Button
                id={`use-app-btn-${app.id}`}
                type="primary"
                size="middle"
                shape="round"
                style={{ width: '90%', letterSpacing: 2, fontWeight: 600, background: '#222', border: 'none', fontSize: 16 }}
                onClick={() => handleUseApp(app.id, app.price)}
                loading={loadingAppId === app.id}
              >
                立即体验
              </Button>
            </Card>
          ))}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center', background: 'transparent', color: '#888', fontSize: 16 }}>
        2025 AI Platform &nbsp;|&nbsp; 体验AI未来
        © 2025 AI Platform &nbsp;|&nbsp; 体验AI未来
      </Footer>
    </Layout>
  );
}

// 响应式样式
const responsiveStyle = `
@media (max-width: 900px) {
  .home-hero-responsive {
    flex-direction: column !important;
    gap: 24px !important;
    padding: 36px 0 0 0 !important;
    align-items: stretch !important;
  }
  .home-hero-responsive > div {
    min-width: 0 !important;
    max-width: 100% !important;
  }
@media (max-width: 600px) {
  .home-hero-responsive {
    flex-direction: column !important;
    gap: 12px !important;
    padding: 18px 0 0 0 !important;
  }
  .home-hero-responsive h1 {
    font-size: 1.3rem !important;
  }
  .home-apps-responsive {
    flex-direction: column !important;
    gap: 16px !important;
    padding: 0 4px 24px 4px !important;
    margin: 32px auto 0 auto !important;
  }
  .home-apps-responsive .ant-card {
    width: 98vw !important;
    min-width: 0 !important;
    max-width: 100vw !important;
    margin: 0 auto 8px auto !important;
    box-sizing: border-box !important;
  }
}
`;

// 在组件头部插入style标签
if (typeof window !== 'undefined' && !document.getElementById('home-responsive-style')) {
  const style = document.createElement('style');
  style.id = 'home-responsive-style';
  style.innerHTML = responsiveStyle;
  document.head.appendChild(style);
}

export default Home;
