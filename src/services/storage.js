const localStorage = window.localStorage;

export default class Storage {
  constructor(key) {
    this.key = key;
  }

  get() {
    const data = localStorage.getItem(this.key);
    return JSON.parse(data);
  };

  set(data) {
    localStorage.setItem(this.key, JSON.stringify(data));
  }
};
