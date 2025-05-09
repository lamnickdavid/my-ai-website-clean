import React, { useState } from 'react';
import { Button, Form, Input, message } from 'antd';
import axios from 'axios';

export default function Login({ onLogin }) {
  const [loading, setLoading] = useState(false);

  const handleFinish = async (values) => {
    setLoading(true);
    try {
      const res = await axios.post('/api/admin/login', values);
      if (res.data && res.data.token) {
        localStorage.setItem('admin_token', res.data.token);
        message.success('登录成功！');
        if (onLogin) onLogin();
      } else {
        message.error('登录失败！');
      }
    } catch (e) {
      message.error('用户名或密码错误！');
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#f0f2f5' }}>
      <Form onFinish={handleFinish} style={{ width: 320, padding: 32, background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px #0001' }}>
        <h2 style={{ marginBottom: 24, textAlign: 'center' }}>后台管理登录</h2>
        <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}> 
          <Input placeholder="用户名" autoComplete="off" />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}> 
          <Input.Password placeholder="密码" autoComplete="new-password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>登录</Button>
        </Form.Item>
      </Form>
    </div>
  );
}
