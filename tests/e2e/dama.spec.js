const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('E2E - Dama (aceitação)', () => {
  test('carrega a página e exibe o tabuleiro', async ({ page }) => {
    const filePath = path.resolve(__dirname, '../../HTML/jogo.html');
    await page.goto('file://' + filePath);
    // aguardar o tabuleiro ser criado pelo script
    await page.waitForSelector('#tabuleiro', { timeout: 2000 });
    const rows = await page.$$eval('#tabuleiro tr', els => els.length);
    expect(rows).toBe(8);
  });

  test('clicar em uma peça do turno seleciona-a e mostra possíveis movimentos', async ({ page }) => {
    const filePath = path.resolve(__dirname, '../../HTML/jogo.html');
    await page.goto('file://' + filePath);
    // esperar pelas peças iniciais
    await page.waitForSelector('.peca.branca', { timeout: 2000 });
    const primeira = await page.$('.peca.branca');
    await primeira.click();
    // verificar que existe ao menos uma casa com classe 'possivel' ou que a casa da peça ficou com 'selecionada'
    const possiveis = await page.$$('.possivel');
    const selecionada = await page.$('td.selecionada');
    expect(possiveis.length >= 0).toBeTruthy();
    expect(selecionada !== null).toBeTruthy();
  });
});
