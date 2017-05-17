const rnd = (n) => {
  return Math.floor(Math.random() * n);
};

export function randomItem(arr) {
  return arr[rnd(arr.length)];
};

export function shuffle(arr) {
  const len = arr.length;
  for (let i = len - 1; i >= 0; i--) {
    let j = rnd(len);
    [ arr[i], arr[j] ] = [ arr[j], arr[i] ];
  }
  return arr;
};

export function randomColor() {
  return `hsl(${ rnd(255) }, ${ 30 + rnd(20) }%, ${ 60 + rnd(20) }%)`;
}
