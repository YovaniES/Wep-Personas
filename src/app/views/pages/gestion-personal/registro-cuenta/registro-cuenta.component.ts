import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

import { PersonalService } from 'src/app/core/services/personal.service';
import { CrearCuentaComponent } from './crear-cuenta/crear-cuenta.component';
import { MatDialog } from '@angular/material/dialog';
import { ActualizarCuentaComponent } from './actualizar-cuenta/actualizar-cuenta.component';
import Swal from 'sweetalert2';
import { of } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-registro-cuenta',
  templateUrl: './registro-cuenta.component.html',
  styleUrls: ['./registro-cuenta.component.scss']
})
export class RegistroCuentaComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  loadingItem: boolean = false;
  userId!: number;
  filtroForm!: FormGroup;

  page = 1;
  totalIniciativa: number = 0;
  pageSize = 10;
  pageSizes = [3, 6, 9];

  constructor(
    private personalService: PersonalService,
    private authService: AuthService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.newFilfroForm();
    this.cargarOBuscarcuentas();
    this.getUsuario();
  }

  newFilfroForm(){
    this.filtroForm = this.fb.group({
      usuario : [''],
      idEstado: [''],
    })
  }

  getUsuario(){
    this.authService.getCurrentUser().subscribe( resp => {
      this.userId   = resp.user.userId;
      // console.log('ID-USER', this.userId);
    })
   }

  getCurrentUser() {
    const currentUser: any = localStorage.getItem('currentUser');
    // console.log('USER-ACTUAL',JSON.parse(currentUser));
    return of(currentUser ? JSON.parse(currentUser) : '');
  }

  listaCuenta: any[] = [];
  cargarOBuscarcuentas(){
    this.blockUI.start("Cargando cuentas...");
    let parametro: any[] = [{
      "queryId": 46,
      "mapValue": {
        param_usuario  : this.filtroForm.value.usuario,
        param_id_estado: this.filtroForm.value.idEstado,
      }
    }];
    this.personalService.cargarOBuscarcuentas(parametro[0]).subscribe(resp => {
    this.blockUI.stop();

    //  console.log('Lista-Cuentas', resp, resp.length);
      this.listaCuenta = [];
      this.listaCuenta = resp;

      this.spinner.hide();
    });
  }

  eliminarCuenta(id: number){
    this.spinner.show();

    let parametro:any[] = [{
      queryId: 42,
      mapValue: {
        param_id_cuenta: id,
        CONFIG_USER_ID: this.userId,
        CONFIG_OUT_MSG_ERROR: "",
        CONFIG_OUT_MSG_EXITO: "",
      }
    }];
    Swal.fire({
      title: '¿Eliminar Cuenta?',
      text: `¿Estas seguro que deseas eliminar la Cuenta: ${id} ?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar!',
    }).then((resp) => {
      if (resp.value) {
        this.personalService.eliminarCuenta(parametro[0]).subscribe(resp => {

          this.cargarOBuscarcuentas();

            Swal.fire({
              title: 'Eliminar Cuenta',
              text: `La Cuenta: ${id}, fue eliminado con éxito`,
              icon: 'success',
            });
          });
      }
    });
    this.spinner.hide();
  }

  limpiarFiltro() {
    this.filtroForm.reset('', {emitEvent: false})

    this.cargarOBuscarcuentas();
  }

  totalfiltro = 0;
  cambiarPagina(event: number) {
    let offset = event*10;
    this.spinner.show();

    if (this.totalfiltro != this.totalIniciativa) {
      this.personalService.cargarOBuscarcuentas(offset.toString()).subscribe( resp => {
            this.listaCuenta = resp;
            this.spinner.hide();
          });
    } else {
      this.spinner.hide();
    }
      this.page = event;
  }

  crearCuenta(){
    const dialogRef = this.dialog.open(CrearCuentaComponent, {width:'50%'});

    dialogRef.afterClosed().subscribe(resp => {
      if (resp) {
        this.cargarOBuscarcuentas()
      }
    })
  }

  actualizarCuenta(id: any) {
    console.log('IDXX',id);
    this.dialog
      .open(ActualizarCuentaComponent, { width: '50%', height: '20%', data: id, })
      .afterClosed().subscribe((resp) => {
        if (resp) {
          this.cargarOBuscarcuentas();
        }
      });
  }

  // actualizarCuenta(id: any) {
  //   console.log('IDXX',id);
  //   this.dialog
  //     .open(CrearCuentaComponent, { width: '50%', height: '20%', data: id, })
  //     .afterClosed().subscribe((val) => {
  //       if (val == 'update') {
  //         this.cargarOBuscarcuentas();
  //       }
  //     });
  // }
}
