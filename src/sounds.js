const rightSound = '/src/sounds/right.wav';
const wrongSound = '/src/sounds/wrong.wav';

const ac = new (window.AudioContext || window.webkitAudioContext)();

if (ac.state == 'suspended') {
  ac.resume && ac.resume();
}

const createSource = (buffer) => {
  let source = ac.createBufferSource();
  source.buffer = buffer;
  ac.destination.disconnect();
  source.connect(ac.destination);
  source.start = source.start || source.noteGrainOn;
  return source;
};

const ajax = (url) => {
  let xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'arraybuffer';
  xhr.send();

  return new Promise((resolve, reject) => {
    xhr.onload = () => resolve(xhr.response);
    xhr.onerror = () => reject(xhr.statusText);
  });
};

let rightBuffer, wrongBuffer;
ajax(rightSound)
  .then((data) => ac.decodeAudioData(data))
  .then((buffer) => rightBuffer = buffer);

ajax(wrongSound)
  .then((data) => ac.decodeAudioData(data))
  .then((buffer) => wrongBuffer = buffer);

export default {
  playRight: () => createSource(rightBuffer).start(),
  playWrong: () => createSource(wrongBuffer).start()
};
