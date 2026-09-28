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
    const valorISBN = String(isbn); 
    const url = `${process.env.BASE_URL}/BookStore/v1/Books`;
    const payload = { userId: SessionStore.getUserID(), collectionOfIsbns: [{ isbn: valorISBN }] };

    const response = await this.request.post(url, {
      data: JSON.stringify(payload),
      headers: { 
        'Content-Type': 'application/json', 
        'Accept': 'application/json', 
        'Authorization': `Bearer ${SessionStore.getApiToken()}`
       }
    });
    expect(response.status()).toBe(201);
    console.log(`Livro adicionado à coleção do usuário: ${JSON.stringify(payload)}`);
  }

  async removerTodosOsLivros(){
    const url = `${process.env.BASE_URL}/BookStore/v1/Books?${SessionStore.getUserID()}`;
    
    const response = await this.request.delete(url, {
      headers: { 
        'accept': 'application/json', 
        'Authorization': `Bearer ${SessionStore.getApiToken()}` 
      }
    });

    console.log('CRIAÇÃO - URL:', url);
    console.log('CRIAÇÃO - Status:', response.status());
    console.log('CRIAÇÃO - Headers:', response.headers());
    const text = await response.text().catch(()=>'<no-body>');
    console.log('CRIAÇÃO - Body:', text);

    expect(response.status()).toBe(204);
    console.log(`Todos os livros removidos da coleção do usuário: ${JSON.stringify(payload)}`);
  }

  async consultarLivro(isbn, title,subtitle,author,publisher,pages, description,website){
    const valorISBN = String(isbn);  
    const url = `${process.env.BASE_URL}/BookStore/v1/Book?ISBN=${valorISBN}`;
    const response = await this.request.get(url, {
      headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${SessionStore.getApiToken()}` }
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toBeTruthy();
    expect(body).toHaveProperty('isbn', valorISBN);
    expect(body).toHaveProperty('title', title);
    //expect(body).toHaveProperty('subTitle', subtitle);
    expect(body).toHaveProperty('author', author);
    expect(body).toHaveProperty('publisher', publisher);
    expect(body).toHaveProperty('pages', pages);
    expect(body).toHaveProperty('description', description);
    //expect(body).toHaveProperty('website', website);
    console.log(`Livro consultado: ${JSON.stringify(body)}`);
  }

  async removerLivro(isbn){
    const valorISBN = String(isbn); 
    const url = `${process.env.BASE_URL}/BookStore/v1/Book`;
    const payload = { isbn: valorISBN, userId: SessionStore.getUserID() };

    const response = await this.request.delete(url, {
      data: JSON.stringify(payload),
      headers: { 
        'Content-Type': 'application/json', 
        'Accept': 'application/json', 
        'Authorization': `Bearer ${SessionStore.getApiToken()}` 
      }
    });
    expect(response.status()).toBe(204);
    console.log(`Livro removido da coleção do usuário: ${JSON.stringify(payload)}`);
  }

  async atualizarLivro(oldISBN,newISBN){
    const valorOldISBN = String(oldISBN); 
    const valorNewISBN = String(newISBN); 
    const url = `${process.env.BASE_URL}/BookStore/v1/Books/${valorOldISBN}`;
    const payload = { userId: SessionStore.getUserID(), isbn: valorNewISBN  };

    const response = await this.request.put(url, {
      data: JSON.stringify(payload),
      headers: { 
        'Content-Type': 'application/json', 
        'accept': 'application/json', 
        'Authorization': `Bearer ${SessionStore.getApiToken()}` 
      }
    });

    expect(response.status()).toBe(200);
    console.log(`Livro atualizado na coleção do usuário: ${JSON.stringify(payload)}`);
  }
}