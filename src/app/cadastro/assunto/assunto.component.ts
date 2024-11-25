import {Component, OnInit} from '@angular/core';
import {DialogService} from 'primeng/dynamicdialog';
import {Assunto} from "./assunto";
import {ButtonDirective} from "primeng/button";
import {ConfirmationService, MessageService, PrimeTemplate} from "primeng/api";
import {TableModule} from "primeng/table";
import {ToolbarModule} from "primeng/toolbar";
import {AssuntoService} from "./assunto.service";
import {DialogModule} from "primeng/dialog";
import {ChipsModule} from "primeng/chips";
import {FormsModule} from "@angular/forms";
import {NgClass, NgIf} from "@angular/common";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ToastModule} from "primeng/toast";

@Component({
  selector: 'app-assunto',
  templateUrl: './assunto.component.html',
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
export class AssuntoComponent implements OnInit {

  assuntos: Assunto[] = [];
  assunto: Assunto = new Assunto();
  cadastroDialog: boolean = false;
  titleCadastroDialog: string = '';
  submitted: boolean = false;

  constructor(private readonly assuntoService: AssuntoService,
              private readonly messageService: MessageService,
              private readonly confirmationService: ConfirmationService) {
  }

  ngOnInit(): void {
    this.listarAssuntos();
  }

  listarAssuntos(): void {
    this.assuntoService.getAssuntos()
      .subscribe((data) => {
        this.assuntos = data.sort((a, b) => a.cod - b.cod);
      });
  }

  abrirCadastroDialog(item?: Assunto): void {
    this.titleCadastroDialog = item ? 'Editar Assunto' : 'Novo Assunto';
    this.assunto = item ? {...item} : new Assunto();
    this.cadastroDialog = true;
    this.submitted = false;
  }

  fecharDialog(): void {
    this.cadastroDialog = false;
    this.submitted = false;
  }

  validarSalvar(): void {
    this.submitted = true;

    if (this.assunto.descricao) {
      this.salvarAssunto();
    }
  }

  salvarAssunto() {
    this.assuntoService.salvarAssunto(this.assunto).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Assunto cadastrado com sucesso!',
          life: 3000
        });
        this.cadastroDialog = false;
        this.submitted = false;
        this.listarAssuntos();
      },
      error: (err) => {
        const mensagem = err?.error?.message || 'Ocorreu um erro inesperado.';

        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: mensagem,
          life: 5000
        });
      }
    });
  }

  deletarAssunto(cod: number): void {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir este assunto?',
      header: 'Exclusão',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.assuntoService.deletarAssunto(cod)
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Assunto excluído com sucesso!'
              });
              this.listarAssuntos();
            },
            error: (err) => {
              const mensagem = err?.error?.message || 'Ocorreu um erro inesperado ao tentar excluir o assunto.';

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
