import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { PersonalService } from 'src/app/core/services/personal.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { ExportExcellService } from 'src/app/core/services/export-excell.service';
import { VacacionesPersonalService } from 'src/app/core/services/vacaciones-personal.service';
import { ModalVacacionesComponent } from './modal-vacaciones/modal-vacaciones.component';

@Component({
  selector: 'app-registro-vacaciones',
  templateUrl: './registro-vacaciones.component.html',
  styleUrls: ['./registro-vacaciones.component.scss']
})
export class RegistroVacacionesComponent implements OnInit {


  @BlockUI() blockUI!: NgBlockUI;
  loadingItem: boolean = false;
  userId!: number;
  filtroForm!: FormGroup;
  totalCuenta: number = 0;
  totalHardware: number = 5;

  page = 1;
  totalPersonal: number = 0;
  pageSize = 10;

  constructor(
    private personalService: PersonalService,
    private vacacionesService: VacacionesPersonalService,
    private exportExcellService: ExportExcellService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    public datepipe: DatePipe,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.newFilfroForm();
    this.cargarOBuscarVacaciones();
    this.getListProyectos();
    this.getLstEstadoVacaciones();
    this.getListAdminVacaciones();
  }

    newFilfroForm(){
    this.filtroForm = this.fb.group({
      nombres           : [''],
      apellidos         : [''],
      dni               : [''],
      codProy           : [''],
      estado            : [''],
      fechaIngresoInicio: [''],
      fechaIngresoFin   : [''],
    })
  };

  listaRegVacaciones: any[] = [];
  cargarOBuscarVacaciones(){
    this.blockUI.start("Cargando Registro de Vacaciones...");
    let parametro: any[] = [{
      "queryId": 130,
      "mapValue": {
          nombre         : this.filtroForm.value.nombres + " " + this.filtroForm.value.apellidos,
          dni            : this.filtroForm.value.dni,
          codigo_proyecto: this.filtroForm.value.codProy,
          id_estado      : this.filtroForm.value.estado,
          inicio         : this.datepipe.transform(this.filtroForm.value.fechaIngresoInicio,"yyyy/MM/dd"),
          fin            : this.datepipe.transform(this.filtroForm.value.fechaIngresoFin,"yyyy/MM/dd"),
      }
    }];
    this.vacacionesService.cargarOBuscarVacaciones(parametro[0]).subscribe((resp: any) => {
    this.blockUI.stop();

     console.log('Lista-VACACIONES-Personal', resp, resp.list.length);
      this.listaRegVacaciones = [];
      this.listaRegVacaciones = resp.list;

      this.spinner.hide();
    });
  }

  listCodProy: any[] = [];
  getListProyectos() {
    let arrayParametro: any[] = [{ queryId: 1 }];

    this.personalService.getListProyectos(arrayParametro[0]).subscribe((resp: any) => {
        this.listCodProy = resp.list;
        // console.log('COD_PROY', resp);
      });
  }

  listVacacionesEstado: any[] = [];
  getLstEstadoVacaciones(){
  let parametro: any[] = [{ queryId: 124}];
  this.vacacionesService.getLstEstadoVacaciones(parametro[0]).subscribe((resp: any) => {
    this.listVacacionesEstado = resp.list;
    console.log('VACAS-ESTADO', resp.list);
    })
  }

  listAdminVacaciones: any[] = [];
  getListAdminVacaciones(){
  let parametro: any[] = [{ queryId: 127}];
  this.vacacionesService.getListAdminVacaciones(parametro[0]).subscribe((resp: any) => {
    this.listAdminVacaciones = resp.list;
    console.log('ADMIN-VACAS', resp.list);
    })
  }


  limpiarFiltro() {
    this.filtroForm.reset('', { emitEvent: false });
    this.newFilfroForm();

    this.cargarOBuscarVacaciones();
  }

  totalfiltro = 0;
  cambiarPagina(event: number) {
    let offset = event * 10;
    this.spinner.show();

    if (this.totalfiltro != this.totalPersonal) {
      this.vacacionesService.cargarOBuscarVacaciones(offset.toString())
        .subscribe((resp: any) => {
          this.listaRegVacaciones = resp.list;
          this.spinner.hide();
        });
    } else {
      this.spinner.hide();
    }
    this.page = event;
  }

  crearVacaciones() {
    const dialogRef = this.dialog.open(ModalVacacionesComponent, {width: '55%',});

    dialogRef.afterClosed().subscribe((resp) => {
      if (resp) {
        this.cargarOBuscarVacaciones();
      }
    });
  }

  actualizarVacaciones(DATA: any) {
    // console.log('DATA_PERSONA_HC', DATA);
    this.dialog
      .open(ModalVacacionesComponent, {width: '55%', height: '90%', data: DATA})
      .afterClosed().subscribe((resp) => {
        if (resp) {
          this.cargarOBuscarVacaciones();
        }
      });
  }

  exportarRegistro() {
    this.exportExcellService.exportarExcel(this.listaRegVacaciones, 'Vacaciones');
  }
}
