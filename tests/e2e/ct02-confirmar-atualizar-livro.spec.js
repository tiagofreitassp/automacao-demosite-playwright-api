const { test } = require('@playwright/test');
const { BookStorePage } = require('../page/BookStorePage');
const { AccountPage } = require('../page/AccountPage');

import { readDataFromExcelFile, writeTestResultToExcel } from '../support/utils/CarregarPlanilha';

require('dotenv').config()

const ExcelDataProvider = readDataFromExcelFile(process.env.CENARIOS, 1)

let bookStorePage;
let accountPage;
var num = 0;

for (const lineFromExcel of ExcelDataProvider) {
    if(lineFromExcel.EXECUTE.toLowerCase() == 'sim'){
        const testId = lineFromExcel.ID;

        test(`${lineFromExcel.ID} - ${lineFromExcel.CENARIO} ${num++}`, 
            {
                tag: [
                    '@api',
                    '@ct02'
                ],
            }, async ({ request }) => {

            try {
                accountPage = new AccountPage(request);
                bookStorePage = new BookStorePage(request);

                //Realizar cadastro e autenticação do usuário
                await accountPage.account(lineFromExcel.USERNAME, lineFromExcel.PASSWORD);

                //Adicionar o livro à coleção do usuário
                await bookStorePage.adicionarLivroColecao(lineFromExcel.ISBN);

                //Consultar se livro esta na coleção
                await bookStorePage.consultarLivro(
                    lineFromExcel.ISBN, 
                    lineFromExcel.TITLE, 
                    lineFromExcel.SUBTITLE,
                    lineFromExcel.AUTHOR, 
                    lineFromExcel.PUBLISHER,
                    lineFromExcel.PAGES,
                    lineFromExcel.DESCRIPTION,
                    lineFromExcel.WEBSITE);

                //Atualizar o livro na coleção do usuário
                await bookStorePage.atualizarLivro(lineFromExcel.ISBN,lineFromExcel.NEW_ISBN);

                //Consultar se livro esta na coleção
                await bookStorePage.consultarLivro(
                    lineFromExcel.NEW_ISBN, 
                    lineFromExcel.NEW_TITLE, 
                    lineFromExcel.NEW_SUBTITLE,
                    lineFromExcel.NEW_AUTHOR, 
                    lineFromExcel.NEW_PUBLISHER,
                    lineFromExcel.NEW_PAGES,
                    lineFromExcel.NEW_DESCRIPTION,
                    lineFromExcel.NEW_WEBSITE);

                //Excluir os livros da coleção do usuário
                await bookStorePage.removerTodosOsLivros();

                await accountPage.excluirCadastro();
                //Se não ocorrer erro, registrar que o teste passou escrevendo Pass
                //await writeTestResultToExcel(process.env.CENARIOS, 1, 'ID', testId, 'Pass', '');
            } catch (err) {
                await accountPage.excluirCadastro();

                const errorText = err instanceof Error && err.message ? err.message : String(err);
                // Em caso de erro -> marcar Fail e gravar ERRO
                //await writeTestResultToExcel(process.env.CENARIOS, 1, 'ID', testId, 'Fail', errorText);
                throw err; // rethrow para Playwright marcar o teste como failed
            }
        });
    }
}