import { FaRegEye } from "react-icons/fa";
import { TypeAnimation } from "react-type-animation";

export default function LoadingEspelho() {
  return (
    <div className="flex items-center justify-center gap-3 animate-fadeIn transition-opacity duration-500">
      <FaRegEye className="animate-spin-slow text-purple-600 text-3xl" />
      <TypeAnimation
        sequence={[
          "O espelho está refletindo sua essência...",1500,
          "Luz interna em processo de tradução...",1500,
          "Sinta, respire, confie...",1000,
          "o espelho está refletindo...", 1000,
          "buscando no fundo da alma...", 1000,
          "preparando uma nova visão...", 1000,
        ]}
        wrapper="span"
        speed={70}
        repeat={Infinity}
        className="text-purple-600 italic text-md"
      />
    </div>
  );
}
