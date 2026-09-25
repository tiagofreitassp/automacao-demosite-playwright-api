const { expect } = require('@playwright/test');
const SessionStore = require('../support/base/SessionStore');

require('dotenv').config()

export class AccountPage{
  constructor(request) {
    this.request=request;
  } 

  /* Requisições relacionadas à conta de usuário, autenticação e token */
  
  async autorizacao(username, password){
    const url = process.env.BASE_URL + '/Account/v1/Authorized';
    const payload = { userName: username, password: password };

    const response = await this.request.post(url, {
      data: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    });
    expect(response.status()).toBe(200);
    console.log(`Autorização bem-sucedida para o usuário: ${username}`);
  }
  
  async gerarToken(username, password){
    const url = process.env.BASE_URL + '/Account/v1/GenerateToken';
    const payload = { userName: username, password: password };

    const response = await this.request.post(url, {
      data: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    });
      
    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    expect(responseBody).toBeTruthy();
    expect(responseBody).toHaveProperty('token');
    expect(responseBody).toHaveProperty('expires');
    expect(responseBody).toHaveProperty('status');
    expect(responseBody).toHaveProperty('result');
    SessionStore.setApiToken(responseBody.token);
    console.log(`Token gerado com sucesso para o usuário: ${username}`);
    console.log(`Token gerado: ${SessionStore.getApiToken()}`);
  }
  
  async consultaConta(){
    const url = `${process.env.BASE_URL}/Account/v1/User/${SessionStore.getUserID()}`;
    const response = await this.request.get(url, {
      headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${SessionStore.getApiToken()}` }
    });

    expect(response.status()).toBe(200);
    console.log(`Consulta do cadastro realizada para o userID: ${SessionStore.getUserID()}`);

    const body = await response.json();
    const books = body.books;
    expect(body).toBeTruthy();
    expect(body).toHaveProperty('userId');
    expect(body).toHaveProperty('username');
    expect(Array.isArray(books)).toBe(true);
  }

  async criarCadastro(username, password){
    const url = `${process.env.BASE_URL}/Account/v1/User`;
    const payload = { userName: username, password: password };

    const response = await this.request.post(url, {
      data: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    });

    expect([200, 201]).toContain(response.status());
    const body = await response.json().catch(()=>null);
    SessionStore.setUserID(body?.userID ?? body?.userId ?? SessionStore.getUserID());
    console.log(`Conta criada com o userID: ${SessionStore.getUserID()} do usuário: ${username}`);
  }
  
  async excluirCadastro(){
    const exists = await this.usuarioExistePorId(SessionStore.getUserID());

    if (exists.status() === 200){
      const delResp = await this.excluirCadastroPorId(SessionStore.getUserID());
      const delStatus = delResp.status();
      expect([200, 204]).toContain(delStatus);
    }

    const afterResp = await this.request.get(`${process.env.BASE_URL}/Account/v1/User/${SessionStore.getUserID()}`, {
      headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${SessionStore.getApiToken()}` }
    });
    expect(afterResp.status()).not.toBe(200);
    console.log(`Cadastro com o userID: ${SessionStore.getUserID()} foi excluída.`);
  }

  async usuarioExistePorId(userID){
    const url = `${process.env.BASE_URL}/Account/v1/User/${userID}`;
    const response = await this.request.get(url, { 
      headers: { 'Accept': 'application/json', 
        'Authorization': `Bearer ${SessionStore.getApiToken()}` } });
    return response;
  }

  async excluirCadastroPorId(userID){
    const url = `${process.env.BASE_URL}/Account/v1/User/${userID}`;
    const response = await this.request.delete(url, {
      headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${SessionStore.getApiToken()}` }
    });
    return response;
  }
}