const mongoose = require("mongoose");

const ideiaSchema = new mongoose.Schema({
  mensagem: String,
  resposta: String,
  data: Date
});

module.exports = mongoose.model("Ideia", ideiaSchema);
