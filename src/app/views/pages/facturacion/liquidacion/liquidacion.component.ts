import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

import { PersonalService } from 'src/app/core/services/personal.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { ExportExcellService } from 'src/app/core/services/export-excell.service';
import { CrearLiquidacionComponent } from '../liquidacion/crear-liquidacion/crear-liquidacion.component';
import { ActualizarLiquidacionComponent } from '../liquidacion/actualizar-liquidacion/actualizar-liquidacion.component';


@Component({
  selector: 'app-liquidacion',
  templateUrl: './liquidacion.component.html',
  styleUrls: ['./liquidacion.component.scss']
})
export class LiquidacionComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  loadingItem: boolean = false;
  userId!: number;
  filtroForm!: FormGroup;

  page = 1;
  totalFacturas: number = 0;
  pageSize = 10;
  // pageSizes = [3, 6, 9];

  constructor(
    private personalService: PersonalService,
    private exportExcellService: ExportExcellService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    public datepipe: DatePipe,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.newFilfroForm();
    this.cargarOBuscarLiquidacion();
    this.getListEstados();
    this.getListProyectos();
    this.getListGestores();
    this.getListLiquidaciones();
  }

  newFilfroForm(){
    this.filtroForm = this.fb.group({
      codFact            : [''],
      id_proy            : [''],
      id_liquidacion     : [''],
      id_estado          : [''],
      fechaRegistroInicio: [''],
      fechaRegistroFin   : [''],
      id_gestor          : [''],
    })
  };

  listEstados: any[] = [];
  getListEstados(){
    let arrayParametro: any[] = [{queryId: 101}];

    this.personalService.getListEstados(arrayParametro[0]).subscribe((resp: any) => {
            this.listEstados = resp.list;
            console.log('EST-FACT', resp);
    });
  }

  listGestores: any[] = [];
  getListGestores(){
    let arrayParametro: any[] = [{queryId: 102}];

    this.personalService.getListEstados(arrayParametro[0]).subscribe((resp: any) => {
            this.listGestores = resp.list;
            console.log('GESTORES', resp);
    });
  };

  listProyectos: any[] = [];
  getListProyectos(){
    let parametro: any[] = [{queryId: 1}];

    this.personalService.getListProyectos(parametro[0]).subscribe((resp: any) => {
            this.listProyectos = resp;
            console.log('COD_PROY', resp);
    });
  };

  listLiquidaciones: any[] = [];
  getListLiquidaciones(){
    let arrayParametro: any[] = [{queryId: 82}];
    this.personalService.getListLiquidaciones(arrayParametro[0]).subscribe((resp: any) => {
            this.listLiquidaciones = resp.list;
            console.log('LIQUIDAC', resp);
    });
  }

  listaLiquidacion: any[] = [];
  cargarOBuscarLiquidacion(){
    this.blockUI.start("Cargando facturas...");
    let parametro: any[] = [{
      "queryId": 118,
      "mapValue": {
          cod_fact       : this.filtroForm.value.codFact,
          id_proy        : this.filtroForm.value.id_proy,
          id_liquidacion : this.filtroForm.value.id_liquidacion,
          id_estado      : this.filtroForm.value.id_estado,
          id_gestor      : this.filtroForm.value.id_gestor,
          inicio         : this.datepipe.transform(this.filtroForm.value.fechaRegistroInicio,"yyyy/MM/dd"),
          fin            : this.datepipe.transform(this.filtroForm.value.fechaRegistroFin,"yyyy/MM/dd"),
      }
    }];
    this.personalService.cargarOBuscarLiquidacion(parametro[0]).subscribe((resp: any) => {
    this.blockUI.stop();

     console.log('Lista-Facturas', resp, resp.list.length);
      this.listaLiquidacion = [];
      this.listaLiquidacion = resp.list;

      this.spinner.hide();
    });
  }

  eliminarLiquidacion(id: number){
    this.spinner.show();

    let parametro:any[] = [{
      queryId: 122,
      mapValue: {
        p_idFactura: id,
      }
    }];
    Swal.fire({
      title: '¿Eliminar Liquidación?',
      text: `¿Estas seguro que deseas eliminar la Liquidación: ${id}?`,
      icon: 'question',
      confirmButtonColor: '#ec4756',
      cancelButtonColor: '#0d6efd',
      confirmButtonText: 'Si, Eliminar!',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
    }).then((resp) => {
      if (resp.value) {
        this.personalService.eliminarLiquidacion(parametro[0]).subscribe(resp => {

          this.cargarOBuscarLiquidacion();

            Swal.fire({
              title: 'Eliminar Liquidación',
              text: `La Liquidación: ${id}, fue eliminado con éxito`,
              icon: 'success',
            });
          });
      }
    });
    this.spinner.hide();
  }

  limpiarFiltro() {
    this.filtroForm.reset('', {emitEvent: false})
    this.newFilfroForm()

    this.cargarOBuscarLiquidacion();
  }

  totalfiltro = 0;
  cambiarPagina(event: number) {
    let offset = event*10;
    this.spinner.show();

    if (this.totalfiltro != this.totalFacturas) {
      this.personalService.cargarOBuscarLiquidacion(offset.toString()).subscribe( (resp: any) => {
            this.listaLiquidacion = resp.list;
            this.spinner.hide();
          });
    } else {
      this.spinner.hide();
    }
      this.page = event;
  }

  crearLiquidacion(){
    const dialogRef = this.dialog.open(CrearLiquidacionComponent, {width:'55%'});

    dialogRef.afterClosed().subscribe(resp => {
      if (resp) {
        this.cargarOBuscarLiquidacion()
      }
    })
  }

  actualizarFactura(DATA: any) {
    console.log('DATA_LIQUID', DATA);

    this.dialog
      .open(ActualizarLiquidacionComponent, { width: '55%', height: '95%', data: DATA })
      .afterClosed().subscribe((resp) => {
        if (resp) {
          this.cargarOBuscarLiquidacion();
        }
      });
  }

  exportarRegistro(){
    this.exportExcellService.exportarExcel(this.listaLiquidacion, 'Factura')
  }
}
