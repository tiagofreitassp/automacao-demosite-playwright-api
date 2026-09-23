
# automacao-demosite-playwright-api 🎭 Playwright

## Repositório do Git

https://github.com/tiagofreitassp/automacao-demosite-playwright-api

## Requisitos

Instalar os aplicativos obrigatórios:

* [Visual Studio Code](https://code.visualstudio.com/)
* [Nodejs](https://nodejs.org/pt)

Instalar as extensões no Visual Studio Code:

* [Playwright Test for VSCode](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright)
* [DotENV](https://marketplace.visualstudio.com/items?itemName=mikestead.dotenv)
* [VSCode Icons](https://marketplace.visualstudio.com/items?itemName=vscode-icons-team.vscode-icons)

As extensões abaixo não são obrigatórias, mas recomendadas para melhor experiência durante o desenvolvimento e execução.

* [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
* [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
* [Office Viewer(Markdown Editor)](https://marketplace.visualstudio.com/items?itemName=cweijan.vscode-office)
* [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
* [NPM Intellisense](https://marketplace.visualstudio.com/items?itemName=christian-kohler.npm-intellisense)
* [Path Intellisense](https://marketplace.visualstudio.com/items?itemName=christian-kohler.path-intellisense)
* [Material Icon Theme](https://marketplace.visualstudio.com/items?itemName=PKief.material-icon-theme)
* [XML Tools](https://marketplace.visualstudio.com/items?itemName=DotJoshJohnson.xml)
* [Extension Pack for Java](https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-java-pack)

## Instalação

Ao salvar o projeto localmente, antes de fazer a primeira execução, é necessário baixar as dependências do Node que devido ao tamanho da pasta, não vai para o repositório do Git.

Este procedimento só deve ser feito apenas quando for importar o projeto, não é necessário fazer quando atualizar o projeto com nova versão e usar o git pull. Só faça caso a pasta node_modules não estiver dentro do projeto.

Abra o terminal interno do Visual Studio Code ou do Sistema Operacional(vá até o diretório do projeto) e digite:

* npm install

## Massas

A planilha com as massas está dentro da pasta test-data.

Caso queira inserir mais casos de testes, copie uma linha inteira e cole na debaixo, altere as celulas de acordo com os dados de massas que desejar. Lembrando que não adicione colunas, pois a automação obtem os dados das colunas na ordem, caso seja alguma adicionada ou removida, irá afetar os testes. Solicitar a quem desenvolveu a automação para adequar a mudança.

Na primeira coluna, a Executar, você deve inserir Sim ou Nao(sem acentos) para quais testes deseja testar. Nunca deixe a esta coluna vazia, deixe Sim ou Nao.

## Execuções

Por padrão, o Playwright irá executar os testes em paralelo, para remover esta opção, abra o arquivo playwright.config.ts e na linha fullyParallel troque o TRUE para FALSE.

Executar todos os testes:

* npx playwright test

Executar um teste especifico:

* npx playwright test example.spec.js

## Execuções com falhas

Este projeto está configurado para executar cada teste que falhar em até 3 vezes. Para alterar o número de tentativas ou remover a opção de reprocessar, vá na classe playwright.config.js e mude o número em RETRIES.

Caso o RETRIES não estiver habilitado, voce pode inserir o --retries=3 com o número máximo de vezes que o Playwright deve executar se houver falha no teste.

Pelo Terminal, CMD ou Git Bash:

* npx playwright test --retries=3

## Execuções usando parâmetros com TAGs no CMD, Terminal ou Git Bash

Executar apenas os Casos de Testes referentes a 'ct01-preencher-formulario.spec.js':

* npx playwright test --grep @ct01
* npx playwright test --grep @regressivo
* npx playwright test --grep @form

Observações:
    1. O comando --grep é nativo do Playwright e deve ser informando antes da TAG.
    2. No final das execuções, para ver os resultados dos testes, vá na ./test-results/html/index.html.

## Informar diretório externo da planilha de cenários e massas

Caso não queira utilizar a planilha de Cenários e Massas padrão na pasta test-data/cenarios_e_massas.xlsx você pode informar outro caminho.
Para isso no terminal, cmd ou git bash, informe apenas o diretório na variavel de ambiente CENARIOS. Lembre-se que precisa ter as aspas, não informa-las, a automação dará erro.

* CENARIOS='C:\Users\P0661447\Downloads' npx playwright test ct01-recalcular-orcamento-premio.spec.js --headed
* CENARIOS='C:\Users\P0661447\Downloads' npx playwright test ct02-criar-orcamento-premio.spec.js --headed

Observação: O nome e formato da planilha não pode ser diferente de cenarios_e_massas.xlsx

## Relatório de Resultado dos Testes

Para gerar o relatório com os resultados os testes. Execute o comando abaixo:

* npx playwright show-report

Ou vá na pasta automacao-demosite-playwright-web/playwright-report e abra no navegador o arquivo index.html

## Evidências

O projeto está configurado para gerar as evidências por Screenshot e por Vídeo. Elas podem ser visualizadas de três maneiras:

1. Os Screenshots são salvos na pasta ./test-results
2. Os Vídeos são salvos dentro da pasta DATA em ./playwright-report
3. Ao abrir o Relatório de Resultado dos Testes, ao clicar em um cenário, abaixo dos passos, as imagens e os vídeos são exibidos, facilitando a analise dos testes executados.
4. Os vídeos são salvos no formato padrão Webm. Para visualiza-los, eles estão no final da página do relatório do resultado de testes, não é necessario instalar outro reprodutor de vídeo. Apesar deste formato não ser um dos padrões do Windows Média Player, é possivel executa-lo no mesmo. Abra o WMP, Arquivo > Abrir e selecione o vídeo, o WMP irá perguntar se deseja mesmo reproduzir, e clique em Sim. Caso a versão do WMP não deixe executar os vídeos de evidencias. Verique se a Porto Seguro tem outro reprodutor homologado para uso.

## Importar projeto

1. Baixe o arquivo zipado ou pelo git e salve-o localmente.
2. Abra o projeto pelo Visual Studio Code.
3. Com o terminal aberto, digite npm install para instalar as dependencias que são salvas na pasta node_modules.
4. Para executar, use o terminal interno do VSC ou o do terminal/cmd do Sistema Operacional. O projeto por usar o terminal/cmd, git bash ou o power shell.

## Documentações indicadas

* [Documentação Playwright](https://playwright.dev/docs/intro)
* [API referencia](https://playwright.dev/docs/api/class-playwright)
