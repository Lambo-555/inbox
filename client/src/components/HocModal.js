import styles from "./roomPage.module.scss"

// we use HOC for create modal windows
const HocModal = (props) => {
  // use id for transparent background trigger
  const backTrigger = "backTrigger";
  return (
      // parent state triggers
      <div
          id={backTrigger}
          onClick={(e) => {
            if(e.target.id === backTrigger) {
              props.action()
            }
          }}
          className={styles.back}
          style={{
            background: `rgba(0,0,0,0.5)`,
            display: props.show ? 'flex' : 'none'
          }}
      >
        <div className={styles.modal}>
          <div
              style={{zIndex: '120'}}
              onClick={props.action}
              className={styles.modal__close}
          >X</div>
          {props.component}
        </div>
      </div>
  )
};

export default HocModal