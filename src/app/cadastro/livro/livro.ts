import {LivroAssunto} from "./livro-assunto";
import {LivroAutor} from "./livro-autor";
import {Autor} from "../autor/autor";
import {Assunto} from "../assunto/assunto";

export class Livro {
  cod: number;
  titulo: string;
  editora: string;
  edicao: number;
  anoPublicacao: number;
  isbn: string;

  valor: number;
  valorFormatado: string;

  autores: Autor[];
  assuntos: Assunto[];
  livroAutores: LivroAutor[];
  livroAssuntos: LivroAssunto[];

  constructor() {
    this.livroAutores = [];
    this.livroAssuntos = [];
    this.autores = [];
    this.assuntos = [];
  }
}
