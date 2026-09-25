class SessionStore {
  static apiToken = null;
  static userID = null;

  static setApiToken(token) { this.apiToken = token; }
  static getApiToken() { return this.apiToken; }

  static setUserID(id) { this.userID = id; }
  static getUserID() { return this.userID; }
}

module.exports = SessionStore;