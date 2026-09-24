const { expect } = require('@playwright/test');

require('dotenv').config()
let apiToken, userID;

export class AccountPage{
  constructor(request) {
    this.request=request;
  } 

  /* Requisições relacionadas à conta de usuário, autenticação e token */
  
    async autorizacao(username, password){
      const response = await this.request.post(process.env.BASE_URL + '/Account/v1/Authorized', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        data: {
          userName: username,
          password: password
        }
      });
  
      return response;
    }

    async obterAutorizacao(username, password){
      const retorno = await this.autorizacao(username, password);
      console.log('Resposta da autorização:', retorno);
      expect(retorno.status()).toBe(111);
      const data = await retorno.json();
      expect(data).toBe(true);
    }
  
    async gerarToken(username, password){
      const response = await this.request.post(process.env.BASE_URL + '/Account/v1/GenerateToken', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        data: {
          userName: username,
          password: password
        }
      });
  
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data).toHaveProperty('token');
      expect(data.status).toBe('Success');
      expect(data.result).toBe('User authorized successfully.');
      apiToken = data.token;
      return apiToken;
    }
  
    async criarConta(username, password){
      const response = await this.request.post(process.env.BASE_URL + '/Account/v1/User', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        data: {
          userName: username,
          password: password
        }
      });
  
      expect(response.status()).toBe(201);
      const data = await response.json();
      expect(data).toHaveProperty('userID');
      expect(data).toHaveProperty('username');
      expect(data).toHaveProperty('books');
      userID = data.userID;
      expect(data.username).toBe(username);
      return userID;
    }
  
    async excluirConta(userID){
      const response = await this.request.delete(process.env.BASE_URL + `/Account/v1/User/${userID}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiToken}`
        }
      });
  
      expect(response.status()).toBe(200);
    }
  
    async consultaConta(userID){
      const response = await this.request.get(process.env.BASE_URL + `/Account/v1/User/${userID}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiToken}`
        }
      });
  
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data).toHaveProperty('userID');
      expect(data).toHaveProperty('username');
      expect(data).toHaveProperty('books');
    }
}