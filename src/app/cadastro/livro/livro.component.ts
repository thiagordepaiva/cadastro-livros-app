import {Component, OnInit} from '@angular/core';
import {DialogService} from 'primeng/dynamicdialog';
import {ButtonDirective} from "primeng/button";
import {ConfirmationService, MessageService, PrimeTemplate} from "primeng/api";
import {TableModule} from "primeng/table";
import {ToolbarModule} from "primeng/toolbar";
import {DialogModule} from "primeng/dialog";
import {ChipsModule} from "primeng/chips";
import {FormsModule} from "@angular/forms";
import {NgClass, NgIf} from "@angular/common";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ToastModule} from "primeng/toast";
import {LivroService} from "./livro.service";
import {Livro} from "./livro";
import {MultiSelectModule} from "primeng/multiselect";
import {Autor} from "../autor/autor";
import {Assunto} from "../assunto/assunto";
import {AutorService} from "../autor/autor.service";
import {AssuntoService} from "../assunto/assunto.service";

@Component({
  selector: 'app-livro',
  templateUrl: './livro.component.html',
  standalone: true,
  imports: [
    ButtonDirective,
    PrimeTemplate,
    TableModule,
    ToolbarModule,
    DialogModule,
    ChipsModule,
    FormsModule,
    NgClass,
    NgIf,
    ConfirmDialogModule,
    ToastModule,
    MultiSelectModule
  ],
  providers: [DialogService, ConfirmationService]
})
export class LivroComponent implements OnInit {

  livros: Livro[] = [];
  autores: Autor[] = [];
  assuntos: Assunto[] = [];

  livro: Livro = new Livro();
  cadastroDialog: boolean = false;
  titleCadastroDialog: string = '';
  submitted: boolean = false;

  valor: string = '';
  currentYear: number = new Date().getFullYear();

  constructor(private readonly livroService: LivroService,
              private readonly autorService: AutorService,
              private readonly assuntoService: AssuntoService,
              private readonly messageService: MessageService,
              private readonly confirmationService: ConfirmationService) {
  }

  ngOnInit(): void {
    this.listarLivros();
    this.preencherAutores();
    this.preencherAssuntos();
  }

  listarLivros(): void {
    this.livroService.getLivros()
      .subscribe((data) => {
        this.livros = data.sort((a, b) => a.cod - b.cod);
      });
  }

  abrirCadastroDialog(item?: Livro): void {
    this.titleCadastroDialog = item ? 'Editar Livro' : 'Novo Livro';

    if (!item) {
      this.livro = new Livro();
    } else {
      this.livro = {...item};
      this.livro.autores = item.livroAutores.map((a) => a.autor);
      this.livro.assuntos = item.livroAssuntos.map((a) => a.assunto);
    }

    this.cadastroDialog = true;
    this.submitted = false;
  }

  fecharDialog(): void {
    this.cadastroDialog = false;
    this.submitted = false;
  }

  validarSalvar(): void {
    this.submitted = true;
    let podeSalvar = true;

    if (!this.livro.titulo) {
      podeSalvar = false;
    }

    if (!this.livro.editora) {
      podeSalvar = false;
    }

    if (!this.livro.edicao) {
      podeSalvar = false;
    }

    if (!this.livro.anoPublicacao) {
      podeSalvar = false;
    }

    if (!this.livro.isbn) {
      podeSalvar = false;
    }

    if (!this.livro.valor) {
      podeSalvar = false;
    }

    if (this.livro.assuntos.length === 0) {
      podeSalvar = false;
    }

    if (this.livro.autores.length === 0) {
      podeSalvar = false;
    }

    if (podeSalvar) {
      this.salvarLivro();
    }
  }

  salvarLivro() {
    this.handleLivroAutor();
    this.handleLivroAssunto();

    this.livroService.salvarLivro(this.livro)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Livro cadastrado com sucesso!',
            life: 3000
          });

          this.cadastroDialog = false;
          this.submitted = false;
          this.valor = '';
          this.listarLivros();
        },
        error: (err) => {
          const mensagem = err?.error?.message || 'Ocorreu um erro inesperado ao tentar salvar o livro.';

          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: mensagem,
            life: 5000
          });
        }
      });
  }

  private handleLivroAutor() {
    this.livro.autores.forEach((a) => {
      if (!this.livro.livroAutores.find((la) => la.autor.cod === a.cod)) {
        this.livro.livroAutores.push({autor: a});
      }
    });

    this.livro.livroAutores = this.livro.livroAutores.filter((la) =>
      la.autor.cod === this.livro.autores.find((a) => a.cod === la.autor.cod)?.cod);
  }

  private handleLivroAssunto() {
    this.livro.assuntos.forEach((a) => {
      if (!this.livro.livroAssuntos.find((la) => la.assunto.cod === a.cod)) {
        this.livro.livroAssuntos.push({assunto: a});
      }
    });

    this.livro.livroAssuntos = this.livro.livroAssuntos.filter((la) =>
      la.assunto.cod === this.livro.assuntos.find((a) => a.cod === la.assunto.cod)?.cod);
  }

  deletarLivro(cod: number): void {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir este autor?',
      header: 'Exclusão',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.livroService.deletarLivro(cod)
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Autor excluído com sucesso!'
              });
              this.listarLivros();
            },
            error: (err) => {
              const mensagem = err?.error?.message || 'Ocorreu um erro inesperado ao tentar excluir o livro.';

              this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: mensagem,
                life: 5000
              });
            }
          });
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Cancelado',
          detail: 'A exclusão foi cancelada.'
        });
      }
    });
  }

  private preencherAutores(): void {
    this.autorService.getAutores()
      .subscribe((data) =>
        this.autores = data.sort((a, b) => a.cod - b.cod));
  }

  private preencherAssuntos(): void {
    this.assuntoService.getAssuntos()
      .subscribe((data) =>
        this.assuntos = data.sort((a, b) => a.cod - b.cod));
  }

  preventDecimal(event: KeyboardEvent): void {
    if (event.key === '.' || event.key === ',') {
      event.preventDefault();
    }
  }

  formatarValorMonetario(): void {
    let valor: string = this.valor.replace(/\D/g, '');

    if (valor) {
      this.livro.valor = parseInt(valor, 10);

      valor = (parseInt(valor, 10) / 100).toFixed(2).replace('.', ',');

      valor = valor.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

    this.valor = 'R$ ' + valor;
  }

  bloquearCaracteresInvalidos(event: KeyboardEvent): void {
    const char = event.key;

    if (!/^[0-9]$/.test(char) && !['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'].includes(char)) {
      event.preventDefault();
    }
  }
}
