import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

import { PersonalService } from 'src/app/core/services/personal.service';
import { CrearCuentaComponent } from './crear-cuenta/crear-cuenta.component';
import { MatDialog } from '@angular/material/dialog';
import { ActualizarCuentaComponent } from './actualizar-cuenta/actualizar-cuenta.component';

@Component({
  selector: 'app-registro-cuenta',
  templateUrl: './registro-cuenta.component.html',
  styleUrls: ['./registro-cuenta.component.scss']
})
export class RegistroCuentaComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  loadingItem: boolean = false;

  page = 1;
  totalIniciativa: number = 0;
  pageSize = 10;
  pageSizes = [3, 6, 9];

  cuentaUsuario: any;
  idEstadoBuscar: any;

  filtroForm!: FormGroup;


  constructor(
    private personalService: PersonalService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.newFilfroForm();
    this.getListadoCuenta();
    this.buscarOcargarcuentas();
  }

  newFilfroForm(){
    this.filtroForm = this.fb.group({
      nombre           : [''],
      estado           : [''],
    })
  }


  getListadoCuenta() {
    this.spinner.show();
    let parametro: any[] = [{ queryId: 38 }];
    this.personalService.getListadoCuenta(parametro[0]).subscribe((resp) => {
      this.listaCuenta = resp;

      this.spinner.hide();
    });
  }



  registros: any[] = [];
  buscarOcargarcuentas(){
    this.blockUI.start("Cargando cuentas...");
    let parametro: any[] = [{
      "queryId": 46,
      "mapValue": {
        param_usuario  : this.cuentaUsuario,
        param_id_estado: this.idEstadoBuscar,
      }
    }];
    this.personalService.buscarOcargarcuentas(parametro[0]).subscribe(resp => {
    this.blockUI.stop();

     console.log('INIC_O_BUSQ', resp, resp.length);
      this.registros = [];
      this.registros = resp;

      this.spinner.hide();
    });
  }


  totalfiltro = 0;
  cambiarPagina(event: number) {
    let offset = event*10;
    this.spinner.show();

    if (this.totalfiltro != this.totalIniciativa) {
      this.personalService.buscarOcargarcuentas(offset.toString()).subscribe( resp => {
            // console.log('TABLA', resp);
            this.registros = resp;
            this.spinner.hide();
          });
    } else {
      this.spinner.hide();
    }
      this.page = event;
  }

  // editarIniciativa(id: number){

  // }

  eliminarCuenta(id: any){

  }


  limpiarFiltro() {
    this.cuentaUsuario = "";
    this.idEstadoBuscar = "";
    this.getListaCuenta();
  }

  listaCuenta: any[] = [];
  getListaCuenta() {
    this.spinner.show();
    let parametro: any[] = [{ queryId: 38 }];
    this.personalService.getRecursoCuenta(parametro[0]).subscribe((resp) => {
      this.listaCuenta = resp;
      this.spinner.hide();
    });
  }


  crearCuenta(){
    const dialogRef = this.dialog.open(CrearCuentaComponent, {width:'50%', height:'20%'});

    dialogRef.afterClosed().subscribe(resp => {
      if (resp) {
        this.buscarOcargarcuentas()
      }
    })
  }

  editarCuenta(idIniciativa: any) {
    this.dialog
      .open(ActualizarCuentaComponent, { width: '50%', height: '65%', data: idIniciativa, })
      .afterClosed().subscribe((resp) => {
        if (resp) {
          this.buscarOcargarcuentas();
        }
      });
  }
}
