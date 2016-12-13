const sounds = {
  right: '/src/sounds/right.wav',
  wrong: '/src/sounds/wrong.wav',
  tada:  '/src/sounds/tada.wav'
};

const ac = new (window.AudioContext || window.webkitAudioContext)();

if (ac.state == 'suspended') {
  ac.resume && ac.resume();
}

const createSource = (buffer) => {
  let source = ac.createBufferSource();
  source.buffer = buffer;
  source.connect(ac.destination);
  source.start = source.start || source.noteGrainOn;
  return source;
};

const decode = (data) => {
  return new Promise((resolve, reject) => {
    ac.decodeAudioData(data, resolve, reject)
  });
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

const playBuffer = (buffer) => {
  setTimeout(() => {
    createSource(buffer).start()
  }, 0);
};

let buffers = Object.keys(sounds).reduce((acc, key) => {
  ajax(sounds[key])
    .then(decode)
    .then((buffer) => acc[key] = buffer);
  return acc;
}, {});

export default {
  playRight: () => playBuffer(buffers.right),
  playWrong: () => playBuffer(buffers.wrong),
  playTada:  () => playBuffer(buffers.tada)
};
