const sounds = {
  right: '/src/assets/sounds/right.wav',
  wrong: '/src/assets/sounds/wrong.wav',
  tada:  '/src/assets/sounds/tada.wav'
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
    ac.decodeAudioData(data, resolve, reject);
  });
};

const download = (url) => {
  return fetch(url)
    .then(response => response.arrayBuffer());
};

const playBuffer = (buffer) => {
  setTimeout(() => {
    createSource(buffer).start()
  }, 4);
};

const buffers = {};
Object.keys(sounds).forEach(key => {
  download(sounds[key])
    .then(decode)
    .then(buf => buffers[key] = buf);
});

export default {
  playRight: () => playBuffer(buffers.right),
  playWrong: () => playBuffer(buffers.wrong),
  playTada:  () => playBuffer(buffers.tada)
};
