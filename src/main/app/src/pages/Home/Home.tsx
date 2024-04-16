import React,{ useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Menu, theme, Modal } from 'antd';
import {
  UploadOutlined,
  UserOutlined,
  WechatOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { clearUserData } from '../../store/slice/userSlice';
import { persistor } from '../../store';
import NavSider from './NavSider/NavSider';

const { Sider, Content } = Layout;

const SideMenu: React.FC = () => {

  const [selectedKey, setSelectedKey] = useState<string>('2');
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleToggleMenu = (e: any) => {
    setSelectedKey(e.key);
  }

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const showLogoutModal = () => {
    setIsLogoutModalOpen(true);
  };

  const handleLogout = () => {
    persistor.purge().then(() => {
      persistor.flush();
      persistor.pause();
      persistor.persist();
      dispatch(clearUserData());
      setIsLogoutModalOpen(false);
      navigate('/');
    })
  }

  const handleCancelLogout = () => {
    setIsLogoutModalOpen(false);
  }

  return (
    <Layout>
      <Modal title="Do you really want to logout?"
        open={isLogoutModalOpen}
        onOk={handleLogout}
        onCancel={handleCancelLogout}
      >
        <p>your data persist in the browser will be cleared completely.</p>
      </Modal>
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
            {
              key: '4',
              icon: <LogoutOutlined onClick={showLogoutModal}/>,
              label: 'Logout',
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
