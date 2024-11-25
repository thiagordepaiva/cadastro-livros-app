import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {ButtonDirective} from "primeng/button";
import {MenubarModule} from "primeng/menubar";
import {MenuItem, MessageService} from "primeng/api";
import {LivroService} from "./cadastro/livro/livro.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ButtonDirective,
    MenubarModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  menuItems: MenuItem[] = [];

  constructor(private readonly livroService: LivroService,
              private readonly messageService: MessageService) {
  }

  ngOnInit() {
    this.menuItems = [
      {
        label: 'Cadastros',
        items: [
          {label: 'Assunto', icon: 'pi pi-tag', routerLink: '/cadastros/assunto'},
          {label: 'Autor', icon: 'pi pi-user', routerLink: '/cadastros/autor'},
          {label: 'Livro', icon: 'pi pi-book', routerLink: '/cadastros/livro'},
        ],
      },
      {
        label: 'Relatórios',
        items: [
          {label: 'Livros', icon: 'pi pi-book', command: () => this.abrirRelatorio()},
        ],
      },
    ];
  }

  abrirRelatorio(): void {
    this.livroService.gerarRelatorio()
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          window.open(url, '_blank');
          setTimeout(() => window.URL.revokeObjectURL(url), 100);
        },
        error: (err) => {
          const mensagem = err?.error?.message || 'Ocorreu um erro inesperado ao tentar gerar o relatório.';

          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: mensagem,
            life: 5000
          });
        }
      });
  }
}
