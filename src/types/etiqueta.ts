export type TipoEtiqueta = "Saca" | "Avulso" | "Palet";

export interface Etiqueta {
  motorista: string;
  cidade: string;
  empresa: string;
  pos: string;
  num: number;
  data: string;
  tipo: TipoEtiqueta;
}