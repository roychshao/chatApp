import React,{ useState } from 'react';
import { Layout, Menu, theme } from 'antd';
import {
  UploadOutlined,
  UserOutlined,
  WechatOutlined
} from '@ant-design/icons';
import NavSider from './NavSider/NavSider';

const { Sider, Content } = Layout;

const SideMenu: React.FC = () => {

  const [selectedKey, setSelectedKey] = useState<string>('2');

  const handleToggleMenu = (e: any) => {
    setSelectedKey(e.key);
  }

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={true}>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['2']}
          onClick={handleToggleMenu}
          items={[
            {
              key: '1',
              icon: <UserOutlined />,
              label: 'User',
            },
            {
              key: '2',
              icon: <WechatOutlined />,
              label: 'Chatroom',
            },
            {
              key: '3',
              icon: <UploadOutlined />,
              label: 'Others',
            },
          ]}
        />
      </Sider>
      <Layout>
        <Content
          style={{
            margin: '0px 0px',
            padding: 0,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <NavSider selectedKey={ selectedKey } />
        </Content>
      </Layout>
    </Layout>
  );
};

export default SideMenu;
