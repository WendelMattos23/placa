import loggiLogo from "../assets/logos/loggi.png";
import imileLogo from "../assets/logos/imile.png";
import totalExpressLogo from "../assets/logos/totalexpress.png";

export type EmpresaId = "LOGGI" | "IMILE" | "TOTALEXPRESS";

export interface Empresa {
  id: EmpresaId;
  nome: string;
  permiteAvulso: boolean;
  permitePalet: boolean;
  logo: string;
}

export const EMPRESAS: Empresa[] = [
  {
    id: "LOGGI",
    nome: "LOGGI",
    permiteAvulso: true,
    permitePalet: true,
    logo: loggiLogo,
  },
  {
    id: "IMILE",
    nome: "IMILE",
    permiteAvulso: true,
    permitePalet: false,
    logo: imileLogo,
  },
  {
    id: "TOTALEXPRESS",
    nome: "TOTALEXPRESS",
    permiteAvulso: false,
    permitePalet: true,
    logo: totalExpressLogo,
  },
];