var config = {
    tabuleiro: function(){return document.querySelectorAll("td")},
    posicoesTabuleiro: [],
    pecaPreta: function () {
        let peca = document.createElement('div')
        peca.classList.add('peca', 'preta')
        peca.dataset.identificador = 'preta'
        peca.style.cursor = 'pointer'
        return peca
    },
    pecaBranca: function() {
        let peca = document.createElement('div')
        peca.classList.add('peca', 'branca')
        peca.dataset.identificador = 'branca'
        peca.style.cursor = 'pointer'
        return peca
    }
}

function criaEventos() {
    let containerMain = document.querySelector('main');
    containerMain.addEventListener('click', (event) => {
        if(event.target.matches('.peca')) {
            let corPeca = event.target.dataset.identificador;
            let elementoCasaPeca = event.target.parentElement;
            let linhaPeca = Number(elementoCasaPeca.dataset.linha);
            let colunaPeca = Number(elementoCasaPeca.dataset.coluna);
            verificaJogabilidade(corPeca, linhaPeca, colunaPeca);
        } else if(event.target.matches('.casaPreta'))
            console.log('vc clicou numa casa');
    })
}

function criarTabuleiro(){
    let tabuleiro = document.createElement("section");
    tabuleiro.classList.add("Tabuleiro")

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

function manipulaPosicao(corPeca, linhaPeca, colunaPeca) {
     
}

function verificaJogabilidade(corPeca, linhaPeca, colunaPeca) {
    if(corPeca == 'preta'){
        console.log(linhaPeca+1, colunaPeca-1, colunaPeca+1)
        const proximaLinha =  document.querySelector(`[data-linha="${linhaPeca+1}"]`);
        const menorColuna = document.querySelector(`[data-coluna="${colunaPeca-1}"]`);
        const maiorColuna = document.querySelector(`[data-coluna="${colunaPeca+1}"]`);
        console.log(proximaLinha, menorColuna, maiorColuna);
    }
}

function iniciaJogo() {
    criaEventos();
    criarTabuleiro();
    inserirPecasTabuleiro(config);
}

document.addEventListener('DOMContentLoaded', iniciaJogo);
