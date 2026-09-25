const { expect } = require('@playwright/test');

require('dotenv').config()

let apiToken, userID;

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
      apiToken = responseBody.token;
    }
  
    async consultaConta(){
      const url = `${process.env.BASE_URL}/Account/v1/User/${userID}`;
      const response = await this.request.get(url, {
        headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${apiToken}` }
      });

      expect(response.status()).toBe(200);

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
    userID = body?.userID ?? body?.userId ?? userID;
    console.log(`Conta criada com userID: ${userID} do usuário: ${username} e senha: ${password}`);
  }
  
  async excluirCadastro(){
    const exists = await this.usuarioExistePorId(userID);

    if (exists.status() === 200){
      const delResp = await this.excluirCadastroPorId(userID, apiToken);
      const delStatus = delResp.status();
      expect([200, 204]).toContain(delStatus);
    }

    const afterResp = await this.request.get(`${process.env.BASE_URL}/Account/v1/User/${userID}`, {
      headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${apiToken}` }
    });
    expect(afterResp.status()).not.toBe(200);
  }

  async usuarioExistePorId(userID){
    const url = `${process.env.BASE_URL}/Account/v1/User/${userID}`;
    const response = await this.request.get(url, { headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${apiToken}` } });
    return response;
  }

  async excluirCadastroPorId(userID){
    const url = `${process.env.BASE_URL}/Account/v1/User/${userID}`;
    const response = await this.request.delete(url, {
      headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${apiToken}` }
    });
    return response;
  }
}