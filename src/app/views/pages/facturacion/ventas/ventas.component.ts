import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

import { PersonalService } from 'src/app/core/services/personal.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { ExportExcellService } from 'src/app/core/services/export-excell.service';
import { CrearLiquidacionComponent } from './crear-liquidacion/crear-liquidacion.component';
import { ActualizarLiquidacionComponent } from './actualizar-liquidacion/actualizar-liquidacion.component';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.scss']
})
export class VentasComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  loadingItem: boolean = false;
  userId!: number;
  filtroForm!: FormGroup;

  page = 1;
  totalFacturas: number = 0;
  pageSize = 10;
  pageSizes = [3, 6, 9];

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
    this.cargarOBuscarFacturas();
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

  listaFacturas: any[] = [];
  cargarOBuscarFacturas(){
    this.blockUI.start("Cargando facturas...");
    let parametro: any[] = [{
      "queryId": 68,
      "mapValue": {
          cod_fact       : this.filtroForm.value.codFact,
          id_proy        : this.filtroForm.value.id_proy,
          id_liquidacion : this.filtroForm.value.id_liquidacion,
          id_estado      : this.filtroForm.value.id_estado,
          inicio         : this.datepipe.transform(this.filtroForm.value.fechaRegistroInicio,"yyyy/MM/dd"),
          fin            : this.datepipe.transform(this.filtroForm.value.fechaRegistroFin,"yyyy/MM/dd"),
      }
    }];
    this.personalService.cargarOBuscarFacturas(parametro[0]).subscribe((resp: any) => {
    this.blockUI.stop();

     console.log('Lista-Facturas', resp, resp.list.length);
      this.listaFacturas = [];
      this.listaFacturas = resp.list;

      this.spinner.hide();
    });
  }

  eliminarFactura(id: number){
    this.spinner.show();

    let parametro:any[] = [{
      queryId: 37,
      mapValue: {
        param_id_persona: id,
      }
    }];
    Swal.fire({
      title: '¿Eliminar Factura?',
      text: `¿Estas seguro que deseas eliminar la Factura: ${id} ?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar!',
    }).then((resp) => {
      if (resp.value) {
        this.personalService.eliminarFactura(parametro[0]).subscribe(resp => {

          this.cargarOBuscarFacturas();

            Swal.fire({
              title: 'Eliminar Factura',
              text: `La Factura: ${id}, fue eliminado con éxito`,
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

    this.cargarOBuscarFacturas();
  }

  totalfiltro = 0;
  cambiarPagina(event: number) {
    let offset = event*10;
    this.spinner.show();

    if (this.totalfiltro != this.totalFacturas) {
      this.personalService.cargarOBuscarFacturas(offset.toString()).subscribe( (resp: any) => {
            this.listaFacturas = resp.list;
            this.spinner.hide();
          });
    } else {
      this.spinner.hide();
    }
      this.page = event;
  }

  crearFactura(){
    const dialogRef = this.dialog.open(CrearLiquidacionComponent, {width:'55%'});

    dialogRef.afterClosed().subscribe(resp => {
      if (resp) {
        this.cargarOBuscarFacturas()
      }
    })
  }

  actualizarFactura(id: any) {
    this.dialog
      .open(ActualizarLiquidacionComponent, { width: '55%', data: id, })
      .afterClosed().subscribe((resp) => {
        if (resp) {
          this.cargarOBuscarFacturas();
        }
      });
  }

  exportarRegistro(){
    this.exportExcellService.exportarExcel(this.listaFacturas, 'Factura')
  }

}
