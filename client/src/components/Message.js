import styles from "./roomPage.module.scss"

const Message = (props) => {
  const item = props.data.item;
  item.isOwner = props.data.socket === item.socketId;
  return item.isBot ? botMessage({item}) : userMessage({item});

};

const userMessage = (props) => {
  const item = props.item;
  return (
      <div className={styles.chat__message + ' ' + (
          item.isOwner ? styles.chat__message_owner : ''
      )}>
        <div className={styles.chat__author}>
          {item.name}:
          <div className={styles.chat__time}>{item.time}</div>
        </div>
        <div className={styles.chat__text +' '+(
          item.isOwner ? styles.chat__text_owner : ''
        )}>{item.message}</div>
      </div>
  )

};
const botMessage = (props) => {
  const item = props.item;
  return (
      <div className={styles.bot}>
        <p className={styles.bot__text}>inbox: {item.message} ({item.time})</p>
      </div>
  )

};

export default Message