const express = require("express");
const router = express.Router();
const Ideia = require("../models/ideia.model");


function gerarRespostaPoetica(texto) {
  const respostas = [
    "O espelho silencia, mas te entende 🌫️",
    "Nas entrelinhas da sua ideia, nasceu um novo universo ✨",
    "A luz que você plantou vai brilhar quando menos esperar 🔮",
    "Você não escreveu... você encantou 🌙",
    "Palavras são sementes. Essa, brotou em mim 🌱",
    "O silêncio também tem voz.",
    "Na dúvida, sinta com o coração.",
    "Cada pensamento é uma flor esperando a primavera.",
    "Até a escuridão tem uma dança própria.",
    "Seu sentir é um mapa de estrelas ocultas.",
    "A tua palavra dança com as folhas do tempo.",
    "Há ecos de luz mesmo nos silêncios mais densos.",
    "Tua voz sem som desenha constelações na alma.",
    "O invisível também floresce onde há verdade.",
    "Hoje, até o silêncio te ouve com carinho.",
    "A tristeza se deita, mas a esperança já acordou."
  ];

  // No futuro isso pode virar uma chamada real de IA!
  return respostas[Math.floor(Math.random() * respostas.length)];
}

router.post("/", async (req, res) => {
  const { mensagem } = req.body;

  if (!mensagem) {
    return res.status(400).json({ erro: "Mensagem vazia" });
  }

  const resposta = gerarRespostaPoetica(mensagem);

  const novaIdeia = new Ideia({
    mensagem,
    resposta,
    data: new Date()
  });

  await novaIdeia.save();

  res.status(201).json(novaIdeia);
});

router.get("/", async (req, res) => {
  const ideias = await Ideia.find().sort({ data: -1 });
  res.json(ideias);
});

module.exports = router;
