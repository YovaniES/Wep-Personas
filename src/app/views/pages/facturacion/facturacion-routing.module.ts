import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LiquidacionComponent } from './liquidacion/liquidacion.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'ventas', component: LiquidacionComponent },
      { path: '**', redirectTo: '' }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FacturacionRoutingModule {}
