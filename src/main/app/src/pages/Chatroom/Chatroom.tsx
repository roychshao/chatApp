import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Client } from "@stomp/stompjs";
import { RootState } from "../../store";
import { Input, Button, Layout, Row, Col, Avatar, Flex } from "antd";
import { FileAddOutlined } from "@ant-design/icons";
import {
  getChatroomById,
  appendMessage,
} from "../../store/slice/chatroomSlice";
import { chatroom } from "../../types/chatroom";
import { message } from "../../types/message";
import { Header } from "antd/es/layout/layout";
import { VariableSizeList as List } from "react-window";
import AutoSizer, { Size as AutoSize } from "react-virtualized-auto-sizer";

const { Footer, Content } = Layout;

const Chatroom: React.FC = () => {
  const dispatch = useDispatch();
  const userId = useSelector(
    (state: RootState) => state.session.sessions.userId,
  );
  const roomId = useSelector(
    (state: RootState) => state.session.sessions.selectedRoomId,
  );
  const rowHeights = useRef<any>({});

  const chatroomData: chatroom = useSelector((state: RootState) => {
    const idx = state.chatroom.roomProfile.rooms.findIndex((room: chatroom) => {
      return room.roomId === roomId;
    });
    return state.chatroom.roomProfile.rooms[idx];
  });
  const [wsClient, setWsClient] = useState<Client>(() => new Client());
  const [inputMessage, setInputMessage] = useState<string>("");
  const listRef = useRef<List>(null);

  useEffect(() => {
    dispatch(getChatroomById(roomId));
    /*
     * configure client websocket
     */
    const client = new Client({
      brokerURL: "ws://localhost:8080/chatApp",
      debug: (str) => {
        console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    let subscriptionId: any = null;
    client.onConnect = (frame) => {
      console.log("Connected: " + JSON.stringify(frame));

      if (subscriptionId) {
        client.unsubscribe(subscriptionId);
      }

      subscriptionId = client.subscribe(
        `/topic/${roomId}/messages`,
        (message) => {
          console.log("Received: " + message.body);
          const body = JSON.parse(message.body);
          dispatch(appendMessage({ roomId, body }));
        },
      );
    };

    client.onStompError = (frame) => {
      console.log("Broker reported error: " + frame.headers["message"]);
      console.log("Additional details: " + frame.body);
    };

    client.activate();
    setWsClient(client);
    /*
     * websocket end
     */
    return () => {
      if (subscriptionId) {
        client.unsubscribe(subscriptionId);
      }
      client.deactivate();
    };
  }, [roomId]);

  const sendMessage = (messageContent: message) => {
    wsClient.publish({
      destination: `/socket/${roomId}/messages`,
      body: JSON.stringify(messageContent),
    });
  };

  const handleSendMessage = () => {
    // send message
    const me = chatroomData.users.find((user) => user.userId === userId);
    const opponent = chatroomData.users.find((user) => user.userId !== userId);
    let message: message = {
      messageId: "",
      content: inputMessage,
      fromUser: {
        userId: userId,
        name: me?.name ?? "",
        age: me?.age ?? 0,
        gender: me?.gender ?? "",
        email: me?.email ?? "",
        password: me?.password ?? "",
      },
      toUser: {
        userId: opponent?.userId ?? "",
        name: opponent?.name ?? "",
        age: opponent?.age ?? 0,
        gender: opponent?.gender ?? "",
        email: opponent?.email ?? "",
        password: opponent?.password ?? "",
      },
      chatroom: chatroomData,
      time: new Date(),
    };

    if (message.content.length <= 255) {
      console.warn("The message length longer than 255.");
    }

    sendMessage(message);
    setInputMessage("");
  };

  const getItemHeight = (index: number) => {
    return rowHeights.current[index] + 8 || 82;
  };

  const setItemHeight = (index: any, size: any) => {
    listRef.current?.resetAfterIndex(0);
    rowHeights.current = { ...rowHeights.current, [index]: size };
  };

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollToItem(chatroomData.messages.length, "end");
    }
  }, [chatroomData.messages.length]);

  return (
    <Layout>
      <Header
        style={{
          height: "8vh",
        }}
      >
        <Flex align="center" justify="left" style={{ height: "100%" }}>
          <p style={{ color: "white", fontSize: "20px" }}>
            {chatroomData?.roomName}
          </p>
        </Flex>
      </Header>
      <Content
        style={{
          height: "80vh",
        }}
      >
        <AutoSizer>
          {({ height, width }: AutoSize) => (
            <List
              ref={listRef}
              height={height}
              itemCount={chatroomData.messages.length}
              itemSize={getItemHeight}
              width={width}
              initialScrollOffset={(chatroomData.messages.length - 1) * 120}
            >
              {({ index, style }) => {
                const message = chatroomData.messages[index];
                const itemRef = useRef<any>({});

                useEffect(() => {
                  if (itemRef.current) {
                    setItemHeight(index, itemRef.current.clientHeight);
                  }
                }, [itemRef]);

                return (
                  <div
                    style={{
                      ...style,
                      display: "flex",
                      justifyContent:
                        message.fromUser.userId === userId
                          ? "flex-end"
                          : "flex-start",
                      height: "auto",
                      margin: "20px 0",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection:
                          message.fromUser.userId === userId
                            ? "row-reverse"
                            : "row",
                        alignItems: "center",
                        maxWidth: "70%",
                      }}
                    >
                      <Avatar
                        src={
                          message.fromUser.gender === "male"
                            ? "https://api.dicebear.com/7.x/miniavs/svg?seed=25"
                            : "https://api.dicebear.com/7.x/miniavs/svg?seed=44"
                        }
                        style={{ marginRight: "8px", marginLeft: "8px" }}
                      />
                      <div
                        ref={itemRef}
                        style={
                          message.fromUser.userId === userId
                            ? {
                                padding: "10px 20px",
                                backgroundColor: "#add8e6",
                                borderRadius: "20px",
                                maxWidth: "80%",
                                margin: "5px 0",
                              }
                            : {
                                padding: "10px 20px",
                                backgroundColor: "#ffe4b5",
                                borderRadius: "20px",
                                maxWidth: "80%",
                                margin: "5px 0",
                              }
                        }
                      >
                        {message.content}
                      </div>
                    </div>
                  </div>
                );
              }}
            </List>
          )}
        </AutoSizer>
      </Content>
      <Footer
        style={{
          height: "12vh",
        }}
      >
        <Row align={"middle"}>
          <Col span={2}>
            <FileAddOutlined style={{ fontSize: "18px" }} />
          </Col>
          <Col span={18}>
            <Input
              value={inputMessage}
              placeholder="Type a message"
              size="large"
              onChange={(e) => setInputMessage(e.target.value)}
              onPressEnter={handleSendMessage}
            />
          </Col>
          <Col span={3} offset={1}>
            <Button onClick={handleSendMessage} size="large">
              Send
            </Button>
          </Col>
        </Row>
      </Footer>
    </Layout>
  );
};

export default Chatroom;
