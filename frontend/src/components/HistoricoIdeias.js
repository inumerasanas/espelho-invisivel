import { useState } from "react";
import { Eye, EyeOff } from "lucide-react"; // ícones minimalistas lindos

function HistoricoIdeias({ ideias }) {
  const [mostrarHistorico, setMostrarHistorico] = useState(false);

  if (!ideias || ideias.length === 0) return null;

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

  return (
    <div className="max-w-xl mx-auto mt-8">
      <button
        onClick={() => setMostrarHistorico(!mostrarHistorico)}
        className="flex items-center gap-2 text-purple-600 font-semibold hover:underline mb-4"
      >
        {mostrarHistorico ? <EyeOff size={20} /> : <Eye size={20} />}
        {mostrarHistorico ? "Esconder histórico" : "Mostrar histórico"}
      </button>

      {mostrarHistorico && (
        <div className="transition-all duration-300">
          {ideias.map((ideia) => (
            <div
              key={ideia._id}
              className="mb-4 p-4 bg-white border rounded shadow-sm"
            >
              <p className="text-gray-800">{ideia.mensagem}</p>
              {ideia.resposta && (
                <p className="mt-2 italic text-purple-600">
                  Espelho diz: “{ideia.resposta}”
                </p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                {formatarData(ideia.data)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HistoricoIdeias;
