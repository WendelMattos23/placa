import type { Etiqueta, TipoEtiqueta } from "../types/etiqueta";

/**
 * Retorna a data atual (HOJE) no formato pt-BR
 * 👉 NÃO adiciona mais 1 dia
 */
export const getDataViagem = () => {
  const hoje = new Date();
  return hoje.toLocaleDateString("pt-BR");
};

/**
 * Cria as etiquetas do lote
 */
export const criarEtiquetas = ({
  quantidade,
  tipo,
  total,
  numeroInicial,
  motorista,
  cidade,
  empresa,
  data,
}: {
  quantidade: number;
  tipo: TipoEtiqueta;
  total: number;
  numeroInicial: number;
  motorista: string;
  cidade: string;
  empresa: string;
  data: string;
}): Etiqueta[] => {
  return Array.from({ length: quantidade }, (_, index) => ({
    motorista,
    cidade,
    empresa,
    pos: `${index + 1} / ${total}`,
    num: numeroInicial + index,
    data,
    tipo,
  }));
};