import type { Etiqueta } from "../types/etiqueta";
import "../styles/etiqueta.css";

interface EtiquetaCardProps {
  etiqueta: Etiqueta;
}

const EtiquetaCard = ({ etiqueta }: EtiquetaCardProps) => {
  const tipoClass = `tipo-${etiqueta.tipo.toLowerCase()}`;

  return (
    <article className="etiqueta-card">
      <div className="etiqueta-card__header">
        <span className={`etiqueta-card__tag ${tipoClass}`}>{etiqueta.tipo}</span>
      </div>

      <div className="etiqueta-card__body">
        <h3 className="etiqueta-card__motorista">{etiqueta.motorista}</h3>
        <p className="etiqueta-card__cidade">{etiqueta.cidade}</p>

        <div className="etiqueta-card__info">
          <span className="etiqueta-card__empresa">{etiqueta.empresa}</span>
          <span className="etiqueta-card__posicao">{etiqueta.pos}</span>
        </div>
      </div>

      <div className="etiqueta-card__footer">
        <span>
          Etiqueta #{etiqueta.num} • {etiqueta.data}
        </span>
      </div>
    </article>
  );
};

export default EtiquetaCard;