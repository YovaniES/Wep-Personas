import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistroEventoComponent } from './registro-evento/registro-evento.component';

const routes: Routes = [
  {
    path: '', children: [
      { path: 'lista', component: RegistroEventoComponent },
      { path: '**', redirectTo: ''}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventoRoutingModule { }
