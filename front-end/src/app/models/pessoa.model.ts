export interface Pessoa {
  idPessoa: number;
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

export interface PessoaDTO {
  idPessoa?: number;
  nome: string;
  cpf: string;
  datanascimento: string;
  dataCriacao?: string;
  telefone: string;
  email: string;
  senha?: string;
  status: number;
  funcaoPessoa: number[];
}