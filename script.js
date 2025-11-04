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
            // let linhaPeca = Number(elementoCasaPeca.dataset.linha);
            // let colunaPeca = Number(elementoCasaPeca.dataset.coluna);
            if (corPeca === config.turno) {
                verificaJogabilidade(config.turno, corPeca, elementoCasaPeca, tipoPeca);
            } else {
                return
            }
        } else if(event.target.matches('.casaPreta, .possivel')){
            let casaDestino = event.target;
            manipulaPosicao(casaDestino)
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

                if(c%2 == 0) posicao.classList.add("casaBranca")

                if(c%2 != 0) posicao.classList.add("casaPreta")

            } else {

                if(c%2 == 0) posicao.classList.add("casaPreta")

                if(c%2 != 0) posicao.classList.add("casaBranca")

            }
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

    casaDestino.appendChild(config.pecaSelecionada);

    resetJogada();

    config.alternarTurno();

    config.pecaSelecionada = null;
}

function verificaJogabilidade(turno, corPeca, casaAtual, tipoPeca) {
    resetJogada();
    
    config.pecaSelecionada = casaAtual.querySelector('.peca');
    let linhaAtual = Number(casaAtual.dataset.linha);
    let colunaAtual = Number(casaAtual.dataset.coluna);
    let movPossiveis = [];
    if (tipoPeca === 'peao') {    
        let direcao = (corPeca === 'pretas') ? 1 : -1;
        
        let casaEsquerda = document.querySelector(`[data-linha="${linhaAtual + direcao}"][data-coluna="${colunaAtual - 1}"]`);
        let casaDireita = document.querySelector(`[data-linha="${linhaAtual + direcao}"][data-coluna="${colunaAtual + 1}"]`);
        
        if (casaEsquerda && !casaEsquerda.hasChildNodes()) {
            movPossiveis.push(casaEsquerda);
            casaAtual.classList.add('selecionada');
            casaEsquerda.classList.add('possivel');
        }
        if (casaDireita && !casaDireita.hasChildNodes()){ 
            movPossiveis.push(casaDireita);
            casaAtual.classList.add('selecionada');
            casaDireita.classList.add('possivel');
        }}

}

function iniciaJogo() {
    criarTabuleiro();
    inserirPecasTabuleiro(config);
    criaEventos();
}

document.addEventListener('DOMContentLoaded', iniciaJogo);
