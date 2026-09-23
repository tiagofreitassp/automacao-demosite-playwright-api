import { AccountPage } from './AccountPage';

const { expect } = require('@playwright/test');
const { BasePage } = require('../support/base/BasePage')

require('dotenv').config()
let base;

export class BookStorePage extends AccountPage{
  constructor(request) {
    super(request);
    this.request=request;
    base = new BasePage(this.request);
  }

  /* Requisições relacionadas aos livros */

  async consultarTodosOsLivros(){}

  async adicionarLivroColecao(isbn){}

  async removerTodosOsLivros(userId){}

  async consultarLivro(isbn){}

  async removerLivro(userId, isbn){}

  async atualizarLivro(userId,isbn){}
}