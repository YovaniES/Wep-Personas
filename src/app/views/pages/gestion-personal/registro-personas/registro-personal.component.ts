import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

import { PersonalService } from 'src/app/core/services/personal.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { ActualizarPersonalComponent } from './actualizar-personal/actualizar-personal.component';
import { CrearPersonalComponent } from './crear-personal/crear-personal.component';
import { DatePipe } from '@angular/common';
import { ExportExcellService } from 'src/app/core/services/export-excell.service';

@Component({
  selector: 'app-registro-personas',
  templateUrl: './registro-personal.component.html',
  styleUrls: ['./registro-personal.component.scss'],
})
export class RegistroPersonalComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  loadingItem: boolean = false;
  userId!: number;
  filtroForm!: FormGroup;

  page = 1;
  totalPersonal: number = 0;
  pageSize = 10;
  // pageSizes = [3, 6, 9];

  constructor(
    private personalService: PersonalService,
    private exportExcellService: ExportExcellService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    public datepipe: DatePipe,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.newFilfroForm();
    this.cargarOBuscarPersonal();
    this.getListProyectos();
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



  listaPersonal: any[] = [];
  cargarOBuscarPersonal(){
    this.blockUI.start("Cargando personal...");
    let parametro: any[] = [{
      "queryId": 30,
      "mapValue": {
          nombre         : this.filtroForm.value.nombres + " " + this.filtroForm.value.apellidos,
          dni            : this.filtroForm.value.dni,
          codigo_proyecto: this.filtroForm.value.codProy,
          id_estado      : this.filtroForm.value.estado,
          inicio         : this.datepipe.transform(this.filtroForm.value.fechaIngresoInicio,"yyyy/MM/dd"),
          fin            : this.datepipe.transform(this.filtroForm.value.fechaIngresoFin,"yyyy/MM/dd"),
      }
    }];
    this.personalService.cargarOBuscarPersonal(parametro[0]).subscribe((resp: any) => {
    this.blockUI.stop();

     console.log('Lista-Personal', resp, resp.list.length);
      this.listaPersonal = [];
      this.listaPersonal = resp.list;

      this.spinner.hide();
    });
  }

  idEliminar: number = 0;
  codCorporativo: any;
  tooltipDeBajaOalta: string =''
  abrirEliminar(id:number, codCorporrativo:string, estado:string){
    this.idEliminar = id;
    this.codCorporativo = codCorporrativo;

    if (estado == 'Activo')   {this.tooltipDeBajaOalta = "Desactivar"}
    if (estado == 'Inactivo') {this.tooltipDeBajaOalta = "Activar"}

    Swal.fire({
      title: `${this.tooltipDeBajaOalta} al Personal?`,
      text: `¿Desea ${this.tooltipDeBajaOalta} al personal: ${id} ?`,
      icon: 'question',
      confirmButtonColor: '#20c997',
      cancelButtonColor : '#b2b5b4',
      confirmButtonText : 'Si!',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
    }).then((resp) => {
        if (resp.value) {
          this.bajaOaltaAlPersonal(this.idEliminar);
       }
      }
    );
  }

  activado_desactivado: string='';
  bajaOaltaAlPersonal(id: number){
    this.spinner.show();
    let parametro:any[] = [{
      "queryId": 9,
      "mapValue": { param_id_persona : id }
    }];

    this.personalService.bajaOaltaAlPersonal(parametro[0]).subscribe(data => {
      const arrayData:any[] = Array.of(data);
      let msj  = arrayData[0].exitoMessage;
      let msj2 = arrayData[0].errorMessage

      if(msj == undefined){msj = ''}
      if (msj != '') {

        if (this.tooltipDeBajaOalta == 'Desactivar') {this.activado_desactivado = 'Desactivado'}
        if (this.tooltipDeBajaOalta == 'Activar') {this.activado_desactivado = 'Activado'}

        Swal.fire({
          title: `${this.tooltipDeBajaOalta} al Personal`,
          text: `El Personal: ${id}, fue ${this.activado_desactivado} con éxito`,
          icon: 'success',
        });

      }else if (msj2 != ''){
        Swal.fire({
          title: `${this.tooltipDeBajaOalta} al Personal`,
          text: `El Personal: ${id} No pudo ser: ${this.activado_desactivado}, por que tiene recursos asignados`,
          icon: 'error',
        });

      }else{
        // this.showError('Error');
      }
      this.cargarOBuscarPersonal();
    });
    this.spinner.hide();
}



  abrirEliminarLogico(id:number, codCorporrativo:string, estado:string){
    this.idEliminar = id;
    this.codCorporativo = codCorporrativo;

    Swal.fire({
      title: `Eliminar Personal?`,
      text: `¿Desea eliminar al personal: ${id} ?`,
      icon: 'question',
      confirmButtonColor: '#20c997',
      cancelButtonColor : '#b2b5b4',
      confirmButtonText : 'Si!',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
    }).then((resp) => {
        if (resp.value) {
          this.eliminacionLogica(this.idEliminar);
       }
      }
    );
  }

  eliminacionLogica(id: number){
    this.spinner.show();
    let parametro:any[] = [{
      "queryId": 37,
      "mapValue": { param_id_persona : id }
    }];

    this.personalService.eliminarPersonal(parametro[0]).subscribe(data => {
      const arrayData:any[] = Array.of(data);
      let msj  = arrayData[0].exitoMessage;
      let msj2 = arrayData[0].errorMessage

      if(msj == undefined){msj = ''}
      if (msj != '') {
        Swal.fire({
          title: 'Eliminar Personal',
          text: `El Personal: ${id}, fue eliminado con éxito`,
          icon: 'success',
        });

      }else if (msj2 != ''){
        Swal.fire({
          title: `Eliminar al Personal`,
          text: `El Personal: ${id}, no pudo ser eliminado por que tiene recursos asignados`,
          icon: 'error',
        });
      }else{
        // this.showError('Error');
      }
      this.cargarOBuscarPersonal();
    });
    this.spinner.hide();
  }


  listCodProy: any[] = [];
  getListProyectos() {
    let arrayParametro: any[] = [{ queryId: 1 }];

    this.personalService
      .getListProyectos(arrayParametro[0])
      .subscribe((resp) => {
        this.listCodProy = resp;
        // console.log('COD_PROY', resp);
      });
  }


  limpiarFiltro() {
    this.filtroForm.reset('', { emitEvent: false });
    this.newFilfroForm();

    this.cargarOBuscarPersonal();
  }

  totalfiltro = 0;
  cambiarPagina(event: number) {
    let offset = event * 10;
    this.spinner.show();

    if (this.totalfiltro != this.totalPersonal) {
      this.personalService
        .cargarOBuscarPersonal(offset.toString())
        .subscribe((resp: any) => {
          this.listaPersonal = resp.list;
          this.spinner.hide();
        });
    } else {
      this.spinner.hide();
    }
    this.page = event;
  }

  crearPersonal() {
    const dialogRef = this.dialog.open(CrearPersonalComponent, {
      width: '55%',
    });

    dialogRef.afterClosed().subscribe((resp) => {
      if (resp) {
        this.cargarOBuscarPersonal();
      }
    });
  }

  actualizarPersonal(id: any) {
    this.dialog
      .open(ActualizarPersonalComponent, {
        width: '55%',
        height: '90%',
        data: id,
      })
      .afterClosed()
      .subscribe((resp) => {
        if (resp) {
          this.cargarOBuscarPersonal();
        }
      });
  }

  exportarRegistro() {
    this.exportExcellService.exportarExcel(this.listaPersonal, 'Persoal');
  }
}
