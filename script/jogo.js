var config = {
    turno: 'brancas',
    tabuleiro: function(){return document.querySelectorAll("td")},
    posicoesTabuleiro: [],
    pecaPreta: function () {
        let peca = document.createElement('div');
        peca.classList.add('peca', 'preta');
        peca.dataset.identificador = 'pretas';
        peca.style.cursor = 'pointer';
        peca.dataset.tipo = 'peao';
        return peca;
    },
    pecaBranca: function() {
        let peca = document.createElement('div');
        peca.classList.add('peca', 'branca');
        peca.dataset.identificador = 'brancas';
        peca.style.cursor = 'pointer';
        peca.dataset.tipo = 'peao';
        return peca;
    },
    alternarTurno: function() { //chamar essa função para trocar os turnos.
        this.turno = (this.turno === 'brancas') ? 'pretas' : 'brancas';
        document.querySelector('#controle-turno').textContent = this.turno;
    } 
}

function criaEventos() {
    let containerMain = document.querySelector('main');
    containerMain.addEventListener('click', (event) => {
        if(event.target.matches('.peca')) {
            let corPeca = event.target.dataset.identificador;
            let elementoCasaPeca = event.target.parentElement;
            let tipoPeca = event.target.dataset.tipo;
            if (corPeca === config.turno) {
                verificaJogabilidade(corPeca, elementoCasaPeca, tipoPeca);
            } else {
                return;
            }
        } else if(event.target.matches('.possivel')){
            let casaDestino = event.target;
            manipulaPosicao(casaDestino);
        } else if(event.target.matches('#reset')){
            reiniciarPartida();
            // location.reload();
        }
    })
}

function criarTabuleiro(){
    let tabuleiro = document.createElement("section");
    tabuleiro.id = 'tabuleiro';
    tabuleiro.classList.add("tabuleiro");

    let table = document.createElement("table");
    tabuleiro.appendChild(table);

    for (let l = 0; l < 8; l++) {
        let linha = document.createElement("tr");

        for (let c = 0; c < 8; c++) {
            let posicao = document.createElement("td");
            posicao.dataset.linha = l+1;
            posicao.dataset.coluna = c+1;

        
            linha.appendChild(posicao);

            if (l%2 == 0){

                if(c%2 == 0) posicao.classList.add("casaBranca");

                if(c%2 != 0) posicao.classList.add("casaPreta");

            } else {

                if(c%2 == 0) posicao.classList.add("casaPreta");

                if(c%2 != 0) posicao.classList.add("casaBranca");

            }
            if (l == 0 || l == 7) {
                posicao.dataset.promove = "sim";
            } else {
                posicao.dataset.promove = "nao";
            }
        }

        table.appendChild(linha);
    }

    document.getElementById("principal").appendChild(tabuleiro);
}

function resetJogada(){
    document.querySelectorAll('td').forEach(casa => {
        casa.classList.remove('possivel');
        casa.classList.remove('selecionada');
        delete casa.dataset.capturaLinha;
        delete casa.dataset.capturaColuna;
    });
    
}

function inserirPecasTabuleiro(config){
    const casasJogaveis = document.querySelectorAll('.casaPreta');
    casasJogaveis.forEach(casasIniciais => {
        let identificaLinha = casasIniciais.dataset.linha;
        if (identificaLinha <= 3){
            casasIniciais.appendChild(config.pecaPreta());
        }
        if (identificaLinha >= 6) {
            casasIniciais.appendChild(config.pecaBranca());
        }
    })

}

function manipulaPosicao(casaDestino) {
    if(!config.pecaSelecionada) return;
    
    casaDestino.appendChild(config.pecaSelecionada);
    if (casaDestino.dataset.promove == 'sim') {
        promovePeca(casaDestino);
    }
    // se houve captura, remover peça inimiga
    let linhaCaptura = casaDestino.dataset.capturaLinha;
    let colunaCaptura = casaDestino.dataset.capturaColuna;

    if (linhaCaptura && colunaCaptura) {
        let casaCaptura = document.querySelector(`[data-linha="${linhaCaptura}"][data-coluna="${colunaCaptura}"]`);
        if (casaCaptura && casaCaptura.hasChildNodes()) {
            casaCaptura.firstChild.remove();
        }
    }

    // se a jogada foi uma captura, verificar se há mais capturas
    if (linhaCaptura && colunaCaptura) {
        config.pecaSelecionada = casaDestino.firstChild;
        resetJogada();
        verificaJogabilidade(
            config.pecaSelecionada.dataset.identificador,
            casaDestino,
            config.pecaSelecionada.dataset.tipo
        );

        // se apareceram novas capturas, NÃO troca o turno
        let temNovaCaptura = [...document.querySelectorAll('.possivel')]
            .some(c => c.dataset.capturaLinha);

        if (temNovaCaptura) return;
    }


    resetJogada();
    verificaVencedor();
    config.alternarTurno();
    config.pecaSelecionada = null;
}


function verificaJogabilidade(corPeca, casaAtual, tipoPeca) {
    resetJogada();
    
    config.pecaSelecionada = casaAtual.querySelector('.peca');
    casaAtual.classList.add('selecionada');

    if (tipoPeca === 'peao') {
        verificaJogabilidadePeao(corPeca, casaAtual);
    } else {
        verificaJogabilidadeDama(corPeca, casaAtual);
    }
}


function verificaJogabilidadePeao(corPeca, casaAtual) {
    let linhaAtual = Number(casaAtual.dataset.linha);
    let colunaAtual = Number(casaAtual.dataset.coluna);
    let direcao = (corPeca === 'pretas') ? 1 : -1;

    let diagonais = [
        { l: linhaAtual + direcao, c: colunaAtual - 1 },
        { l: linhaAtual + direcao, c: colunaAtual + 1 }
    ];

    let capturasDisponiveis = false;

    diagonais.forEach(pos => {
        let casa = document.querySelector(`[data-linha="${pos.l}"][data-coluna="${pos.c}"]`);
        if (!casa) return;

        if (!casa.hasChildNodes()) {
            // só marca movimento simples SE não houver captura disponível
            casa.classList.add('possivel');
        } else {
            // verificar captura
            let peca = casa.firstChild;
            if (peca.dataset.identificador !== corPeca) {
                let lApos = pos.l + direcao;
                let cApos = pos.c + (pos.c > colunaAtual ? 1 : -1);
                let casaApos = document.querySelector(`[data-linha="${lApos}"][data-coluna="${cApos}"]`);
                if (casaApos && !casaApos.hasChildNodes()) {
                    capturasDisponiveis = true;
                    casaApos.classList.add('possivel');
                    casaApos.dataset.capturaLinha = pos.l;
                    casaApos.dataset.capturaColuna = pos.c;
                }
            }
        }
    });

    if (capturasDisponiveis) {
        // remove movimentos simples
        document.querySelectorAll('.possivel').forEach(c => {
            if (!c.dataset.capturaLinha) c.classList.remove('possivel');
        });
    }
}

function verificaJogabilidadeDama(corPeca, casaAtual) {
    let linhaAtual = Number(casaAtual.dataset.linha);
    let colunaAtual = Number(casaAtual.dataset.coluna);

    let direcoes = [
        { dl: 1, dc: 1 },
        { dl: 1, dc: -1 },
        { dl: -1, dc: 1 },
        { dl: -1, dc: -1 }
    ];

    let capturasEncontradas = false;

    direcoes.forEach(dir => {
        let l = linhaAtual + dir.dl;
        let c = colunaAtual + dir.dc;
        let encontrouPecaInimiga = false;
        let lCaptura, cCaptura;

        while (l >= 1 && l <= 8 && c >= 1 && c <= 8) {
            let casa = document.querySelector(`[data-linha="${l}"][data-coluna="${c}"]`);

            if (!casa.hasChildNodes()) {
                // casa vazia
                if (!encontrouPecaInimiga) {
                    // movimento simples
                    casa.classList.add('possivel');
                } else {
                    // rota de captura
                    capturasEncontradas = true;
                    casa.classList.add('possivel');
                    casa.dataset.capturaLinha = lCaptura;
                    casa.dataset.capturaColuna = cCaptura;
                }
            } else {
                let peca = casa.firstChild;

                if (peca.dataset.identificador === corPeca) {
                    // peça da mesma cor → bloqueia tudo
                    break;
                }

                if (!encontrouPecaInimiga) {
                    // achou primeira peça inimiga
                    encontrouPecaInimiga = true;
                    lCaptura = l;
                    cCaptura = c;
                } else {
                    // já tem peça inimiga na direção → bloqueia
                    break;
                }
            }

            l += dir.dl;
            c += dir.dc;
        }
    });

    if (capturasEncontradas) {
        // remove movimentos simples
        document.querySelectorAll('.possivel').forEach(c => {
            if (!c.dataset.capturaLinha) c.classList.remove('possivel');
        });
    }
}



function promovePeca(casaPromocao){
    let pecaPromovida = casaPromocao.firstChild;
    let tipoPeca = pecaPromovida.dataset.tipo;
    if (tipoPeca == 'peao'){
        pecaPromovida.classList.add('dama');
        pecaPromovida.dataset.tipo = 'dama'
        console.log(pecaPromovida);
    }
}

function reiniciarPartida() {
    console.log('clicou')
    const containerBody = document.querySelector('body');
    const iteracaoUsuario = document.createElement('dialog');
    iteracaoUsuario.classList.add('reiniciar-partida');
    const containerMensagem = document.createElement('div');
    containerMensagem.innerHTML = `<h3>Tem certeza que deseja reiniciar o jogo?</h3>`;

    iteracaoUsuario.appendChild(containerMensagem);
    const containerBotoes = document.createElement('div');
    containerBotoes.classList.add('container-botoes');
    iteracaoUsuario.appendChild(containerBotoes);

    const btnNegacao = document.createElement('button');
    btnNegacao.textContent = 'Não'
    btnNegacao.classList.add('nao');
    containerBotoes.appendChild(btnNegacao);

    const btnAfirmacao = document.createElement('button');
    btnAfirmacao.textContent = 'Sim';
    btnAfirmacao.classList.add('sim');
    containerBotoes.appendChild(btnAfirmacao);
    

    containerBody.appendChild(iteracaoUsuario);
    iteracaoUsuario.showModal();

    iteracaoUsuario.addEventListener('click', function(event){
        const botao = event.target.closest('button');
        if (!botao) return;

        if(botao.classList.contains('nao')){
            iteracaoUsuario.close();
        } else if(botao.classList.contains('sim')){
            resetTabuleiro();
            criarTabuleiro();
            inserirPecasTabuleiro(config);
            iteracaoUsuario.close();
        }
    })
    
}

function verificaVencedor(){
    let contadorPretas = document.querySelectorAll('.peca.preta').length;
    let contadorBrancas = document.querySelectorAll('.peca.branca').length;

    let modalVitoria = document.createElement('dialog');
    modalVitoria.classList.add('modal-vitoria');

    let containerModVitoria = document.createElement('div');
    containerModVitoria.classList.add('container-vitoria');
    modalVitoria.appendChild(containerModVitoria);

    let mensagemVitoria = document.createElement('h3');
    containerModVitoria.appendChild(mensagemVitoria);

    let botaoNovaPartida = document.createElement('button');
    botaoNovaPartida.classList.add('nova-partida');
    botaoNovaPartida.textContent = 'Nova Partida';
    containerModVitoria.appendChild(botaoNovaPartida);

    if(contadorBrancas == 0) {
        mensagemVitoria.textContent = 'As peças Pretas Ganharam';
    } else if (contadorPretas == 0){
        mensagemVitoria.textContent = 'As peças Brancas Ganharam';
    } else {return}
    document.querySelector('body').appendChild(modalVitoria);
    modalVitoria.showModal();
    
    botaoNovaPartida.addEventListener('click', function(){
        resetTabuleiro();
        criarTabuleiro();
        inserirPecasTabuleiro(config);
        modalVitoria.close();
    })
}

function resetTabuleiro(){
    const tabuleiro = document.querySelector('#tabuleiro');
    tabuleiro.remove();
    config.turno = 'brancas';
    document.querySelector('#controle-turno').textContent = 'brancas';
}

function iniciaJogo() {
    criarTabuleiro();
    inserirPecasTabuleiro(config);
    criaEventos();
}

document.addEventListener('DOMContentLoaded', iniciaJogo);
