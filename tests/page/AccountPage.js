const { expect } = require('@playwright/test');

require('dotenv').config()

export class AccountPage{
  //Variáveis privadas que não podem ser acessadas fora da classe
  #apiToken;
  #userID;

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

      const text = await response.text();

      expect(response.status()).toBe(200);

      try {
          const json = JSON.parse(text);
          if (typeof json === 'boolean') {
            expect(json).toBe(true);
          } else if (json && (json === true || json.success === true || json.ok === true)) {
            expect(true).toBe(true);
          } else {
            expect(JSON.stringify(json)).toContain('true');
          }
        } catch {
            expect(text).toContain('true');
        }
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
      this.#apiToken = responseBody.token;
    }
  
    async consultaConta(){
      console.log('Método para consultar conta com userID:', this.#userID);

      //Método sempre deve retornar o cadastro, se nao existir, deve lançar erro
    }

    async criarConta(username, password){
      console.log('Método para criar conta com username e senha:', username, password);

      //Verificar se a conta já existe antes de criar uma nova. Se sim, exclui-la e criar uma nova.
    }
  
    async excluirConta(){
      console.log('Método para excluir conta com userID:', this.#userID);

      //Verificar se a conta existe, se sim exclui-la, se não, não fazer nada.
    }
}