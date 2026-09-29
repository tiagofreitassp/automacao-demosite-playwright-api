class SessionStore {
  static apiToken = null;
  static userID = null;
  static username = null;
  static password = null;

  static setApiToken(token) { this.apiToken = token; }
  static getApiToken() { return this.apiToken; }

  static setUserID(id) { this.userID = id; }
  static getUserID() { return this.userID; }

  static setUsername(name) { this.username = name; }
  static getUsername() { return this.username; }
  
  static setPassword(pwd) { this.password = pwd; }
  static getPassword() { return this.password; }
}

module.exports = SessionStore;