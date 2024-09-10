class localCache {
  setCache(key: string, value: any) {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
  getCache(key: string) {
    const value = window.localStorage.getItem(key);
    if (value) return JSON.parse(value);
  }
  deleteCache(key: string) {
    window.localStorage.removeItem(key);
  }
  setSession(key: string, value: any) {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  }
  getSession(key: string) {
    const value = window.sessionStorage.getItem(key);
    if (value) return JSON.parse(value);
  }
  deleteSession(key: string) {
    window.sessionStorage.removeItem(key);
  }
}

export default new localCache();
