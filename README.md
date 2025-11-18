# Dama - Engenharia de Software II

Integrantes: 

André Luiz Veras Fernandes

Hian Araujo Damaceno

Henrique Souza Uchida 

Victor Hugo Amaral Silva

##Como rodar os testes (passo-a-passo):

1. Pré-requisitos
- Ter o Node.js e npm instalados (versão compatível com o projeto).
- Conexão com a internet para instalar dependências e, se necessário, baixar navegadores para o Playwright.

2. Instalar dependências do projeto
```bash
npm ci
```

3. Executar os testes unitários (Jest)
```bash
npm run test:unit
```

4. Executar os testes de integração (Jest)
```bash
npm run test:integration
```

5. Executar os testes de sistema / aceitação (Playwright)
- Se ainda não instalou os navegadores do Playwright, execute uma vez:
```bash
npx playwright install --with-deps
```
- Em seguida rode os testes E2E:
```bash
npx playwright test tests/e2e
```

6. Executar toda a suíte de testes (opcional)
```bash
npm run test
```

Notas e dicas
- Se você adicionou `@playwright/test` recentemente, rode `npm i` para instalar as dependências locais.
- Em ambientes sem interface gráfica (ex.: CI), o Playwright usa navegadores em modo headless; `--with-deps` instala dependências do sistema necessárias.
- Para rodar somente os testes E2E via npm, você pode usar (opcional) um script no `package.json`: `"test:e2e": "npx playwright test tests/e2e"`.


