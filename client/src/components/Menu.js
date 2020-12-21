import styles from "./roomPage.module.scss"
import React, {useRef, useState, useEffect} from "react";
import {Link, useHistory} from 'react-router-dom'
import config from '../config/config'
// add Sound Effects
import soundFX from '../utils/sound';

const Menu = (props) => {
  // set button "invite link" inner text
  const [touched, setTouched] = useState(false);
  const [sound, setSound] = useState(true);
  const [usersOnline, setUsersOnline] = useState([]);
  const [copyStatus, setCopyStatus] = useState(false);
  // link elements creation
  const linkText = useRef();
  const history = useHistory();
  const currentPath = history.location.pathname.replace(/\/room\//, '');
  const inviteLink = `${config.SITE_NAME}:${config.CLIENT_PORT}/${currentPath}`;

  useEffect(() => {
    // get list of online users in the room
    if (props) {
      setUsersOnline(props.onlineUsers);
    }
  }, [props]);

  // create and buffer invite link
  const copyHandler = () => {
    setTouched(true);
    if (linkText) {
      try {
        const text = linkText.current.textContent;
        const successful = navigator.clipboard.writeText(text);
        const message = successful ? 'successfully copied' : `can't copy`;
        setCopyStatus(message);
        setTimeout(() => {
          setCopyStatus('copy invite link');
        }, 1500);
      } catch (e) {
        console.log('Provide rights to copy the text', e)
      }
    } else {
      setCopyStatus('room problem')
    }
    //sound effect
    soundFX('action');
  };

  return (
      <div className={styles.box} style={{flexDirection: 'column'}}>
        <button
            onClick={copyHandler}
            className={styles.box__button}
        >{touched ? copyStatus : 'copy invite link'}
        </button>
        <small
            ref={linkText}
            className={styles.box__small}
        >{inviteLink}</small>
        <Link className={styles.box__button} to="/" onClick={() => {
          //sound effect
          soundFX('action');
        }}>leave room</Link>
        <button
            onClick={() => {
              localStorage.setItem('mute', sound ? 'mute' : 'unmute');
              setSound(!sound);
            }}
            className={
              [styles.box__button_small, styles.box__button].join(' ')
            }
        >{sound ? '🔈 mute' : '🔊 unmute'}
        </button>
        <p>Users in room :</p>
        <div className={styles.box__list}>
          {usersOnline
              ? usersOnline.map((user, index) =>
                  (<li
                      className={styles.box__elem}
                      key={index}
                  >{user.name} </li>))
              : null
          }
        </div>
      </div>
  )
};

export default Menu