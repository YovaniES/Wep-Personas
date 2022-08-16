import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MantenimientoRoutingModule } from './mantenimiento-routing.module';
import { ListaEntidadComponent } from './lista-entidad/lista-entidad.component';
import { CrearEntidadComponent } from './lista-entidad/crear-entidad/crear-entidad.component';
import { CoreModule } from 'src/app/core/core.module';
import { MaterialModule } from 'src/app/material/material.module';
import { ActualizarEntidadComponent } from './lista-entidad/actualizar-entidad/actualizar-entidad.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSpinnerModule } from 'ngx-spinner';


@NgModule({
  declarations: [
    ListaEntidadComponent,
    CrearEntidadComponent,
    ActualizarEntidadComponent
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
