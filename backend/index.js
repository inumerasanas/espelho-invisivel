require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

// Conexão com MongoDB
const uri = process.env.MONGODB_URI;
console.log("Tentando conectar com URI:", uri);

mongoose.connect(uri)
  .then(() => console.log("Conectado ao MongoDB"))
  .catch((err) => console.error("Erro na conexão com o MongoDB:", err));

// Modelo Mongoose
const Ideia = mongoose.model("Ideia", {
  mensagem: String,
  resposta: String,
  data: { type: Date, default: Date.now },
});

// Fallback local
function gerarRespostaPoeticaLocal() {
  const respostasPoeticas = [
    "A tua palavra dança com as folhas do tempo.",
    "Há ecos de luz mesmo nos silêncios mais densos.",
    "Tua voz sem som desenha constelações na alma.",
    "O invisível também floresce onde há verdade.",
    "Hoje, até o silêncio te ouve com carinho.",
    "A tristeza se deita, mas a esperança já acordou.",
    "Teus pensamentos escrevem poesia no vento.",
    "A alma sussurra verdades que os lábios calam.",
    "O espelho não mostra tudo — há reflexos que sentem.",
    "Na pausa da tua respiração, o universo escuta.",
    "As palavras que não disseste germinam em silêncio.",
    "Cada cicatriz é uma estrela no mapa do teu ser.",
    "O tempo dobra onde a emoção é intensa.",
    "Tua presença desenha auroras no vazio.",
    "Até os ruídos carregam mensagens do coração.",
    "A solidão te visita só para lembrar quem tu és.",
    "Há beleza no inacabado, no que ainda pulsa.",
    "O que não se vê, muitas vezes é o que mais cura.",
    "O espelho é apenas um portal para o que vibra por dentro.",
    "Há um poema escondido em cada gesto teu.",
  ];
  const indice = Math.floor(Math.random() * respostasPoeticas.length);
  return respostasPoeticas[indice];
}

// IA ou fallback
async function gerarRespostaPoetica(mensagem) {
  try {
    const respostaIA = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: mensagem,
      temperature: 0.9,
      max_tokens: 150,
    });
    return respostaIA.data.choices[0].text.trim();
  } catch (err) {
    console.error("Erro na API OpenAI:", err);
    return gerarRespostaPoeticaLocal();
  }
}

// Cria e salva ideia
app.post("/ideias", async (req, res) => {
  const novaResposta = await gerarRespostaPoetica(req.body.mensagem);
  const novaIdeia = new Ideia({
    mensagem: req.body.mensagem,
    resposta: novaResposta,
  });
  await novaIdeia.save();
  res.json(novaIdeia);
});

// Gera resposta sem salvar
app.post("/espelho", async (req, res) => {
  const { mensagem } = req.body;
  if (!mensagem) {
    return res.status(400).json({ erro: "Mensagem é obrigatória" });
  }

  const resposta = await gerarRespostaPoetica(mensagem);

  res.json({
    mensagem,
    resposta,
    data: new Date(),
  });
});

// Lista ideias
app.get("/ideias", async (req, res) => {
  const ideias = await Ideia.find().sort({ data: -1 });
  res.json(ideias);
});

// Regerar resposta
app.put("/ideias/:id/refletir", async (req, res) => {
  const ideia = await Ideia.findById(req.params.id);
  if (!ideia) {
    return res.status(404).json({ erro: "Ideia não encontrada" });
  }
  const novaResposta = await gerarRespostaPoetica(ideia.mensagem);
  ideia.resposta = novaResposta;
  await ideia.save();
  res.json(ideia);
});

// Start
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT} 🚀`);
});
