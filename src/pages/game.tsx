import React, { useState, useEffect } from "react";
import "../styles/game.css";
import beth from "../images/beth.png";
import jerry from "../images/jerry.png";
import jessica from "../images/jessica.png";
import morty from "../images/morty.png";
import pessoaPassaro from "../images/pessoa-passaro.png";
import pickleRick from "../images/pickle-rick.png";
import rick from "../images/rick.png";
import summer from "../images/summer.png";
import meeseeks from "../images/meeseeks.png";
import scroopy from "../images/scroopy.png";

// Interface para os personagens
interface Character {
  name: string;
  img: string;
  correct: boolean;
}

// Lista de personagens do jogo
const characters: Character[] = [
  { name: "Beth", img: beth, correct: false },
  { name: "Jerry", img: jerry, correct: false },
  { name: "Jessica", img: jessica, correct: false },
  { name: "Morty", img: morty, correct: false },
  { name: "Pessoa Passaro", img: pessoaPassaro, correct: false },
  { name: "Pickle Rick", img: pickleRick, correct: false },
  { name: "Rick", img: rick, correct: false },
  { name: "Summer", img: summer, correct: false },
  { name: "Meeseeks", img: meeseeks, correct: false },
  { name: "Scroopy", img: scroopy, correct: false },
];

// Componente principal do jogo
const Game: React.FC = () => {
  const [cards, setCards] = useState<Character[]>([]); // Estado das cartas
  const [firstCard, setFirstCard] = useState<HTMLElement | null>(null); // Primeira carta virada
  const [secondCard, setSecondCard] = useState<HTMLElement | null>(null); // Segunda carta virada
  const [isClickable, setIsClickable] = useState<boolean>(true); // Controle de cliques
  const [time, setTime] = useState<number>(0); // Tempo do jogo
  const [gameFinished, setGameFinished] = useState<boolean>(false); // Estado de finalização do jogo
  const [playerName, setPlayerName] = useState<string>(""); // Nome do jogador
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null); // ID do temporizador
  const [gameStarted, setGameStarted] = useState<boolean>(false); // Estado de início do jogo

  // useEffect inicial para iniciar o jogo quando o componente monta
  useEffect(() => {
    iniciarJogo(); // Inicializa o jogo ao montar o componente
  }, []);

  // Função para iniciar/reiniciar o jogo
  const iniciarJogo = () => {
    const shuffledCards = [...characters, ...characters]
      .map((card) => ({ ...card, correct: false })) // Inicializa 'correct' como false
      .sort(() => Math.random() - 0.5); // Embaralha as cartas

    setCards(shuffledCards); // Define as cartas embaralhadas
    setTime(0); // Reseta o tempo
    setGameFinished(false); // Define que o jogo não está terminado
    setFirstCard(null); // Reseta a primeira carta
    setSecondCard(null); // Reseta a segunda carta
    setIsClickable(true); // Permite cliques nas cartas
    setGameStarted(false); // Reseta o estado de início do jogo

    const storedPlayerName = localStorage.getItem("player");
    if (storedPlayerName) {
      setPlayerName(storedPlayerName); // Obtém o nome do jogador do localStorage
    }
  };

  // Temporizador para controlar o tempo do jogo
  useEffect(() => {
    if (!gameFinished) {
      const id = setInterval(() => {
        setTime((prev) => prev + 1); // Incrementa o tempo a cada segundo
      }, 1000);
      setIntervalId(id); // Salva o ID do intervalo

      return () => clearInterval(id); // Limpa o intervalo quando o jogo termina ou o componente desmonta
    }
  }, [gameFinished]);

  // Verifica se o jogo terminou ao atualizar o estado das cartas
  useEffect(() => {
    checkEndGame();
  }, [cards]);

  // Função de clique em uma carta
  const handleCardClick = (card: HTMLElement) => {
    if (!isClickable || firstCard === card || secondCard === card) return; // Bloqueia o clique se já houver cartas viradas

    card.classList.add("reveal-card"); // Adiciona a classe para virar a carta

    if (!firstCard) {
      setFirstCard(card); // Define a primeira carta virada
      setGameStarted(true); // Marca o jogo como iniciado
    } else {
      setSecondCard(card); // Define a segunda carta virada
      setIsClickable(false); // Desativa os cliques até verificar as cartas
      checkCards(card); // Verifica se as duas cartas são iguais
    }
  };

  // Função para verificar se as duas cartas viradas são iguais
  const checkCards = (secondCard: HTMLElement) => {
    const firstCharacter = firstCard?.getAttribute("data-character");
    const secondCharacter = secondCard.getAttribute("data-character");

    if (firstCharacter === secondCharacter) {
      setCards((prevCards) => {
        return prevCards.map((card) =>
          card.name === firstCharacter || card.name === secondCharacter
            ? { ...card, correct: true } // Marca as cartas como corretas
            : card
        );
      });
      resetCards(); // Reseta as cartas viradas
    } else {
      setTimeout(() => {
        firstCard?.classList.remove("reveal-card"); // Desvira a primeira carta
        secondCard.classList.remove("reveal-card"); // Desvira a segunda carta
        resetCards(); // Reseta as cartas viradas
      }, 1000);
    }

    checkEndGame(); // Verifica se o jogo terminou após a atualização do estado
  };

  // Função para resetar as cartas selecionadas e permitir novos cliques
  const resetCards = () => {
    setFirstCard(null); // Reseta a primeira carta
    setSecondCard(null); // Reseta a segunda carta
    setIsClickable(true); // Permite cliques novamente
  };

  // Função para verificar se o jogo terminou
  const checkEndGame = () => {
    if (gameStarted && cards.every((card) => card.correct)) {
      setGameFinished(true); // Marca o jogo como finalizado
      if (intervalId) clearInterval(intervalId); // Para o temporizador
      alert(`Parabéns, ${playerName}! Seu tempo foi de: ${time} segundos!`); // Exibe uma mensagem de vitória
    }
  };

  // Função para reiniciar o jogo
  const handleRestart = () => {
    iniciarJogo(); // Reinicia o jogo
    document.querySelectorAll(".card").forEach((card) => {
      card.classList.remove("reveal-card"); // Desvira todas as cartas
    });
    setTime(0); // Reseta o tempo
    setGameFinished(false); // Reseta o estado de finalização do jogo
    setGameStarted(false); // Reseta o estado de início do jogo
  };

  return (
    <main>
      <header>
        <div>
          <span>Jogador: {playerName}</span>
        </div>
        <div>
          <span>Tempo: {time}s</span>
        </div>
      </header>
      <div className="grid">
        {cards.map((character, index) => (
          <div
            key={index}
            className="card"
            data-character={character.name}
            onClick={(e) => handleCardClick(e.currentTarget)}
          >
            <div
              className={`face front ${
                character.correct ? "correct-card" : ""
              }`}
              style={{ backgroundImage: `url(${character.img})` }}
            ></div>
            <div className="face back"></div>
          </div>
        ))}
      </div>

      {gameFinished && (
        <div className="game-finished">
          <button onClick={handleRestart} className="login__button">
            Reiniciar Jogo
          </button>
        </div>
      )}
    </main>
  );
};

export default Game;
