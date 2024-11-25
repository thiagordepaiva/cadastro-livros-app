import {Routes} from '@angular/router';
import {AutorComponent} from "./cadastro/autor/autor.component";
import {AssuntoComponent} from "./cadastro/assunto/assunto.component";
import {LivroComponent} from "./cadastro/livro/livro.component";

export const routes: Routes = [
  {path: 'cadastros/autor', component: AutorComponent},
  {path: 'cadastros/assunto', component: AssuntoComponent},
  {path: 'cadastros/livro', component: LivroComponent},
  {path: '', redirectTo: '/cadastros/livro', pathMatch: 'full'},
];
