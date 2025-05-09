import React, { useState } from 'react';
import { Button, Form, Input, Typography, Card, message } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

function Register() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await fetch('http://174.129.175.43:8000/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (res.ok) {
        message.success('注册成功，请登录');
        navigate('/login');
      } else {
        const data = await res.json();
        message.error(data.detail || '注册失败');
      }
    } catch (err) {
      message.error('请求出错');
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <Card style={{ width: 360 }}>
        <Title level={3} style={{ textAlign: 'center' }}>用户注册</Title>
        <Form name="register" onFinish={onFinish} autoComplete="off">
          <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}> 
            <Input placeholder="用户名" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}> 
            <Input.Password placeholder="密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>注册</Button>
          </Form.Item>
          <Form.Item>
            <Button type="link" block onClick={() => navigate('/login')}>已有账号？去登录</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default Register;
