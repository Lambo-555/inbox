import {useState, useEffect} from "react";
import {useHistory, useParams} from "react-router-dom";
import stringProtection from "../utils/stringProtection";
import styles from "./welcome.module.scss"; // custom styles for UI
// add Sound Effects
import soundFX from '../utils/sound';

//_____________________________
//_______ COMPONENT ___________
const Welcome = () => {
  const [name, setName] = useState(localStorage.getItem('name') || '');
  const [disabled, setDisabled] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [touched, setTouched] = useState(false);
  const [isInvited, setIsInvited] = useState(false);
  const history = useHistory();
  const params = useParams();

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      if (params.room) {
        setIsInvited(true)
      } else {
        setIsInvited(false)
      }
    }
    return () => {
      isMounted = false;
    }
  }, [params]);

  useEffect(() => {
    //create cycle for update control
    let isMounted = true;
    if (isMounted) {
      // checking user name
      if (name.length === 0 || name.length > 15) {
        setDisabled(true);

        // we do not show error on start
        if (touched) {
          // uniq errors handlers
          if (name.length === 0) setErrorMsg('name is too short');
          if (name.length > 15) setErrorMsg('name is too long');
        }
      } else {

        // if all is ok we let user join new room
        setDisabled(false);
        setErrorMsg('');
      }

      // we store `name` in local storage
      localStorage.setItem('name', name);
    }
    return () => {
      isMounted = false;
    }
  }, [name, touched]);

  const enterHandler = (e) => {
    // if we invited
    e.preventDefault();
    const path = isInvited
        ? `/room/${params.room}`
        : `/room/${getRoomName()}`;
    history.push(path);
    //sound effect
    soundFX('action');
  };

  const getRoomName = () => {
    // if we create room -> generate room name
    let nameLength = 15;
    let randomString = '';
    while (randomString.length < nameLength) {
      randomString += Math.random().toString(36).substring(2);
    }
    return randomString
  };

  return (
      <div className={styles.back}>
        <h1 className={styles.head}>INBOX</h1>
        <p className={styles.subhead}>fast messaging...</p>
        <form className={styles.form}>
          <input
              className={styles.form__input}
              type="text"
              value={name}
              onChange={(e) => {
                if (!touched) setTouched(true);
                setName(stringProtection(e.target.value));
              }}
          />
          {errorMsg
              ? <p className={styles.form__error}>{errorMsg}</p>
              : <p className={styles.form__error}>{touched ? "it is a good name" : "enter your name"}</p>
          }
          <button
              style={{opacity: disabled ? 0.4 : 1}}
              className={styles.form__button}
              disabled={disabled}
              onClick={enterHandler}
          >{isInvited ? "Join room" : "Create room"}
          </button>

        </form>
      </div>
  )
};

export default Welcome