import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GestionPersonalRoutingModule } from './gestion-personal-routing.module';
import { RegistroCuentaComponent } from './registro-cuenta/registro-cuenta.component';
import { CrearCuentaComponent } from './registro-cuenta/crear-cuenta/crear-cuenta.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MaterialModule } from 'src/app/material/material.module';
import { CoreModule } from 'src/app/core/core.module';
import { ActualizarCuentaComponent } from './registro-cuenta/actualizar-cuenta/actualizar-cuenta.component';


@NgModule({
  declarations: [
    RegistroCuentaComponent,
    CrearCuentaComponent,
    ActualizarCuentaComponent
  ],
  imports: [
    GestionPersonalRoutingModule,
    CoreModule,

    NgxPaginationModule,
    NgxSpinnerModule,
    MaterialModule
  ]
})
export class GestionPersonalModule { }
