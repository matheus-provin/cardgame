import React, { useState, useEffect } from "react";
import Carta from "../carta/carta";
import generateDeck from "../deck/deck";

const Tabuleiro = () => {
  const [cartaAtual, setCartaAtual] = useState(null);
  const [corSelecionada, setCorSelecionada] = useState(null);
  const [deck, setDeck] = useState([]);
  const [reverse, setReverse] = useState(false);
  const [nextPlayer, setNextPlayer] = useState(1);
  const [cardsToDraw, setCardsToDraw] = useState(0);
  const [vencedor, setVencedor] = useState(null);
  const totalPlayers = 2;
  const [availableColors, setAvailableColors] = useState([]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [maosJogadores, setMaosJogadores] = useState([]);

  const shuffleDeck = (deck) => {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = deck[i];
      deck[i] = deck[j];
      deck[j] = temp;
    }
    return deck;
  };

  const isSpecialCard = (carta) => {
    return carta.numero === "Draw4" || carta.numero === "ColorPick";
  };

  const divideCartasEntreJogadores = (deck, numJogadores) => {
    const numCartasPorJogador = Math.floor(deck.length / numJogadores);
    const maos = [];
    for (let i = 0; i < numJogadores; i++) {
      const inicio = i * numCartasPorJogador;
      const fim = inicio + numCartasPorJogador;
      maos.push(deck.slice(inicio, fim));
    }
    return maos;
  };

  const handleDealCards = () => {
    const generatedDeck = generateDeck();
    const shuffledDeck = shuffleDeck(generatedDeck);

    let firstCardIndex = 0;
    while (isSpecialCard(shuffledDeck[firstCardIndex])) {
      firstCardIndex++;
    }

    const maos = divideCartasEntreJogadores(shuffledDeck, totalPlayers);
    const updatedDeck = shuffledDeck.slice(totalPlayers * 7);
    setCartaAtual(shuffledDeck[firstCardIndex]);
    setMaosJogadores(maos);
    setDeck(updatedDeck);
  };

  const getNextPlayer = () => {
    if (reverse) {
      return nextPlayer === 1 ? totalPlayers : nextPlayer - 1;
    } else {
      return nextPlayer === totalPlayers ? 1 : nextPlayer + 1;
    }
  };

  const handlePlayCard = (jogadorIndex, carta) => {
    if (isSpecialCard(carta)) {
      if (carta.numero === "Draw4") {
        setNextPlayer(getNextPlayer());
        setCardsToDraw(4);
        const updatedMaosJogadores = [...maosJogadores];
        updatedMaosJogadores[jogadorIndex] = updatedMaosJogadores[
          jogadorIndex
        ].filter((c) => c !== carta);
        setMaosJogadores(updatedMaosJogadores);
      } else if (carta.numero === "Draw2") {
        setCardsToDraw(2);
        setNextPlayer(getNextPlayer());
      } else if (carta.numero === "ColorPick") {
        setCartaAtual(carta);
        setShowColorPicker(true);
        setAvailableColors(["red", "green", "blue", "yellow"]);
      } else if (carta.numero === "Skip") {
        setNextPlayer(getNextPlayer());
      } else if (carta.numero === "Reverse") {
        setReverse(!reverse);
        setNextPlayer(getNextPlayer());
      }
    } else {
      if (corSelecionada !== null) {
        if (carta.cor === corSelecionada) {
          const updatedMaosJogadores = [...maosJogadores];
          updatedMaosJogadores[jogadorIndex] = updatedMaosJogadores[
            jogadorIndex
          ].filter((c) => c !== carta);
          setMaosJogadores(updatedMaosJogadores);
          setCartaAtual({ ...carta, cor: corSelecionada });
          setNextPlayer(getNextPlayer());
          setCorSelecionada(null);
        } else {
          console.log("Carta inválida!");
          if (maosJogadores[jogadorIndex].length === 0) {
            setCardsToDraw(cardsToDraw + 1);
          }
        }
      } else {
        if (
          carta.cor === cartaAtual.cor ||
          carta.numero === cartaAtual.numero
        ) {
          const updatedMaosJogadores = [...maosJogadores];
          updatedMaosJogadores[jogadorIndex] = updatedMaosJogadores[
            jogadorIndex
          ].filter((c) => c !== carta);
          setMaosJogadores(updatedMaosJogadores);
          setCartaAtual(carta);
          setNextPlayer(getNextPlayer());
        } else {
          console.log("Carta inválida!");
          if (maosJogadores[jogadorIndex].length === 0) {
            setCardsToDraw(cardsToDraw + 1);
          }
        }
      }
    }

    if (corSelecionada === null && carta.numero === "ColorPick") {
      const updatedMaosJogadores = [...maosJogadores];
      updatedMaosJogadores[jogadorIndex] = updatedMaosJogadores[
        jogadorIndex
      ].filter((c) => c !== carta);
      setMaosJogadores(updatedMaosJogadores);
    }
  };

  const handleSelectColor = (cor) => {
    setCorSelecionada(cor);
  };

  const handleConfirmColor = () => {
    handlePlayCard(nextPlayer - 1, { ...cartaAtual, cor: corSelecionada });
    setShowColorPicker(false);
  };

  const handleCancelColor = () => {
    setShowColorPicker(false);
  };

  const handleDrawCard = () => {
    const drawnCard = deck[0];
    const updatedDeck = deck.slice(1);
    const updatedMaosJogadores = [...maosJogadores];
    updatedMaosJogadores[nextPlayer - 1] = [
      ...updatedMaosJogadores[nextPlayer - 1],
      drawnCard,
    ];
    setDeck(updatedDeck);
    setMaosJogadores(updatedMaosJogadores);
    setCardsToDraw(cardsToDraw - 1);
    setNextPlayer(getNextPlayer());
  };

  useEffect(() => {
    if (maosJogadores[nextPlayer - 1].length === 0) {
      setVencedor(nextPlayer);
      console.log("venceu");
    }
  }, [maosJogadores, nextPlayer]);

  return (
    <div className="board">
      <h1>Uno Game</h1>
      <button onClick={handleDealCards}>Deal Cards</button>
      <div className="player-hand">
        {maosJogadores.map((mao, jogadorIndex) => (
          <div key={jogadorIndex}>
            {mao.map((carta, cartaIndex) => (
              <div key={cartaIndex} className="card-wrapper">
                <Carta cor={carta.cor} numero={carta.numero} />
                <button onClick={() => handlePlayCard(jogadorIndex, carta)}>
                  Jogar
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
      {cartaAtual !== null && (
        <div className="current-card">
          <h2>Carta Atual</h2>
          <Carta cor={cartaAtual.cor} numero={cartaAtual.numero} />
        </div>
      )}
      {cartasJogador && cartasJogador.length === 0 && (
        <div className="message">Nenhuma carta na mão do jogador</div>
      )}
      {showColorPicker && (
        <div className="color-picker">
          <h2>Selecionar Cor</h2>
          <div className="color-options">
            {availableColors.map((cor, index) => (
              <button
                key={index}
                className={`color-option ${cor}`}
                onClick={() => handleSelectColor(cor)}
              >
                {cor}
              </button>
            ))}
          </div>
          <div className="button-group">
            <button onClick={handleConfirmColor}>Confirmar</button>
            <button onClick={handleCancelColor}>Cancelar</button>
          </div>
        </div>
      )}
      <div className="button-group">
        <button onClick={handleDrawCard}>Comprar</button>
      </div>
    </div>
  );
};

export default Tabuleiro;
