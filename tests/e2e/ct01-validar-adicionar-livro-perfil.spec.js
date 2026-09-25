const { test, expect } = require('@playwright/test');
const { BookStorePage } = require('../page/BookStorePage');
const { AccountPage } = require('../page/AccountPage');

import { readDataFromExcelFile, writeTestResultToExcel } from '../support/utils/CarregarPlanilha';

require('dotenv').config()

const ExcelDataProvider = readDataFromExcelFile(process.env.CENARIOS, 0)

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
                    '@ct01'
                ],
            }, async ({ request }) => {

            try {
                accountPage = new AccountPage(request);
                bookStorePage = new BookStorePage(request);

                //Realizar cadastro e autenticação do usuário
                await accountPage.account(lineFromExcel.USERNAME, lineFromExcel.PASSWORD);

                //Verificar se o livro está presente no banco de dados antes de adicioná-lo à coleção do usuário
                await bookStorePage.consultarDadosDoLivro(
                    lineFromExcel.ISBN, 
                    lineFromExcel.TITLE, 
                    lineFromExcel.SUBTITLE,
                    lineFromExcel.AUTHOR, 
                    lineFromExcel.PUBLISHER,
                    lineFromExcel.TOTAL_PAGES,
                    lineFromExcel.DESCRIPTION,
                    lineFromExcel.WEBSITE);

                //Adicionar o livro à coleção do usuário
                await bookStorePage.adicionarLivroColecao(lineFromExcel.ISBN);

                //Consultar se livro esta na coleção
                await bookStorePage.consultarLivro(
                    lineFromExcel.ISBN, 
                    lineFromExcel.TITLE, 
                    lineFromExcel.SUBTITLE,
                    lineFromExcel.AUTHOR, 
                    lineFromExcel.PUBLISHER,
                    lineFromExcel.TOTAL_PAGES,
                    lineFromExcel.DESCRIPTION,
                    lineFromExcel.WEBSITE);

                //Excluir livro da coleção do usuário
                await bookStorePage.removerLivro(lineFromExcel.USERNAME, lineFromExcel.ISBN);

                await accountPage.excluirCadastro();
                // Sem erro -> marcar Pass
                //await writeTestResultToExcel(process.env.CENARIOS, 0, 'ID', testId, 'Pass', '');
            } catch (err) {
                await accountPage.excluirCadastro();

                const errorText = err instanceof Error && err.message ? err.message : String(err);
                // Em caso de erro -> marcar Fail e gravar ERRO
                //await writeTestResultToExcel(process.env.CENARIOS, 0, 'ID', testId, 'Fail', errorText);
                throw err; // rethrow para Playwright marcar o teste como failed
            }
        });
    }
}