var config = {
    tabuleiro: function(){return document.querySelectorAll("td")},
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

function criarTabuleiro(){
    let tabuleiro = document.createElement("section");
    tabuleiro.classList.add("Tabuleiro")

    let table = document.createElement("table");
    tabuleiro.appendChild(table);

    for (let l = 0; l < 8; l++) {
        let linha = document.createElement("tr");

        for (let c = 0; c < 8; c++) {
            let posicao = document.createElement("td");
            posicao.dataset.linha = l;
            posicao.dataset.coluna = c;

        
            linha.appendChild(posicao);

            if (l%2 == 0){

                if(c%2 == 0) posicao.classList.add("casaBranca")

                if(c%2 != 0) posicao.classList.add("casaPreta")

            } else {

                if(c%2 == 0) posicao.classList.add("casaPreta")

                if(c%2 != 0) posicao.classList.add("casaBranca")

            }

            posicao.appendChild(config.pecaPreta())



        }

        table.appendChild(linha);
    }

    // if (linha)

    document.getElementById("principal").appendChild(tabuleiro)
}


function criarManipuladorPosicoes(objetoPosicoes){
    objetoPosicoes.forEach(posicao => {

        posicao.addEventListener("click", (e) => {

            manipuladorTabuleiro(e) // precisa passar segundo parametro com base na peça que usuario escolher      
        
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

function manipuladorTabuleiro(e){

    var curretPosicao = e.target.dataset
    var filhoCasa = e.target.innerHTML;


    // if(!filhoCasa){
    //     return
    // }

    console.log(filhoCasa)

    // e[peca] = filhoCasa;


    // if()


    return {
        peca: e,
        posicao: curretPosicao,
    }




}

criarTabuleiro()
criarManipuladorPosicoes(config.tabuleiro())

inserirPecasTabuleiro()