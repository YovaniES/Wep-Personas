import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

import { PersonalService } from 'src/app/core/services/personal.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { of } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { CrearHardwareComponent } from './crear-hardware/crear-hardware.component';
import { ActualizarHardwareComponent } from './actualizar-hardware/actualizar-hardware.component';
import { ExportExcellService } from 'src/app/core/services/export-excell.service';

@Component({
  selector: 'app-registro-hardware',
  templateUrl: './registro-hardware.component.html',
  styleUrls: ['./registro-hardware.component.scss']
})
export class RegistroHardwareComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  loadingItem: boolean = false;
  userId!: number;
  filtroForm!: FormGroup;

  page = 1;
  totalHardware: number = 0;
  pageSize = 10;
  pageSizes = [3, 6, 9];

  constructor(
    private personalService: PersonalService,
    private authService: AuthService,
    private fb: FormBuilder,
    private exportExcellService: ExportExcellService,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.newFilfroForm();
    this.cargarOBuscarHardware();
    this.getListMarcaHardware();
    this.getListTiposHardware();
  }

  newFilfroForm(){
    this.filtroForm = this.fb.group({
      tipo  : [''],
      marca : [''],
      serie : [''],
      imei  : [''],
      estado: [''],
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
    return of(currentUser ? JSON.parse(currentUser) : '');
  }

  listaHardware: any[] = [];
  cargarOBuscarHardware(){
    this.blockUI.start("Cargando listado de hardware...");
    let parametro: any[] = [{
      "queryId": 45,
      "mapValue": {
        param_serie    : this.filtroForm.value.serie,
        param_id_tipo  : this.filtroForm.value.tipo,
        param_id_marca : this.filtroForm.value.marca,
        param_id_estado: this.filtroForm.value.estado,
        param_imei     : this.filtroForm.value.imei,
      }
    }];
    this.personalService.cargarOBuscarHardware(parametro[0]).subscribe((resp: any) => {
    this.blockUI.stop();

    //  console.log('Lista-Hardware', resp, resp.length);
      this.listaHardware = [];
      this.listaHardware = resp.list;

      this.spinner.hide();
    });
  }

  listTipos: any[] = [];
  getListTiposHardware(){
    let arrayParametro: any[] = [{queryId: 32}];

    this.personalService.getListTiposHardware(arrayParametro[0]).subscribe((resp) => {
      this.listTipos = resp;
    });
  }


  listMarca: any[] = [];
  getListMarcaHardware(){
    let arrayParametro: any[] = [{ queryId: 33 }];

    this.personalService.getListMarcaHardware(arrayParametro[0]).subscribe((resp) => {
      this.listMarca = resp;
    });
  }



  eliminarHardware(id: number){
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
        this.personalService.eliminarHardware(parametro[0]).subscribe(resp => {

          this.cargarOBuscarHardware();

            Swal.fire({
              title: 'Eliminar Hardware',
              text: `El Hardware: ${id}, fue eliminado con éxito`,
              icon: 'success',
            });
          });
      }
    });
    this.spinner.hide();
  }

  limpiarFiltro() {
    this.filtroForm.reset('', {emitEvent: false})

    this.cargarOBuscarHardware();
  }

  totalfiltro = 0;
  cambiarPagina(event: number) {
    let offset = event*10;
    this.spinner.show();

    if (this.totalfiltro != this.totalHardware) {
      this.personalService.cargarOBuscarHardware(offset.toString()).subscribe( (resp: any) => {
            this.listaHardware = resp.list;
            this.spinner.hide();
          });
    } else {
      this.spinner.hide();
    }
      this.page = event;
  }

  exportarRegistro(){
    this.exportExcellService.exportarExcel(this.listaHardware, 'Hardware')
  }

  crearHardware(){
    const dialogRef = this.dialog.open(CrearHardwareComponent, {width:'55%'});

    dialogRef.afterClosed().subscribe(resp => {
      if (resp) {
        this.cargarOBuscarHardware()
      }
    })
  }

  actualizarHardware(id: any) {
    this.dialog
      .open(ActualizarHardwareComponent, { width: '55%', data: id, })
      .afterClosed().subscribe((resp) => {
        if (resp) {
          this.cargarOBuscarHardware();
        }
      });
  }
}
