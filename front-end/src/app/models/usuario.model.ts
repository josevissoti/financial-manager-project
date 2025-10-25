export interface Usuario {
  idUsuario: number;
  nome: string;
  cpf: string;
  datanascimento: string;
  dataCriacao: string;
  telefone: string;
  email: string;
  senha: string;
  status: number;
  funcaoPessoa: number[];
}

export interface Admin {
  idAdmin: number;
  nome: string;
  cpf: string;
  datanascimento: string;
  dataCriacao: string;
  telefone: string;
  email: string;
  senha: string;
  status: number;
  funcaoPessoa: number[];
}