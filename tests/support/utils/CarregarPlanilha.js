import * as fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';

const excelFolderPath = 'test-data' + path.sep;

/*
  Como ler dados de teste de um arquivo Excel em JavaScript (para usar no Playwright/Cypress/etc.)
  
  https://www.youtube.com/watch?v=XJB39OOnHj0

  https://github.com/ViacheslavBulba/playwright-page-object-example
*/

export function readDataFromExcelFile(dirName, tabNumber) {
  let fullPath = ''
  console.log("Diretório externo da Variável de Ambiente CENARIOS: ", dirName)

  if(typeof dirName != "undefined"){
    fullPath = dirName + path.sep + process.env.NOME_PLANILHA;

    if (!fs.existsSync(fullPath)) {
      throw new Error(`Não foi encontrado o diretório ou o arquivo ${fullPath} informadas
        na variável de ambiente CENARIOS. Verifique se o caminho ou nome do arquivo estão 
        corretos!`);
    }
  }else{
    fullPath = excelFolderPath + process.env.NOME_PLANILHA;

    if (!fs.existsSync(fullPath)) {
      throw new Error(`Não é possível encontrar o arquivo ${fullPath}. Verificar 
        se o caminho ou nome do arquivo estão corretos!`);
    }
  }

  console.log(`Lendo arquivo ${fullPath}`)

  const workbook = XLSX.readFile(fullPath);
  const dataFromFirstSheet = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[tabNumber]]);
  return dataFromFirstSheet;
}

export async function writeTestResultToExcel(dirName, tabNumber, matchColumnName, matchValue, status, errorText) {
  const baseFolder = typeof dirName !== 'undefined' ? dirName + pathMod.sep : excelFolderPath;
  const fullPath = baseFolder + process.env.NOME_PLANILHA;
  if (!fs.existsSync(fullPath)) throw new Error(`Arquivo não encontrado: ${fullPath}`);

  const lockPath = fullPath + '.lock';
  const wait = ms => new Promise(r => setTimeout(r, ms));
  let attempts = 0;
  while (fs.existsSync(lockPath) && attempts < 50) { await wait(100); attempts++; }
  try {
    fs.writeFileSync(lockPath, String(process.pid));

    const workbook = XLSX.readFile(fullPath);
    const sheetName = workbook.SheetNames[tabNumber];
    const sheet = workbook.Sheets[sheetName];

    const rowsHeader = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    const headers = rowsHeader[0] ? [...rowsHeader[0]] : [];

    const dataObjects = XLSX.utils.sheet_to_json(sheet);

    if (!headers.includes('STATUS')) headers.push('STATUS');
    if (!headers.includes('ERRO')) headers.push('ERRO');

    const idx = dataObjects.findIndex(r => String(r[matchColumnName]) === String(matchValue));

    if (idx >= 0) {
      dataObjects[idx]['STATUS'] = status;
      dataObjects[idx]['ERRO'] = errorText || '';
    } else {
      const newRow = { [matchColumnName]: matchValue, STATUS: status, ERRO: errorText || '' };
      dataObjects.push(newRow);
    }

    const newSheet = XLSX.utils.json_to_sheet(dataObjects, { header: headers });
    workbook.Sheets[sheetName] = newSheet;
    XLSX.writeFile(workbook, fullPath);
  } finally {
    try { fs.unlinkSync(lockPath); } catch (e) {}
  }
}