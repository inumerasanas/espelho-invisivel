import { useEffect, useState } from "react";
import axios from "axios";
import HistoricoIdeias from "./components/HistoricoIdeias";
import LoadingEspelho from "./components/LoadingEspelho";

function App() {
  const [mensagem, setMensagem] = useState("");
  const [ideias, setIdeias] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [refletindo, setRefletindo] = useState(false);

  const enviarIdeia = async () => {
    if (!mensagem.trim()) return;

    setCarregando(true);

    // Simula um tempinho mágico de reflexão
    setTimeout(async () => {
      await axios.post("http://localhost:3001/ideias", { mensagem });
      setMensagem("");
      await carregarIdeias();
      setCarregando(false);
    }, 2000);
  };

  const carregarIdeias = async () => {
    const resposta = await axios.get("http://localhost:3001/ideias");
    setIdeias(resposta.data);
  };

  useEffect(() => {
    carregarIdeias();
  }, []);

  const formatarData = (dataISO) => {
    const data = new Date(dataISO);
    return data.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const ultimaIdeia = ideias[0];
  const ideiasAnteriores = ideias.slice(1);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100 p-6">
      <h1 className="text-4xl font-bold text-center text-purple-800 mb-6">
        Espelho Invisível 🪞✨
      </h1>

      <div className="max-w-xl mx-auto mb-8">
        <textarea
          className="w-full p-4 border border-purple-300 rounded shadow focus:outline-none focus:ring-2 focus:ring-purple-400"
          placeholder="O que você está sentindo agora?"
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          rows={3}
          disabled={carregando}
        />
        <button
          onClick={enviarIdeia}
          disabled={carregando}
          className="mt-3 px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-all disabled:opacity-50"
        >
          Enviar para o espelho
        </button>
      </div>

      {carregando && (
        <div className="max-w-xl mx-auto mb-8">
          <LoadingEspelho />
        </div>
      )}

      {!carregando && (
        <div className="max-w-xl mx-auto">
          {ultimaIdeia && (
            <div className="mb-4 p-4 bg-white border rounded shadow-sm">
              <p className="text-lg font-medium text-gray-800">
                {ultimaIdeia.mensagem}
              </p>

              {ultimaIdeia.resposta && (
                <p className="mt-2 italic text-purple-600">
                  Espelho diz: “{ultimaIdeia.resposta}”
                </p>
              )}

              <p className="text-sm text-gray-400 mt-1">
                {formatarData(ultimaIdeia.data)}
              </p>

              <button
  onClick={async () => {
    setRefletindo(true);

    setTimeout(async () => {
      const resposta = await axios.put(
        `http://localhost:3001/ideias/${ultimaIdeia._id}/refletir`
      );

      setIdeias((ideiasAntigas) =>
        ideiasAntigas.map((i) =>
          i._id === resposta.data._id ? resposta.data : i
        )
      );

      setRefletindo(false);
    }, 2000); // Espera mágica de 2 segundos ✨
  }}
  className="text-sm text-purple-500 mt-2 hover:underline flex items-center gap-2"
>
  {refletindo ? (
    <LoadingEspelho />
  ) : (
    <>
      Nova reflexão
    </>
  )}
</button>

            </div>
          )}
        </div>
      )}

      <HistoricoIdeias ideias={ideiasAnteriores} />
    </div>
  );
}

export default App;
