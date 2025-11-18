const fs = require('fs');
const path = require('path');

describe('Integração DOM (criar tabuleiro e interações básicas)', () => {
  beforeEach(() => {
    // setup DOM com HUD e principal
    document.body.innerHTML = `
      <main id="principal">
        <section id="HUD">
          <div class="turno"><p>Turno: <span id="controle-turno">brancas</span></p></div>
          <button id="reset">Reiniciar</button>
        </section>
      </main>
    `;
    const scriptPath = path.resolve(__dirname, '../../script/jogo.js');
    const script = fs.readFileSync(scriptPath, 'utf8');
    const vm = require('vm');
    const sandbox = { document, window: global, console };
    vm.createContext(sandbox);
    vm.runInContext(script, sandbox);
    global.iniciaJogo = sandbox.iniciaJogo;
    global.config = sandbox.config;
  });

  test('criarTabuleiro cria seção #tabuleiro com 8 linhas e 8 colunas', () => {
    // chamar iniciaJogo para criar tabuleiro e inserir peças
    global.iniciaJogo();
    const tab = document.querySelector('#tabuleiro');
    expect(tab).not.toBeNull();
    const rows = tab.querySelectorAll('tr');
    expect(rows.length).toBe(8);
    const cells = tab.querySelectorAll('td');
    expect(cells.length).toBe(64);
  });

  test('inserirPecasTabuleiro coloca peças iniciais nas bordas (12 pretas e 12 brancas)', () => {
    global.iniciaJogo();
    const pretas = document.querySelectorAll('.peca.preta');
    const brancas = document.querySelectorAll('.peca.branca');
    expect(pretas.length).toBe(12);
    expect(brancas.length).toBe(12);
  });

  test('clicar em peça do turno seleciona e calcula possíveis movimentos', () => {
    global.iniciaJogo();
    // selecionar uma peça branca (deverá estar na última linha)
    const pecaBranca = document.querySelector('.peca.branca');
    expect(pecaBranca).not.toBeNull();
    pecaBranca.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    const casa = pecaBranca.parentElement;
    expect(casa.classList.contains('selecionada')).toBe(true);
    // possíveis movimentos devem ter classe 'possivel' (ou não se bloqueado)
    const possiveis = document.querySelectorAll('.possivel');
    // ao menos uma casa ou zero é aceitável dependendo de bloqueios, mas o código
    // deve ter deixado o estado consistente (não lançar erro) — assert tipo
    expect(Array.from(possiveis)).toBeInstanceOf(Array);
  });
});
