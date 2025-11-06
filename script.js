var config = {
    turno: 'brancas',
    tabuleiro: function(){return document.querySelectorAll("td")},
    posicoesTabuleiro: [],
    pecaPreta: function () {
        let peca = document.createElement('div')
        peca.classList.add('peca', 'preta')
        peca.dataset.identificador = 'pretas'
        peca.style.cursor = 'pointer'
        peca.dataset.tipo = 'peao'
        return peca
    },
    pecaBranca: function() {
        let peca = document.createElement('div')
        peca.classList.add('peca', 'branca')
        peca.dataset.identificador = 'brancas'
        peca.style.cursor = 'pointer'
        peca.dataset.tipo = 'peao'
        return peca
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
            let tipoPeca = event.target.dataset.tipo
            if (corPeca === config.turno) {
                verificaJogabilidade(corPeca, elementoCasaPeca, tipoPeca);
            } else {
                return
            }
        } else if(event.target.matches('.possivel')){
            let casaDestino = event.target;
            manipulaPosicao(casaDestino)
        } else if(event.target.matches('.promocao, .casaPreta')){
            let casaPromocao = event.target;
            promovePeca(casaPromocao);
        }
    })
}

function criarTabuleiro(){
    let tabuleiro = document.createElement("section");
    tabuleiro.classList.add("tabuleiro")

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
            if (l == 0 || l == 7) posicao.classList.add("promocao");
            
        }

        table.appendChild(linha);
    }

    document.getElementById("principal").appendChild(tabuleiro)
}

function resetJogada(){
    document.querySelectorAll('td').forEach(casa => {
        casa.classList.remove('possivel');
        casa.classList.remove('selecionada');
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
    
    // mover a peça
    casaDestino.appendChild(config.pecaSelecionada);

    // se houve captura, remover peça inimiga
    let linhaCaptura = casaDestino.dataset.capturaLinha;
    let colunaCaptura = casaDestino.dataset.capturaColuna;

    if (linhaCaptura && colunaCaptura) {
        let casaCaptura = document.querySelector(`[data-linha="${linhaCaptura}"][data-coluna="${colunaCaptura}"]`);
        if (casaCaptura && casaCaptura.hasChildNodes()) {
            casaCaptura.firstChild.remove();
        }
    }

    resetJogada();
    config.alternarTurno();
    config.pecaSelecionada = null;
}


function verificaJogabilidade(corPeca, casaAtual, tipoPeca) {
    resetJogada();
    
    config.pecaSelecionada = casaAtual.querySelector('.peca');
    let linhaAtual = Number(casaAtual.dataset.linha);
    let colunaAtual = Number(casaAtual.dataset.coluna);
    let direcao = (corPeca === 'pretas') ? 1 : -1; // pretas descem, brancas sobem

    casaAtual.classList.add('selecionada');
    config.pecaCaptura = null; // reseta possíveis capturas

    // --- MOVIMENTAÇÃO NORMAL ---
    let diagonais = [
        { linha: linhaAtual + direcao, coluna: colunaAtual - 1 },
        { linha: linhaAtual + direcao, coluna: colunaAtual + 1 }
    ];

    diagonais.forEach(diag => {
        let casa = document.querySelector(`[data-linha="${diag.linha}"][data-coluna="${diag.coluna}"]`);
        if (!casa) return;

        if (!casa.hasChildNodes()) {
            // casa livre: movimento simples
            casa.classList.add('possivel');
        } else {
            // há uma peça — verificar se é inimiga e se pode capturar
            let pecaNaDiagonal = casa.querySelector('.peca');
            if (pecaNaDiagonal.dataset.identificador !== corPeca) {
                // verificar casa depois dela
                let linhaApos = diag.linha + direcao;
                let colunaApos = diag.coluna + (diag.coluna > colunaAtual ? 1 : -1);
                let casaApos = document.querySelector(`[data-linha="${linhaApos}"][data-coluna="${colunaApos}"]`);
                
                if (casaApos && !casaApos.hasChildNodes()) {
                    // captura disponível
                    casaApos.classList.add('possivel');
                    // armazena qual peça será capturada se o jogador clicar nesta casa
                    casaApos.dataset.capturaLinha = diag.linha;
                    casaApos.dataset.capturaColuna = diag.coluna;
                }
            }
        }
    });
}

function promovePeca(casaPromocao){
    let promove = (casaPromocao.dataset.linha == 1) ? 'brancas' : 'pretas';
    console.log(casaPromocao.firstChild.identificador);
    if(casaPromocao.hasChildNodes() && casaPromocao.firstChild.identificador == promove){
        let pecaPromovida = casaPromocao.firstChild
        pecaPromovida.classList.add('dama')
    }
}

function iniciaJogo() {
    criarTabuleiro();
    inserirPecasTabuleiro(config);
    criaEventos();
}

document.addEventListener('DOMContentLoaded', iniciaJogo);
