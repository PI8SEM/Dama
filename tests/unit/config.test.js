const fs = require('fs');
const path = require('path');
const vm = require('vm');

describe('Config e utilitários básicos (unit)', () => {
  beforeEach(() => {
    // montar DOM mínimo necessário
    document.body.innerHTML = '<main id="principal"></main><span id="controle-turno">brancas</span>';
    const scriptPath = path.resolve(__dirname, '../../script/jogo.js');
    const script = fs.readFileSync(scriptPath, 'utf8');
    // executar o script em um sandbox para expor suas funções
    const sandbox = { document, window: global, console };
    vm.createContext(sandbox);
    vm.runInContext(script, sandbox);
    // mapear referências importantes para o global do teste
    global.config = sandbox.config;
    global.iniciaJogo = sandbox.iniciaJogo;
  });

  test('config.alternarTurno alterna turno e atualiza #controle-turno', () => {
    expect(global.config.turno).toBe('brancas');
    global.config.alternarTurno();
    expect(global.config.turno).toBe('pretas');
    expect(document.getElementById('controle-turno').textContent).toBe('pretas');
    // volta
    global.config.alternarTurno();
    expect(global.config.turno).toBe('brancas');
  });

  test('pecaPreta e pecaBranca produzem elementos com atributos esperados', () => {
    const pPreta = global.config.pecaPreta();
    expect(pPreta).toBeInstanceOf(HTMLElement);
    expect(pPreta.classList.contains('peca')).toBe(true);
    expect(pPreta.classList.contains('preta')).toBe(true);
    expect(pPreta.dataset.identificador).toBe('pretas');
    expect(pPreta.dataset.tipo).toBe('peao');

    const pBranca = global.config.pecaBranca();
    expect(pBranca.classList.contains('peca')).toBe(true);
    expect(pBranca.classList.contains('branca')).toBe(true);
    expect(pBranca.dataset.identificador).toBe('brancas');
  });
});
