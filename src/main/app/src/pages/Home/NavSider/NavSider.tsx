import React from 'react';
import { useSelector } from 'react-redux';
import { Layout, theme } from 'antd';
import RoomList from '../../RoomList/RoomList';
import User from '../../User/User';
import Chatroom from '../../Chatroom/Chatroom';
import { RootState } from './../../../store/index.ts';

// TODO: clear reducer persisted in sessionStorage when logout
// persistor.purge(['session']);

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

  const roomId = useSelector((state: RootState) => state.session.sessions.selectedRoomId);

  return (
    <div>
      <Layout>
        <Sider
          trigger={null}
          collapsible
          collapsed={false}
          width={350}
          style={{ overflow: 'auto', backgroundColor: 'white', paddingLeft: '10px', borderRight: '3px solid #f0f0f0' }}>
          {selectedKey === '1' ? <User /> : null}
          {selectedKey === '2' ? <RoomList /> : null}
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
            {roomId !== '' ? <Chatroom /> : <p>No Room is selected</p>}
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}

export default NavSider;
