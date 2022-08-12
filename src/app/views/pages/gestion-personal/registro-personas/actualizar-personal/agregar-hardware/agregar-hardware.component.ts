import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgxSpinnerService } from 'ngx-spinner';
import { PersonalService } from 'src/app/core/services/personal.service';

@Component({
  selector: 'app-agregar-hardware',
  templateUrl: './agregar-hardware.component.html',
  styleUrls: ['./agregar-hardware.component.scss']
})
export class AgregarHardwareComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  loadingItem: boolean = false;
  filtroForm!: FormGroup;

  page = 1;
  totalHardware: number = 0;
  pageSize = 5;
  pageSizes = [3, 6, 9];

  constructor(
    private personalService: PersonalService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private dialogRef: MatDialogRef<AgregarHardwareComponent>,
  ) { }

  ngOnInit(): void {
    this.newFilfroForm();
    this.cargarOBuscarHardwareDisponible();
    this.getListMarcaHardware();
    this.getListTiposHardware();
  }

  newFilfroForm(){
    this.filtroForm = this.fb.group({
      tipo  : [''],
      marca : [''],
      serie : [''],
    })
  }

  listaHardwareDisp: any[] = [];
  cargarOBuscarHardwareDisponible(){
    this.blockUI.start("Cargando listado de hardware...");
    let parametro: any[] = [{
      "queryId": 29,
      "mapValue": {
        param_serie    : this.filtroForm.value.serie,
        param_id_tipo  : this.filtroForm.value.tipo,
        param_id_marca : this.filtroForm.value.marca,
        param_id_estado: this.filtroForm.value.estado,
      }
    }];
    this.personalService.cargarOBuscarHardwareDisponible(parametro[0]).subscribe((resp: any) => {
    this.blockUI.stop();

     console.log('Lista-Hardware-disp', resp, resp.length);
      this.listaHardwareDisp = [];
      this.listaHardwareDisp = resp.list;

      this.spinner.hide();
    });
  }

  asignarHardware(id: any){

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

  limpiarFiltro() {
    this.filtroForm.reset('', {emitEvent: false})

    this.cargarOBuscarHardwareDisponible();
  };

  totalfiltro = 0;
  cambiarPagina(event: number) {
    let offset = event*10;
    this.spinner.show();

    if (this.totalfiltro != this.totalHardware) {
      this.personalService.cargarOBuscarHardwareDisponible(offset.toString()).subscribe( (resp: any) => {
            this.listaHardwareDisp = resp.list;
            this.spinner.hide();
          });
    } else {
      this.spinner.hide();
    }
      this.page = event;
  }
  close(succes?: boolean) {
    this.dialogRef.close(succes);
  }
}
