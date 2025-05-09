import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Popconfirm } from 'antd';
import axios from '../utils/axios';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form] = Form.useForm();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // 直接使用fetch API获取用户数据
      const response = await fetch('http://localhost:8000/users/');
      const data = await response.json();
      console.log('直接获取的用户数据:', data);
      
      // 直接设置用户数据
      if (Array.isArray(data)) {
        setUsers(data);
      } else if (data && typeof data === 'object') {
        if (Array.isArray(data.users)) {
          setUsers(data.users);
        } else {
          setUsers([]);
        }
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error('获取用户失败:', error);
      message.error('获取用户失败');
    }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editUser) {
        // FastAPI: PUT /users/{id}
        await axios.put(`/users/${editUser.id}`, values);
        message.success('编辑成功');
      } else {
        // FastAPI: POST /users/register
        await axios.post('/users/register', values);
        message.success('添加成功');
      }
      setModalOpen(false);
      setEditUser(null);
      form.resetFields();
      fetchUsers();
    } catch {}
  };

  const handleDelete = async (id) => {
    // FastAPI: DELETE /users/{id}
    await axios.delete(`/users/${id}`);
    message.success('删除成功');
    fetchUsers();
  };

  const columns = [
    { title: 'ID', dataIndex: 'id' },
    { title: '用户名', dataIndex: 'username' },
    { title: '余额', dataIndex: 'balance' },
    {
      title: '操作',
      render: (_, rec) => (
        <>
          <Button size="small" onClick={() => { setEditUser(rec); setModalOpen(true); form.setFieldsValue(rec); }}>编辑</Button>
          <Popconfirm title="确定删除？" onConfirm={() => handleDelete(rec.id)}>
            <Button size="small" danger style={{ marginLeft: 8 }}>删除</Button>
          </Popconfirm>
        </>
      )
    }
  ];

  return (
    <div>
      <h2>用户管理</h2>

      <Button type="primary" style={{ marginBottom: 16 }} onClick={() => { setEditUser(null); setModalOpen(true); form.resetFields(); }}>新增用户</Button>
      <Table dataSource={users} columns={columns} rowKey="id" loading={loading} />
      {(!loading && users.length === 0) && <div style={{color: 'red', marginTop: 16}}>未获取到任何用户数据，请检查数据库或后端接口！</div>}
      <Modal open={modalOpen} title={editUser ? '编辑用户' : '新增用户'} onOk={handleOk} onCancel={() => { setModalOpen(false); setEditUser(null); form.resetFields(); }} destroyOnClose>
        <Form form={form} layout="vertical">
          <Form.Item name="username" label="用户名" rules={[{ required: true, message: '请输入用户名' }]}> 
            <Input />
          </Form.Item>
          <Form.Item name="password" label="密码" rules={[{ required: !editUser, message: '请输入密码' }]}> 
            <Input.Password autoComplete="new-password" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
