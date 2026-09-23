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
        //
    }
}