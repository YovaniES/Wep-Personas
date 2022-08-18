import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MantenimientoRoutingModule } from './mantenimiento-routing.module';
import { ListaEntidadComponent } from './lista-entidad/lista-entidad.component';
import { CoreModule } from 'src/app/core/core.module';
import { MaterialModule } from 'src/app/material/material.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ModalEntidadComponent } from './lista-entidad/modal-entidad/modal-entidad.component';


@NgModule({
  declarations: [
    ListaEntidadComponent,
    ModalEntidadComponent
  ],
  imports: [
    CommonModule,
    MantenimientoRoutingModule,
    CoreModule,
    MaterialModule,

    NgxPaginationModule,
    NgxSpinnerModule,
  ]
})
export class MantenimientoModule { }
