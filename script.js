document.addEventListener('DOMContentLoaded', iniciarJogo);

// Elementos do DOM
const tabuleiroElemento = document.getElementById('tabuleiro');
const infoTurnoElemento = document.getElementById('info-turno');
const brancasCapturadasElemento = document.getElementById('brancas-capturadas');
const pretasCapturadasElemento = document.getElementById('pretas-capturadas');
const fimDeJogoElemento = document.getElementById('fim-de-jogo');
const fimDeJogoTextoElemento = document.getElementById('fim-de-jogo-texto');
const botaoReiniciar = document.getElementById('botao-reiniciar');

// Estado do Jogo
let tabuleiroLogico = [];
let turno = 'branca';
let pecaSelecionada = null; // { index, tipo, elemento, movimentosPossiveis }
let capturasObrigatorias = [];
let placar = { branca: 0, preta: 0 };
let jogoFinalizado = false;

// Constantes
const PEAO = 'peao';
const DAMA = 'dama';

/**
 * Função principal que inicia ou reinicia o jogo.
 */
function iniciarJogo() {
    criarTabuleiroLogico();
    renderizarTabuleiro();
    configurarEventListeners();
    placar = { branca: 0, preta: 0 };
    atualizarPlacar();
    jogoFinalizado = false;
    fimDeJogoElemento.classList.add('hidden');
    trocarTurno('branca');
}

/**
 * Cria a representação lógica do tabuleiro em um array de 64 posições.
 */
function criarTabuleiroLogico() {
    tabuleiroLogico = new Array(64).fill(null);
    for (let i = 0; i < 64; i++) {
        const linha = Math.floor(i / 8);
        const coluna = i % 8;
        const casaEscura = (linha + coluna) % 2 !== 0;

        if (casaEscura) {
            if (linha < 3) tabuleiroLogico[i] = { cor: 'preta', tipo: PEAO };
            if (linha > 4) tabuleiroLogico[i] = { cor: 'branca', tipo: PEAO };
        }
    }
}

/**
 * Desenha o tabuleiro e as peças na tela com base no tabuleiro lógico.
 */
function renderizarTabuleiro() {
    tabuleiroElemento.innerHTML = '';
    for (let i = 0; i < 64; i++) {
        const casa = document.createElement('div');
        const linha = Math.floor(i / 8);
        const coluna = i % 8;
        const casaClasse = (linha + coluna) % 2 === 0 ? 'casa-clara' : 'casa-escura';
        casa.className = `casa ${casaClasse}`;
        casa.dataset.index = i;

        const pecaLogica = tabuleiroLogico[i];
        if (pecaLogica) {
            const peca = document.createElement('div');
            peca.className = `peca ${pecaLogica.cor} ${pecaLogica.tipo}`;
            casa.appendChild(peca);
        }
        tabuleiroElemento.appendChild(casa);
    }
}

/**
 * Configura os listeners de clique no tabuleiro e no botão de reiniciar.
 */
function configurarEventListeners() {
    tabuleiroElemento.addEventListener('click', gerenciarClique);
    botaoReiniciar.addEventListener('click', iniciarJogo);
}

/**
 * Gerencia o evento de clique no tabuleiro.
 */
function gerenciarClique(evento) {
    if (jogoFinalizado) return;

    const casaClicada = evento.target.closest('.casa');
    if (!casaClicada) return;

    const indexClicado = parseInt(casaClicada.dataset.index);
    const pecaLogica = tabuleiroLogico[indexClicado];

    if (pecaSelecionada && pecaSelecionada.movimentosPossiveis.some(m => m.destino === indexClicado)) {
        const movimento = pecaSelecionada.movimentosPossiveis.find(m => m.destino === indexClicado);
        executarMovimento(pecaSelecionada.index, movimento);
        return;
    }

    desselecionarPeca();

    if (pecaLogica && pecaLogica.cor === turno) {
        selecionarPeca(indexClicado, casaClicada);
    }
}

/**
 * Seleciona uma peça, calcula e exibe seus movimentos possíveis.
 */
function selecionarPeca(index, elementoCasa, forcarSelecao = false) {
    if (!forcarSelecao && capturasObrigatorias.length > 0 && !capturasObrigatorias.some(c => c.origem === index)) {
        return;
    }

    let movimentosPossiveis = encontrarMovimentosValidos(index);
    
    if (capturasObrigatorias.length > 0 || forcarSelecao) {
        movimentosPossiveis = movimentosPossiveis.filter(m => m.captura);
    }

    if (movimentosPossiveis.length === 0) return;

    pecaSelecionada = {
        index,
        tipo: tabuleiroLogico[index].tipo,
        elemento: elementoCasa,
        movimentosPossiveis
    };

    elementoCasa.classList.add('selecionada');
    movimentosPossiveis.forEach(movimento => {
        const casaDestino = tabuleiroElemento.children[movimento.destino];
        casaDestino.classList.add(movimento.captura ? 'captura-possivel' : 'movimento-possivel');
    });
}

/**
 * Limpa a seleção e os destaques de movimentos.
 */
function desselecionarPeca() {
    if (pecaSelecionada) {
        pecaSelecionada.elemento.classList.remove('selecionada');
        pecaSelecionada.movimentosPossiveis.forEach(movimento => {
            const casaDestino = tabuleiroElemento.children[movimento.destino];
            casaDestino.classList.remove('movimento-possivel', 'captura-possivel');
        });
    }
    pecaSelecionada = null;
}

/**
 * --- FUNÇÃO MODIFICADA ---
 * Executa um movimento, atualiza o estado e a tela.
 */
function executarMovimento(origem, movimento) {
    const { destino, capturado } = movimento;
    const peca = tabuleiroLogico[origem];
    
    tabuleiroLogico[destino] = peca;
    tabuleiroLogico[origem] = null;
    
    if (capturado !== null) {
        const pecaCapturada = tabuleiroLogico[capturado];
        if (pecaCapturada) {
             placar[pecaCapturada.cor]++;
        }
        tabuleiroLogico[capturado] = null;
    }

    const linhaDestino = Math.floor(destino / 8);
    if (peca.tipo === PEAO && ((peca.cor === 'branca' && linhaDestino === 0) || (peca.cor === 'preta' && linhaDestino === 7))) {
        peca.tipo = DAMA;
    }

    desselecionarPeca();
    renderizarTabuleiro();
    atualizarPlacar();

    if (capturado !== null) {
        // Ao checar por novas capturas, passamos 'true' para indicar que é um multi-salto
        const novasCapturas = encontrarMovimentosValidos(destino, true).filter(m => m.captura);
        if (novasCapturas.length > 0) {
            selecionarPeca(destino, tabuleiroElemento.children[destino], true);
            return;
        }
    }

    trocarTurno(turno === 'branca' ? 'preta' : 'branca');
}

/**
 * Troca o turno, atualiza a interface e verifica o fim do jogo.
 */
function trocarTurno(novoTurno) {
    turno = novoTurno;
    infoTurnoElemento.textContent = `Turno: ${turno.charAt(0).toUpperCase() + turno.slice(1)}s`;
    
    capturasObrigatorias = [];
    for (let i = 0; i < 64; i++) {
        if (tabuleiroLogico[i] && tabuleiroLogico[i].cor === turno) {
            const movimentos = encontrarMovimentosValidos(i);
            if (movimentos.length > 0 && movimentos.some(m => m.captura)) {
                movimentos.filter(m => m.captura).forEach(c => capturasObrigatorias.push({ origem: i, ...c }));
            }
        }
    }
    
    verificarFimDeJogo();
}

/**
 * --- FUNÇÃO MODIFICADA ---
 * Encontra todos os movimentos válidos (simples e de captura) para uma peça.
 */
function encontrarMovimentosValidos(index, checandoMultiSalto = false) {
    const peca = tabuleiroLogico[index];
    if (!peca) return [];
    // A Dama não precisa da nova lógica, mas o peão sim, então passamos o parâmetro para ele.
    return peca.tipo === DAMA ? encontrarMovimentosDama(index, peca.cor) : encontrarMovimentosPeao(index, peca.cor, checandoMultiSalto);
}

/**
 * --- FUNÇÃO MODIFICADA ---
 * Encontra movimentos para um peão, priorizando capturas e permitindo capturas para trás em multi-saltos.
 */
function encontrarMovimentosPeao(index, cor, checandoMultiSalto = false) {
    const movimentosSimples = [];
    const capturas = [];
    const direcaoFrente = cor === 'branca' ? -1 : 1;
    const linha = Math.floor(index / 8);
    const coluna = index % 8;

    // Define as direções a serem checadas
    let direcoes = [
        { dCol: -1, dLin: direcaoFrente }, // Frente-Esquerda
        { dCol: 1, dLin: direcaoFrente }   // Frente-Direita
    ];
    
    // Se estivermos checando um multi-salto, adiciona as direções para trás
    if (checandoMultiSalto) {
        direcoes.push({ dCol: -1, dLin: -direcaoFrente }); // Trás-Esquerda
        direcoes.push({ dCol: 1, dLin: -direcaoFrente });  // Trás-Direita
    }
    
    for (const dir of direcoes) {
        const novaColuna = coluna + dir.dCol;
        const novaLinha = linha + dir.dLin;
        const novoIndex = novaLinha * 8 + novaColuna;

        if (novaLinha >= 0 && novaLinha < 8 && novaColuna >= 0 && novaColuna < 8) {
            // Movimentos simples só podem ocorrer para frente e se não for um multi-salto
            if (tabuleiroLogico[novoIndex] === null) {
                if (!checandoMultiSalto && dir.dLin === direcaoFrente) {
                    movimentosSimples.push({ destino: novoIndex, captura: false, capturado: null });
                }
            } 
            // Capturas podem ocorrer em qualquer direção permitida
            else if (tabuleiroLogico[novoIndex].cor !== cor) {
                const puloLinha = novaLinha + dir.dLin;
                const puloColuna = novaColuna + dir.dCol;
                const puloIndex = puloLinha * 8 + puloColuna;
                if (puloLinha >= 0 && puloLinha < 8 && puloColuna >= 0 && puloColuna < 8 && tabuleiroLogico[puloIndex] === null) {
                    capturas.push({ destino: puloIndex, captura: true, capturado: novoIndex });
                }
            }
        }
    }
    
    return capturas.length > 0 ? capturas : movimentosSimples;
}


/**
 * Encontra movimentos para uma Dama, priorizando capturas.
 */
function encontrarMovimentosDama(index, cor) {
    const movimentosSimples = [];
    const capturas = [];
    const direcoes = [{ dLin: -1, dCol: -1 }, { dLin: -1, dCol: 1 }, { dLin: 1, dCol: -1 }, { dLin: 1, dCol: 1 }];

    for (const dir of direcoes) {
        let pecaInimigaNoCaminho = null;

        for (let i = 1; i < 8; i++) {
            const linha = Math.floor(index / 8) + i * dir.dLin;
            const coluna = (index % 8) + i * dir.dCol;
            if (linha < 0 || linha >= 8 || coluna < 0 || coluna >= 8) break;

            const novoIndex = linha * 8 + coluna;
            const pecaNoCaminho = tabuleiroLogico[novoIndex];

            if (pecaInimigaNoCaminho) { 
                if (pecaNoCaminho) break; 
                capturas.push({ destino: novoIndex, captura: true, capturado: pecaInimigaNoCaminho.index });
            } else { 
                if (pecaNoCaminho) {
                    if (pecaNoCaminho.cor === cor) break; 
                    else pecaInimigaNoCaminho = { index: novoIndex }; 
                } else {
                    movimentosSimples.push({ destino: novoIndex, captura: false, capturado: null });
                }
            }
        }
    }
    return capturas.length > 0 ? capturas : movimentosSimples;
}

/**
 * Verifica se o jogo terminou e exibe a tela de fim de jogo.
 */
function verificarFimDeJogo() {
    let brancasVivas = 0;
    let pretasVivas = 0;
    let movimentosPossiveisJogadorAtual = 0;

    for (let i = 0; i < 64; i++) {
        const peca = tabuleiroLogico[i];
        if (peca) {
            if (peca.cor === 'branca') brancasVivas++;
            if (peca.cor === 'preta') pretasVivas++;
            if (peca.cor === turno) {
                movimentosPossiveisJogadorAtual += encontrarMovimentosValidos(i).length;
            }
        }
    }

    let vencedor = null;
    if (brancasVivas === 0) vencedor = 'Pretas';
    if (pretasVivas === 0) vencedor = 'Brancas';
    if (movimentosPossiveisJogadorAtual === 0) {
        vencedor = turno === 'branca' ? 'Pretas' : 'Brancas';
    }

    if (vencedor) {
        jogoFinalizado = true;
        fimDeJogoTextoElemento.textContent = `${vencedor} venceram!`;
        fimDeJogoElemento.classList.remove('hidden');
    }
}

/**
 * Atualiza o placar de peças capturadas.
 */
function atualizarPlacar() {
    brancasCapturadasElemento.textContent = placar.branca;
    pretasCapturadasElemento.textContent = placar.preta;
}