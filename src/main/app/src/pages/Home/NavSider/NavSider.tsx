import React from 'react';
import { Layout, theme } from 'antd';
import RoomList from '../../RoomList/RoomList';
import User from '../../User/User';

interface NavSiderProps {
 selectedKey: string;
}

const NavSider: React.FC<NavSiderProps> = (props) => {

  /* about selectedKey
   * 1: User
   * 2: Chatroom
   */

  const { selectedKey } = props;

  const { Sider, Content } = Layout;

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  

  return (
    <div>
      <Layout>
        <Sider 
          trigger={null}
          collapsible
          collapsed={false}
          width={300}
          style={{ overflow: 'auto', backgroundColor: 'white', paddingLeft: '10px', borderRight: '3px solid #f0f0f0' }}>
          { selectedKey === '1' ? <User /> : null }
          { selectedKey === '2' ? <RoomList /> : null }
        </Sider>
        <Layout>
          <Content
            style={{
            margin: '0px 0px',
            padding: 0,
            minHeight: '100vh',
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            }}
          >  
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}


export default NavSider;
