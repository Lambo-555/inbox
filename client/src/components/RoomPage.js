/*
* we create and listen custom client-server events
* on each event we update DOM elements
* TODO: add video chat at new Child-Component
* */

import {useParams} from 'react-router-dom'
import React, {useState, useEffect, useRef} from 'react'
import {io} from 'socket.io-client'
import config from '../config/config'
import styles from "./roomPage.module.scss"
import Message from "./Message";
import stringProtection from "../utils/stringProtection";
import HocModal from "./HocModal";
import Menu from "./Menu";
// add Sound Effects
import soundFX from '../utils/sound';
// import Video from "./Video";

// socket init http://localhost for dev
const socket = io.connect(`${config.SITE_NAME}:${config.SERVER_PORT}`);



//_____________________________
//_______ COMPONENT ___________
const RoomPage = () => {
  // chat variables
  const [cliMsg, setCliMsg] = useState('');
  const [cliName, setCliName] = useState(localStorage.getItem('name'));
  const [msgArr, setMsgArr] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalName, setModalName] = useState(null);
  const [roomName, setRoomName] = useState('');
  const [usersList, setUsersList] = useState([]);
  // react router DOM hooks
  const params = useParams();
  const msgInput = useRef();
  const chatLog = useRef();

  useEffect(() => {
    // create cycle for update control
    let isMounted = true;
    if (isMounted) {
      socket.connect();
      // user join the room at first time
      socket.emit('joinRoom', {name: cliName, room: params.room});
      // set user name from localStorage
      setCliName(localStorage.getItem('name'));
    }
    // unmount
    return () => {
      isMounted = false;
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    //create cycle for update control
    let isMounted = true;
    if (isMounted) {
      // get rooms\users info from server
      socket.on('roomUsers', (data) => {
        // set room name from server
        setRoomName(data.room);
        // set list of users from server
        setUsersList(data.users)
      });
      // message listeners
      socket.on('message', async (data) => {
        setMsgArr([...msgArr, data]);
        // scroll function
        setTimeout(() => {
          if (chatLog.current) {
            chatLog.current.scrollTop = chatLog.current.scrollHeight || 0;
          }
        }, 50);
      });
    }

    return () => {
      socket.off('roomUsers');
      socket.off('message');
      isMounted = false
    }
  });


  const onMessageSubmit = e => {
    // sending user messages from client
    e.preventDefault();
    // Sound effect
    soundFX('message');
    if (cliMsg.length === 0) return;
    socket.emit('chatMessage', {name: cliName, message: cliMsg});
    // clear form after sending messages
    setCliMsg('');
    //focus on DOM input and scroll down
    msgInput.current.focus();
  };

  //create chat messages list
  const renderChat = () => {
    // chat messages list
    return msgArr.map((item, index) => (
        <Message data={{item, socket: socket.id}} key={index}/>
    ))
  };

  // message handler, string cleaner
  const messageHandler = (text) => {
    setCliMsg(stringProtection(text));
  };

  // modal windows handlers
  const hideModalHandler = (windowName) => {
    soundFX('action');
    setShowModal(false);
  };
  const showModalHandler = (windowName) => {
    setShowModal(true);
  };

  //disconnected trigger
  if (socket.disconnected) {
    return (
        <div className={styles.back}>
          <div className={styles.page}>
            <h1 style={{textAlign: 'center'}}>Disconnected</h1>
          </div>
        </div>
    )
  }

  return (
      <div className={styles.back}>
        <div className={styles.page}>
          <div>
            {/*Main menu*/}
            <div className={styles.box}>
              <h3 className={styles.box__head}>Room</h3>
              <small className={styles.box__subhead}>{roomName}</small>

              <button
                  onClick={() => {
                    setModalName(<Menu onlineUsers={usersList}/>);
                    showModalHandler();
                  }}
                  className={
                    [styles.box__button, styles.box__button_small]
                        .join(' ')
                  }>Menu
              </button>
              {/*<button*/}
              {/*disabled={true}*/}
              {/*onClick={() => {*/}
              {/*showModalHandler();*/}
              {/*setModalName(<Video socket={socket} videoList={usersList}/>)*/}
              {/*}}*/}
              {/*className={*/}
              {/*[styles.box__button, styles.box__button_small]*/}
              {/*.join(' ')*/}
              {/*}>🎥*/}
              {/*</button>*/}
              {/*modal window*/}
              <HocModal
                  component={modalName}
                  action={hideModalHandler}
                  show={showModal}
              />
            </div>
          </div>

          <div className={styles.chat} ref={chatLog}>
            {renderChat()}
          </div>

          <div>
            <form
                className={styles.box}
                onSubmit={onMessageSubmit}
            >
              <input
                  className={styles.box__input}
                  type="text"
                  name={"message"}
                  onChange={e => messageHandler(e.target.value)}
                  value={cliMsg}
                  autoComplete="off"
                  ref={msgInput}
              />
              <button
                  type={"submit"}
                  className={
                    styles.box__button
                    + ' '
                    + styles.box__button_small
                  }>Send
              </button>
            </form>

          </div>
        </div>
      </div>
  )
};

export default RoomPage;