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
                await accountPage.criarCadastro(lineFromExcel.USERNAME, lineFromExcel.PASSWORD);
                await accountPage.autorizacao(lineFromExcel.USERNAME, lineFromExcel.PASSWORD);
                await accountPage.gerarToken(lineFromExcel.USERNAME, lineFromExcel.PASSWORD);
                await accountPage.consultaConta();
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