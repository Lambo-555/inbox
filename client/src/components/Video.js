import styles from "./roomPage.module.scss";
import {useState, useEffect} from 'react';

// const peerConnection = new RTCPeerConnection(configuration);
// const dataChannel = peerConnection.createDataChannel();

const Video = (props) => {
  const [myStream, setMySteam] = useState('');
  const [videoList, setVideoList] = useState([]);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia(
        {'video': true, 'audio': true}
    ).then(stream => {
      setMySteam(stream);
    }).catch(e => console.log(e));

    setVideoList(props.videoList ? props.videoList : [{src: myStream}]);

    return () => {
      setVideoList([])
    }
  }, [props, myStream]);


  // const addVideoStream = (stream) => {
  //   setVideoList([...videoList, {src: stream, muted: true, autoplay: true}]);
  //   console.log(videoList);
  // };

  return (
      <div className={styles.box} style={{flexDirection: 'column'}}>
        <div className={styles.video__box}>
          {videoList.length > 0
              ? videoList.map((elem, index) => {
                return <video
                    className={styles.video__window}
                    key={index}
                    ref={item => {
                      item.srcObject = elem.src;
                      item.muted = elem.muted;
                      item.autoplay = elem.autoplay;
                    }}
                    src={elem.src}
                    autoPlay={true}/>
              })
              : null
          }
        </div>
      </div>
  )
};

export default Video;