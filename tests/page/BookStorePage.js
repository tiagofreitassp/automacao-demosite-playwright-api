import { AccountPage } from './AccountPage';

const { expect } = require('@playwright/test');

require('dotenv').config()

export class BookStorePage extends AccountPage{
  constructor(request) {
    super(request);
    this.request=request;
  }

  /* Requisições relacionadas aos livros */

  async consultarTodosOsLivros(){}

  async adicionarLivroColecao(isbn){}

  async removerTodosOsLivros(userId){}

  async consultarLivro(isbn){}

  async removerLivro(userId, isbn){}

  async atualizarLivro(userId,isbn){}
}