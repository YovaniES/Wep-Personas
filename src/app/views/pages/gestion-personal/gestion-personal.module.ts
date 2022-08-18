import { NgModule } from '@angular/core';

import { GestionPersonalRoutingModule } from './gestion-personal-routing.module';
import { RegistroCuentaComponent } from './registro-cuenta/registro-cuenta.component';
import { CrearCuentaComponent } from './registro-cuenta/crear-cuenta/crear-cuenta.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MaterialModule } from 'src/app/material/material.module';
import { CoreModule } from 'src/app/core/core.module';
import { ActualizarCuentaComponent } from './registro-cuenta/actualizar-cuenta/actualizar-cuenta.component';
import { RegistroHardwareComponent } from './registro-hardware/registro-hardware.component';
import { RegistroPersonalComponent } from './registro-personas/registro-personal.component';
import { ActualizarPersonalComponent } from './registro-personas/actualizar-personal/actualizar-personal.component';
import { CrearPersonalComponent } from './registro-personas/crear-personal/crear-personal.component';
import { AsignarHardwareComponent } from './registro-personas/actualizar-personal/agregar-hardware/asignar-hardware.component';
import { AsignarCuentaComponent } from './registro-personas/actualizar-personal/asignar-cuenta/asignar-cuenta.component';
import { ModalHardwareComponent } from './registro-hardware/modal-hardware/modal-hardware.component';
import { ModalCuentaComponent } from './registro-cuenta/modal-cuenta/modal-cuenta.component';


@NgModule({
  declarations: [
    RegistroCuentaComponent,
    CrearCuentaComponent,
    ActualizarCuentaComponent,
    RegistroHardwareComponent,
    RegistroPersonalComponent,
    CrearPersonalComponent,
    ActualizarPersonalComponent,
    AsignarHardwareComponent,
    AsignarCuentaComponent,
    ModalHardwareComponent,
    ModalCuentaComponent
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
