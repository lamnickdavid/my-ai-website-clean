import React from 'react';
import { ProLayout } from '@ant-design/pro-layout';
import { Outlet, useNavigate } from 'react-router-dom';

import { DashboardOutlined, AppstoreOutlined, UserOutlined, ShoppingCartOutlined, SettingOutlined } from '@ant-design/icons';
const menuData = [
  { path: '/dashboard', name: '仪表盘', icon: <DashboardOutlined /> },
  { path: '/apps', name: 'AI应用管理', icon: <AppstoreOutlined /> },
  { path: '/users', name: '用户管理', icon: <UserOutlined /> },
  { path: '/orders', name: '订单管理', icon: <ShoppingCartOutlined /> },
  { path: '/settings', name: '系统设置', icon: <SettingOutlined /> },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  return (
    <ProLayout
      title="后台管理"
      menuDataRender={() => menuData}
      menuItemRender={(item, dom) => (
        <span onClick={() => navigate(item.path)}>{dom}</span>
      )}
      onMenuHeaderClick={() => navigate('/dashboard')}
      layout="mix"
      fixSiderbar
      fixedHeader
    >
      <Outlet />
    </ProLayout>
  );
}
