import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaEntidadComponent } from './lista-entidad/lista-entidad.component';

const routes: Routes = [
  {
    path: '', children: [
      { path:'entidad', component: ListaEntidadComponent},
      { path: '**', redirectTo: ''}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MantenimientoRoutingModule { }
