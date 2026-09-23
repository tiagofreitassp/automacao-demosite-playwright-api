require('dotenv').config()

export class BasePage{
  constructor(request) {
    this.request = request;
  }
}