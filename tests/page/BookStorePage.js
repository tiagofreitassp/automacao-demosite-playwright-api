import { AccountPage } from './AccountPage';
const SessionStore = require('../support/base/SessionStore');
const { expect } = require('@playwright/test');

require('dotenv').config()

export class BookStorePage extends AccountPage{
  constructor(request) {
    super(request);
    this.request=request;
  }

  /* Requisições relacionadas aos livros */

  async consultarTodosOsLivros(){
    const url = `${process.env.BASE_URL}/BookStore/v1/Books`;
    const response = await this.request.get(url, {
      headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${SessionStore.getApiToken()}` }
    });
    return response;
  }

  async adicionarLivroColecao(isbn){
    const url = `${process.env.BASE_URL}/BookStore/v1/Books`;
    const payload = { userId: SessionStore.getUserID(), collectionOfIsbns: [{ isbn }] };

    const response = await this.request.post(url, {
      data: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json', 
        'Accept': 'application/json', 
        'Authorization': `Bearer ${SessionStore.getApiToken()}` }
    });
    expect(response.status()).toBe(201);
    console.log(`Livro adicionado à coleção do usuário: ${JSON.stringify(payload)}`);
  }

  async removerTodosOsLivros(userId){
    const url = `${process.env.BASE_URL}/BookStore/v1/Books`;
    const payload = { userId };

    const response = await this.request.delete(url, {
      data: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json', 
        'Accept': 'application/json', 
        'Authorization': `Bearer ${SessionStore.getApiToken()}` }
    });
    expect(response.status()).toBe(200);
    console.log(`Todos os livros removidos da coleção do usuário: ${JSON.stringify(payload)}`);
  }

  async consultarLivro(isbn, title,subtitle,author,publisher,total_pages, description,website){
    const url = `${process.env.BASE_URL}/BookStore/v1/Book?ISBN=${isbn}`;
    const response = await this.request.get(url, {
      headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${SessionStore.getApiToken()}` }
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toBeTruthy();
    expect(body).toHaveProperty('isbn', isbn);
    expect(body).toHaveProperty('title', title);
    expect(body).toHaveProperty('subtitle', subtitle);
    expect(body).toHaveProperty('author', author);
    expect(body).toHaveProperty('publisher', publisher);
    expect(body).toHaveProperty('total_pages', total_pages);
    expect(body).toHaveProperty('description', description);
    expect(body).toHaveProperty('website', website);
    console.log(`Livro consultado: ${JSON.stringify(body)}`);
  }

  async removerLivro(userId, isbn){
    const url = `${process.env.BASE_URL}/BookStore/v1/Books`;
    const payload = { userId, collectionOfIsbns: [{ isbn }] };

    const response = await this.request.delete(url, {
      data: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json', 
        'Accept': 'application/json', 
        'Authorization': `Bearer ${SessionStore.getApiToken()}` }
    });
    expect(response.status()).toBe(200);
    console.log(`Livro removido da coleção do usuário: ${JSON.stringify(payload)}`);
  }

  async atualizarLivro(userId,isbn){
    const url = `${process.env.BASE_URL}/BookStore/v1/Books`;
    const payload = { userId, collectionOfIsbns: [{ isbn }] };

    const response = await this.request.put(url, {
      data: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json', 
        'Accept': 'application/json', 
        'Authorization': `Bearer ${SessionStore.getApiToken()}` }
    });
    expect(response.status()).toBe(200);
    console.log(`Livro atualizado na coleção do usuário: ${JSON.stringify(payload)}`);
  }

  async consultarDadosDoLivro(isbn, title,subtitle,author,publisher,total_pages, description,website){
    // Chamada para obter todos os livros
    const response = await this.consultarTodosOsLivros();
    expect(response.status()).toBe(200);

    const body = await response.json();
    // Conforme a API do BookStore demo, os livros ficam em body.books
    expect(body).toBeTruthy();
    expect(Array.isArray(body.books)).toBe(true);

    // Valida estrutura de cada livro retornado
    for (const book of body.books) {
      expect(book).toHaveProperty('isbn');
      expect(book).toHaveProperty('title');
      expect(book).toHaveProperty('subtitle');
      expect(book).toHaveProperty('author');
      expect(book).toHaveProperty('publisher');
      expect(book).toHaveProperty('total_pages');
      expect(book).toHaveProperty('description');
      expect(book).toHaveProperty('website');

      expect(typeof book.isbn).toBe('string');
      expect(typeof book.title).toBe('string');
      expect(typeof book.subtitle).toBe('string');
      expect(typeof book.author).toBe('string');
      expect(typeof book.publisher).toBe('string');
      expect(typeof book.total_pages).toBe('number');
      expect(typeof book.description).toBe('string');
      expect(typeof book.website).toBe('string');
    }

    // Validação de conteúdo esperado: ajuste os valores abaixo conforme seu cenário
    const found = body.books.find(b => b.isbn === isbn);
    expect(found).toBeTruthy();
    expect(found.title).toBe(title);
    expect(found.subtitle).toBe(subtitle);
    expect(found.author).toBe(author);
    expect(found.publisher).toBe(publisher);
    expect(found.total_pages).toBe(total_pages);
    expect(found.description).toBe(description);
    expect(found.website).toBe(website);
    console.log(`Livro encontrado no banco de dados: ${JSON.stringify(found)}`);
  }
}