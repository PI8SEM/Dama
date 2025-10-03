### Projeto Jogo de Damas

- [ ] **1. Criar estrutura básica do projeto**
    - [x] Arquivos `index.html`, `style.css`, `script.js`.
    - [ ] Configurar layout do tabuleiro 8x8.
    - [x] Criar HUD com informações de turno e botão “Reiniciar”.

- [ ] **2. Estilizar tabuleiro e peças**
    - [ ] Definir casas claras e escuras.
    - [ ] Estilizar peças vermelhas e pretas em formato circular.
    - [ ] Criar estilo visual diferenciado para dama (ex.: borda dourada).
    - [ ] Garantir que o tabuleiro seja centralizado e responsivo (desktop e mobile).

- [ ] **3. Implementar estado e lógica de movimentação**
    - [ ] Representar o tabuleiro em uma matriz 8x8 no JavaScript.
    - [ ] Permitir seleção apenas da peça do jogador da vez.
    - [ ] Calcular e destacar movimentos válidos (diagonais livres).
    - [ ] Realizar movimentação ao clicar no destino válido.
    - [ ] Alternar turno automaticamente após a jogada.

- [ ] **4. Implementar regras de captura**
    - [ ] Permitir captura ao pular sobre peça adversária.
    - [ ] Remover peça capturada do tabuleiro.
    - [ ] Permitir capturas múltiplas na mesma jogada.
    - [ ] (Opcional) Forçar captura quando existir possibilidade.

- [ ] **5. Implementar promoção a dama**
    - [ ] Detectar quando uma peça chega à última linha.
    - [ ] Promover para dama e aplicar novo estilo visual.
    - [ ] Permitir movimentação estendida da dama (para frente e para trás).

- [ ] **6. Implementar reinício e fim de jogo**
    - [ ] Botão “Reiniciar” deve restaurar o estado inicial do tabuleiro.
    - [ ] Detectar fim de jogo (sem peças ou sem movimentos possíveis).
    - [ ] Exibir mensagem de vitória do jogador.