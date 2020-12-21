import styles from "./roomPage.module.scss"
import React, {useRef, useState, useEffect} from "react";
import {Link, useHistory} from 'react-router-dom'
import config from '../config/config'

const Menu = (props) => {
  // set button "invite link" inner text
  const [touched, setTouched] = useState(false);
  const [usersOnline, setUsersOnline] = useState([]);
  const [copyStatus, setCopyStatus] = useState(false);
  // link elements creation
  const linkText = useRef();
  const history = useHistory();
  const currentPath = history.location.pathname.replace(/\/room\//, '');
  const inviteLink = `${config.SITE_NAME}${currentPath}`;

  useEffect(() => {
    // get list of online users in the room
    if (props) {
      setUsersOnline(props.onlineUsers);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.onlineUsers]);

  // create and buffer invite link
  const copyHandler = () => {
    setTouched(true);
    if (linkText) {
      try {
        const text = linkText.current.textContent;
        const successful = navigator.clipboard.writeText(text);
        const message = successful ? 'success copy' : 'you cant copy';
        setCopyStatus(message)
      } catch (e) {
        console.log('Provide rights to copy the text', e)
      }
    } else {
      setCopyStatus('room problem')
    }
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
        <Link className={styles.box__button} to="/">leave room</Link>
        <p>Users in room :</p>
        <div className={styles.box__list}>
          {usersOnline.length > 0
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