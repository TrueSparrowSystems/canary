class CookieManager {
  constructor() {
    this.cookie = [];
  }

  setCookie(cookie) {
    this.cookie = cookie || [];
  }

  getMPTS() {
    for (let i = 0; i < this.cookie.length; i++) {
      let cookieString = this.cookie[i];
      if (cookieString) {
        let regexData = cookieString.match(/mpts=[a-z0-9-]*/gi) || [];
        if (regexData.length > 0) {
          const splitData = regexData[0].split('=');
          if (splitData.length === 2) {
            return splitData[1];
          }
        }
      }
    }

    return null;
  }
}

export default new CookieManager();
