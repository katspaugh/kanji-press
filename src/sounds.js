const play = (url) => {
  let audio = new Audio(url);
  audio.play();
};

export default {
  playRight: () => play('/src/sounds/right.wav'),
  playWrong: () => play('/src/sounds/wrong.wav')
};
