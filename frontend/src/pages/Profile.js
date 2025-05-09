import React, { useEffect, useState } from 'react';
import { Card, Typography, Button, message, Input, Tabs, Table } from 'antd';
import { authFetch } from '../auth';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

function Profile() {
  const [user, setUser] = useState(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [tabKey, setTabKey] = useState('profile');
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const u = JSON.parse(userStr);
      setUser(u);
      // 拉取历史记录
      authFetch('http://174.129.175.43:8000/history/list')
        .then(res => res.json())
        .then(data => setHistory(data.history || []));
    } else {
      message.warning('请先登录');
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    message.success('已退出登录');
    navigate('/login');
  };

  const handleRecharge = async () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      message.error('请输入正确的充值金额');
      return;
    }
    setLoading(true);
    try {
      const res = await authFetch('http://174.129.175.43:8000/balance/recharge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Number(amount) }),
      });
      if (res.ok) {
        const data = await res.json();
        message.success('充值成功');
        // 更新本地用户余额
        const newUser = { ...user, balance: data.balance };
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        setAmount('');
      } else {
        const data = await res.json();
        message.error(data.detail || '充值失败');
      }
    } catch (err) {
      message.error('请求出错');
    }
    setLoading(false);
  };

  if (!user) return null;

  const columns = [
    { title: '类型', dataIndex: 'type', key: 'type', render: t => t === 'recharge' ? '充值' : '消费' },
    { title: '金额', dataIndex: 'amount', key: 'amount', render: v => (v > 0 ? '+' : '') + v },
    { title: '说明', dataIndex: 'desc', key: 'desc' },
    { title: '时间', dataIndex: 'timestamp', key: 'timestamp' },
  ];

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <Card style={{ width: 500 }}>
        <Tabs activeKey={tabKey} onChange={setTabKey}>
          <TabPane tab="个人信息" key="profile">
            <Title level={3}>个人中心</Title>
            <Text strong>用户名：</Text> <Text>{user.username}</Text>
            <br /><br />
            <Text strong>余额：</Text> <Text>{user.balance}</Text>
            <br /><br />
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <Input
                type="number"
                placeholder="充值金额"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                style={{ width: 180 }}
              />
              <Button type="primary" loading={loading} onClick={handleRecharge}>充值</Button>
            </div>
            <Button type="primary" danger block onClick={handleLogout}>退出登录</Button>
          </TabPane>
          <TabPane tab="历史记录" key="history">
            <Table
              columns={columns}
              dataSource={history}
              rowKey={(r, i) => i}
              pagination={{ pageSize: 5 }}
            />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
}

export default Profile;
