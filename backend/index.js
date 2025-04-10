const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Conexão com o MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/free-criatividade");

// Modelo de ideia
const Ideia = mongoose.model("Ideia", {
  mensagem: String,
  resposta: String,
  data: { type: Date, default: Date.now },
});

// Função para gerar uma resposta poética (simulada)
function gerarRespostaPoetica(mensagem) {
  const respostasPoeticas = [
    "A tua palavra dança com as folhas do tempo.",
    "Há ecos de luz mesmo nos silêncios mais densos.",
    "Tua voz sem som desenha constelações na alma.",
    "O invisível também floresce onde há verdade.",
    "Hoje, até o silêncio te ouve com carinho.",
    "A tristeza se deita, mas a esperança já acordou.",
  ];
  const indice = Math.floor(Math.random() * respostasPoeticas.length);
  return respostasPoeticas[indice];
}

// Rota para salvar nova ideia
app.post("/ideias", async (req, res) => {
  const novaResposta = gerarRespostaPoetica(req.body.mensagem);
  const novaIdeia = new Ideia({
    mensagem: req.body.mensagem,
    resposta: novaResposta,
  });
  await novaIdeia.save();
  res.json(novaIdeia);
});

// Rota para listar ideias
app.get("/ideias", async (req, res) => {
  const ideias = await Ideia.find().sort({ data: -1 });
  res.json(ideias);
});

// 🆕 Rota para gerar nova reflexão
app.put("/ideias/:id/refletir", async (req, res) => {
  const ideia = await Ideia.findById(req.params.id);
  if (!ideia) {
    return res.status(404).json({ erro: "Ideia não encontrada" });
  }
  const novaResposta = gerarRespostaPoetica(ideia.mensagem);
  ideia.resposta = novaResposta;
  await ideia.save();
  res.json(ideia);
});

app.listen(3001, () => {
  console.log("Servidor rodando na porta 3001 🚀");
});
