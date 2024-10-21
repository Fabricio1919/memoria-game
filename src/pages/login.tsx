import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import cerebroImg from "../images/cerebro.jpg";

const Login: React.FC = () => {
  const [player, setPlayer] = useState(""); // Estado para armazenar o nome do jogador
  const [error, setError] = useState(""); // Estado para armazenar mensagens de erro
  const navigate = useNavigate(); // Hook para navegar entre rotas

  // Função para lidar com o envio do formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Previne o comportamento padrão do formulário
    if (player.trim()) {
      localStorage.setItem("player", player); // Armazena o nome do jogador no localStorage
      navigate("/game"); // Redireciona para a página do jogo
    } else {
      setError("Por favor, insira seu nome."); // Define a mensagem de erro se o nome estiver vazio
    }
  };

  return (
    <div className="login-container">
      <div className="login__header">
        <h1>Login</h1>
        <img src={cerebroImg} alt="Cérebro" className="login__image" />{" "}
        {/* Exibe a imagem */}
      </div>
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Digite seu nome"
          value={player} // Valor atual do nome do jogador
          onChange={(e) => {
            setPlayer(e.target.value); // Atualiza o estado do nome do jogador
            setError(""); // Limpa a mensagem de erro ao digitar
          }}
          className="login__input"
        />
        {error && <p className="error-message">{error}</p>}{" "}
        {/* Exibe a mensagem de erro se houver */}
        <button
          type="submit"
          className="login__button"
          disabled={!player.trim()} // Desabilita o botão se o nome estiver vazio
        >
          Entrar
        </button>
      </form>
    </div>
  );
};

export default Login;
