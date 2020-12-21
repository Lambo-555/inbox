// sound library
const library = {
  action: '/sounds/action.mp3',
  message: '/sounds/message.mp3',
};

// create a random valuers for sound modification
const randomVal = (min, max) => {
  return Math.round(min - 0.5 + Math.random() * (max - min + 1))
};

const SoundFX = (soundName) => {
  if (localStorage.getItem('mute') === 'mute') return;
  if (library[soundName]) {
    // var sound is property of window and cat be cleaned
    var sound = new Audio(library[soundName]);
    sound.volume = 0.35;
    // add some variants of same sound
    sound.playbackRate = randomVal(50, 200) / 100;
    const duration = sound.duration;
    sound.play();
    // remove sound after use
    setTimeout(() => {
      sound.remove();
    }, duration);
  } else {
    console.log(`sound effect '${soundName}' not found`);
  }
};

export default SoundFX;