import { useState } from "react";
import axios from "axios";

export default function Espelho() {
  const [mensagem, setMensagem] = useState("");
  const [resposta, setResposta] = useState("");

  const enviarMensagem = async () => {
    try {
      const res = await axios.post("http://localhost:3001/api/espelho", {
        mensagem,
      });
      setResposta(res.data.resposta);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      setResposta("Erro ao conectar com o espelho...");
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto text-center">
      <textarea
        className="w-full p-3 border rounded shadow"
        rows="4"
        placeholder="O que você quer ver em você hoje?"
        value={mensagem}
        onChange={(e) => setMensagem(e.target.value)}
      />
      <button
        className="mt-2 bg-purple-600 text-white px-4 py-2 rounded"
        onClick={enviarMensagem}
      >
        Refletir
      </button>

      {resposta && (
        <div className="mt-6 p-4 bg-gray-100 border rounded shadow">
          <p className="italic whitespace-pre-wrap">{resposta}</p>
        </div>
      )}
    </div>
  );
}
