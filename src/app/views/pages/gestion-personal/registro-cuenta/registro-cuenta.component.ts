import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';

import { AuthService } from 'src/app/core/services/auth.service';
import { ExportExcellService } from 'src/app/core/services/export-excell.service';
import { ModalCuentaComponent } from './modal-cuenta/modal-cuenta.component';
import { PersonalService } from 'src/app/core/services/personal.service';

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
  // pageSizes = [3, 6, 9];

  constructor(
    private personalService: PersonalService,
    private authService: AuthService,
    private exportExcellService: ExportExcellService,
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
      "queryId": 109,
      "mapValue": {
        param_usuario  : this.filtroForm.value.usuario,
        param_id_estado: this.filtroForm.value.idEstado,
      }
    }];
    this.personalService.cargarOBuscarcuentas(parametro[0]).subscribe((resp: any) => {
    this.blockUI.stop();

     console.log('Lista-Cuentas', resp, resp.list.length);
      this.listaCuenta = [];
      this.listaCuenta = resp.list;

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
      confirmButtonColor: '#ec4756',
      cancelButtonColor: '#0d6efd',
      confirmButtonText: 'Si, Eliminar!',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
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
      this.personalService.cargarOBuscarcuentas(offset.toString()).subscribe( (resp: any) => {
            this.listaCuenta = resp.list;
            this.spinner.hide();
          });
    } else {
      this.spinner.hide();
    }
      this.page = event;
  }

  exportarRegistro(){
    this.exportExcellService.exportarExcel(this.listaCuenta, 'Cuenta')
  }

  crearCuenta(){
    const dialogRef = this.dialog.open(ModalCuentaComponent, {width:'50%'});

    dialogRef.afterClosed().subscribe(resp => {
      if (resp) {
        this.cargarOBuscarcuentas()
      }
    })
  }

  actualizarCuenta(cuenta: any) {
    console.log('DATA_CUENTA', cuenta);

    const dialogRef = this.dialog.open(ModalCuentaComponent, { width: '50%'});

    dialogRef.afterClosed().subscribe((resp) => {
        if (resp == 'Actualizar') {
          this.cargarOBuscarcuentas();
        }
      });
  }

}
