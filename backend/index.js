require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Conectado ao MongoDB"))
  .catch((err) => console.error("Erro na conexão com o MongoDB:", err));

const Ideia = mongoose.model("Ideia", {
  mensagem: String,
  resposta: String,
  data: { type: Date, default: Date.now },
});

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

app.post("/ideias", async (req, res) => {
  const novaResposta = gerarRespostaPoetica(req.body.mensagem);
  const novaIdeia = new Ideia({
    mensagem: req.body.mensagem,
    resposta: novaResposta,
  });
  await novaIdeia.save();
  res.json(novaIdeia);
});

app.get("/ideias", async (req, res) => {
  const ideias = await Ideia.find().sort({ data: -1 });
  res.json(ideias);
});

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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT} 🚀`);
});