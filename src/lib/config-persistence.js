const { localStorage } = window;

export default class ConfigPersistence {
  constructor(key) {
    this.key = key;
  }

  save(config) {
    localStorage.setItem(this.key, JSON.stringify(config));
  }

  load() {
    try {
      const value = localStorage.getItem(this.key);
      return JSON.parse(value);
    } catch (err) {
      /* eslint-disable */
      console.error('Could not load previous config', err);
      /* eslint-enable */
    }
    return null;
  }

  isSet() {
    return !!localStorage.getItem(this.key);
  }
}
