import React, { useState } from "react";
import Carta from "../carta/carta";

const generateDeck = () => {
  const cores = ["red", "blue", "green", "yellow"];
  const numeros = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "Skip",
    "Reverse",
    "Draw4",
    "Draw2",
    "ColorPick",
  ];

  const deck = [];

  cores.forEach(cor => {
    numeros.forEach(numero => {
      if (numero === 'Draw4' || numero === 'ColorPick') {
        deck.push({ cor: null, numero });
        deck.push({ cor: null, numero });
      } else {
        deck.push({ cor, numero });
        deck.push({ cor, numero });
      }
    });
  });

  console.log(deck);
  return deck;
};

const Deck = () => {
  const [deck, setDeck] = useState(generateDeck());

  const handleGenerateDeck = () => {
    setDeck(generateDeck());
  };

  return (
    <div className="deck">
      {deck.map((carta, index) => (
        <Carta key={index} cor={carta.cor} numero={carta.numero} />
      ))}

      <button onClick={handleGenerateDeck}>Novo Deck</button>
    </div>
  );
};

export default generateDeck;
