import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Popconfirm } from 'antd';
import axios from '../utils/axios';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editOrder, setEditOrder] = useState(null);
  const [form] = Form.useForm();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // 直接使用fetch API获取订单数据
      const response = await fetch('http://localhost:8000/history/all');
      const data = await response.json();
      console.log('直接获取的订单数据:', data);
      
      // 直接设置订单数据
      if (Array.isArray(data)) {
        setOrders(data);
      } else if (data && typeof data === 'object') {
        if (Array.isArray(data.history)) {
          setOrders(data.history);
        } else if (Array.isArray(data.orders)) {
          setOrders(data.orders);
        } else {
          setOrders([]);
        }
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('获取订单失败:', error);
      message.error('获取订单失败');
    }
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  // 只读模式，不支持增删改
  // const handleOk = async () => { ... }
  // const handleDelete = async (id) => { ... }


  const columns = [
    { title: 'ID', dataIndex: 'id' },
    { title: '用户名', dataIndex: 'username' },
    { title: '类型', dataIndex: 'type' },
    { title: '金额', dataIndex: 'amount' },
    { title: '描述', dataIndex: 'desc' },
    { title: '时间', dataIndex: 'timestamp' },
  ];

  return (
    <div>
      <h2>订单管理</h2>
      <Table dataSource={orders} columns={columns} rowKey="id" loading={loading} />
    </div>
  );
}
