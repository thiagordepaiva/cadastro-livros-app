import {Component, OnInit} from '@angular/core';
import {DialogService} from 'primeng/dynamicdialog';
import {Autor} from "./autor";
import {ButtonDirective} from "primeng/button";
import {ConfirmationService, MessageService, PrimeTemplate} from "primeng/api";
import {TableModule} from "primeng/table";
import {ToolbarModule} from "primeng/toolbar";
import {AutorService} from "./autor.service";
import {DialogModule} from "primeng/dialog";
import {ChipsModule} from "primeng/chips";
import {FormsModule} from "@angular/forms";
import {NgClass, NgIf} from "@angular/common";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ToastModule} from "primeng/toast";

@Component({
  selector: 'app-autor',
  templateUrl: './autor.component.html',
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
    ToastModule
  ],
  providers: [DialogService, ConfirmationService]
})
export class AutorComponent implements OnInit {

  autores: Autor[] = [];
  autor: Autor = new Autor();
  cadastroDialog: boolean = false;
  titleCadastroDialog: string = '';
  submitted: boolean = false;

  constructor(private readonly autorService: AutorService,
              private readonly messageService: MessageService,
              private readonly confirmationService: ConfirmationService) {
  }

  ngOnInit(): void {
    this.listarAutores();
  }

  listarAutores(): void {
    this.autorService.getAutores()
      .subscribe((data) => {
        this.autores = data.sort((a, b) => a.cod - b.cod);
      });
  }

  abrirCadastroDialog(item?: Autor): void {
    this.titleCadastroDialog = item ? 'Editar Autor' : 'Novo Autor';
    this.autor = item ? {...item} : new Autor();
    this.cadastroDialog = true;
    this.submitted = false;
  }

  fecharDialog(): void {
    this.cadastroDialog = false;
    this.submitted = false;
  }

  validarSalvar(): void {
    this.submitted = true;

    if (this.autor.nome) {
      this.salvarAutor();
    }
  }

  salvarAutor() {
    this.autorService.salvarAutor(this.autor).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Autor cadastrado com sucesso!',
          life: 3000
        });
        this.cadastroDialog = false;
        this.submitted = false;
        this.listarAutores();
      },
      error: (err) => {
        const mensagem = err?.error?.message || 'Ocorreu um erro inesperado ao tentar Salvar o Autor.';
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: mensagem,
          life: 5000
        });
      }
    });
  }

  deletarAutor(cod: number): void {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir este autor?',
      header: 'Exclusão',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.autorService.deletarAutor(cod)
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Autor excluído com sucesso!'
              });
              this.listarAutores();
            },
            error: (err) => {
              const mensagem = err?.error?.message || 'Ocorreu um erro inesperado ao tentar excluir o autor.';

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
}
