const { localStorage } = window;

export default class ConfigPersistence {
  key: string;

  constructor(key: string) {
    this.key = key;
  }

  save<T extends object>(config: T) {
    localStorage.setItem(this.key, JSON.stringify(config));
  }

  load<T>(): T | null {
    try {
      const value = localStorage.getItem(this.key);
      if (value) return JSON.parse(value);
      else return null;
    } catch (err) {
      /* eslint-disable */
      console.error("Could not load previous config", err);
      /* eslint-enable */
    }
    return null;
  }

  isSet(): Boolean {
    return Boolean(localStorage.getItem(this.key));
  }
}
