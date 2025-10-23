var config = {
    tabuleiro: document.querySelectorAll("td"),
    posicoesTabuleiro: [],
    pecaPreta: function () {
        let peca = document.createElement('div')
        peca.classList.add('peca', 'preta')
        return peca
    },
    pecaBranca: function() {
        let peca = document.createElement('div')
        peca.classList.add('peca', 'branca')
        return peca
    }
}


function criarManipuladorPosicoes(objetoPosicoes){
    objetoPosicoes.forEach(posicao => {

        posicao.addEventListener("click", () => {
            manipuladorTabuleiro(posicao, config.pecaBranca()) // precisa passar segundo parametro com base na peça que usuario escolher
        })

        config.posicoesTabuleiro.push(posicao)
    });
}

function inserirPecasTabuleiro(){
    const casas = config.posicoesTabuleiro;
    // Posiciona as 12 peças pretas nas 3 primeiras linhas
    for (let i = 0; i < 24; i++) {
        // Pega a linha (de 0 a 7) e a coluna (de 0 a 7) a partir do índice
        const linha = Math.floor(i / 8);
        const coluna = i % 8;

        // Condição para posicionar apenas nas casas jogáveis
        if ((linha + coluna) % 2 !== 0) {
            if (linha < 3) { // 3 primeiras linhas
                manipuladorTabuleiro(casas[i], config.pecaPreta());
            }
        }
    }
    // Posiciona as 12 peças brancas nas 3 últimas linhas
    for (let i = 40; i < 64; i++) {
        const linha = Math.floor(i / 8);
        const coluna = i % 8;

        if ((linha + coluna) % 2 !== 0) {
            if (linha > 4) { // 3 últimas linhas
                manipuladorTabuleiro(casas[i], config.pecaBranca());
            }
        }
    }
}

function manipuladorTabuleiro(posicao, corPeca){
    posicao.appendChild(corPeca);
}


criarManipuladorPosicoes(config.tabuleiro)
inserirPecasTabuleiro()