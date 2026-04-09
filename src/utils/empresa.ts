import { EMPRESAS, type Empresa, type EmpresaId } from "../data/empresa";

export const getEmpresaById = (empresaId?: string): Empresa => {
  const empresaNormalizada = (empresaId || "LOGGI").trim().toUpperCase() as EmpresaId;

  return (
    EMPRESAS.find((empresa) => empresa.id === empresaNormalizada) || EMPRESAS[0]
  );
};