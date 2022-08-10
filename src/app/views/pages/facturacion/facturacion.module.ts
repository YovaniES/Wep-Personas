import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FacturacionRoutingModule } from './facturacion-routing.module';
import { VentasComponent } from './ventas/ventas.component';
import { ActualizarLiquidacionComponent } from './ventas/actualizar-liquidacion/actualizar-liquidacion.component';
import { CrearLiquidacionComponent } from './ventas/crear-liquidacion/crear-liquidacion.component';
import { MaterialModule } from 'src/app/material/material.module';
import { CoreModule } from 'src/app/core/core.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSpinnerModule } from 'ngx-spinner';


@NgModule({
  declarations: [
    VentasComponent,
    CrearLiquidacionComponent,
    ActualizarLiquidacionComponent
  ],
  imports: [
    CommonModule,
    FacturacionRoutingModule,

    CoreModule,
    MaterialModule,
    NgxPaginationModule,
    NgxSpinnerModule,
  ]
})
export class FacturacionModule { }
