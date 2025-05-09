import React, { useEffect, useState } from 'react';
import { Table, Button, message } from 'antd';
import axios from '../utils/axios';

export default function Apps() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchApps = async () => {
    setLoading(true);
    try {
      // 直接使用fetch API获取应用数据
      const response = await fetch('http://localhost:8000/apps/all');
      const data = await response.json();
      console.log('直接获取的应用数据:', data);
      
      // 直接设置应用数据
      if (Array.isArray(data)) {
        setApps(data);
      } else if (data && typeof data === 'object') {
        if (Array.isArray(data.apps)) {
          setApps(data.apps);
        } else {
          setApps([]);
        }
      } else {
        setApps([]);
      }
    } catch (error) {
      console.error('获取应用失败:', error);
      message.error('获取应用失败');
    }
    setLoading(false);
  };

  useEffect(() => { fetchApps(); }, []);

  const columns = [
    { title: 'ID', dataIndex: 'id' },
    { title: '应用名称', dataIndex: 'name' },
    { title: '价格', dataIndex: 'price' },
    { title: '状态', dataIndex: 'status' },
    { title: '操作', render: (_, rec) => <Button size="small">编辑</Button> }
  ];

  return (
    <div>
      <h2>AI应用管理</h2>
      <Table dataSource={apps} columns={columns} rowKey="id" loading={loading} />
    </div>
  );
}
