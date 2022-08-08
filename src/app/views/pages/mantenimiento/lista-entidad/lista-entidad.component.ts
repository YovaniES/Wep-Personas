import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgxSpinnerService } from 'ngx-spinner';
import { PersonalService } from 'src/app/core/services/personal.service';
import { ActualizarEntidadComponent } from './actualizar-entidad/actualizar-entidad.component';
import Swal from 'sweetalert2';
import { CrearEntidadComponent } from './crear-entidad/crear-entidad.component';

@Component({
  selector: 'app-lista-entidad',
  templateUrl: './lista-entidad.component.html',
  styleUrls: ['./lista-entidad.component.scss']
})
export class ListaEntidadComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  loadingItem: boolean = false;

  filtroForm!: FormGroup;

  page = 1;
  totalEntidad: number = 0;
  pageSize = 4;
  pageSizes = [3, 6, 9];

  constructor(
    private personalService: PersonalService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.newFilfroForm();
    this.getListEntidades();
  }

  newFilfroForm(){
    this.filtroForm = this.fb.group({
      entidad  : [''],
    })
  }

  listEntidad: any[] = [];
  getListEntidades(){
    let arrayParametro: any[] = [{queryId: 47}];

    this.personalService.getListEntidades(arrayParametro[0]).subscribe((resp) => {
      this.listEntidad = resp;
    });
  }

  listEntidadX: any[] = [];
  cargarOBuscarEntidades(){
    this.blockUI.start("Cargando lista de entidades...");
    let parametro: any[] = [{
      "queryId": 48,
      "mapValue": {
        param_serie    : this.filtroForm.value.serie,
        param_id_tipo  : this.filtroForm.value.tipo,
        param_id_marca : this.filtroForm.value.marca,
        param_id_estado: this.filtroForm.value.estado,
        param_imei     : this.filtroForm.value.imei,
      }
    }];
    this.personalService.cargarOBuscarEntidades(parametro[0]).subscribe(resp => {
    this.blockUI.stop();

     console.log('Lista-Hardware', resp, resp.length);
      this.listEntidad = [];
      this.listEntidad = resp;

      this.spinner.hide();
    });
  }

  eliminarEntidad(id: number){
    this.spinner.show();

    let parametro:any[] = [{
      queryId: 42,
      mapValue: {
        param_id_cuenta: id,
        // CONFIG_USER_ID: this.userId,
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
        this.personalService.eliminarHardware(parametro[0]).subscribe(resp => {

          this.cargarOBuscarEntidades();

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


  crearEntidadTabla(){
    const dialogRef = this.dialog.open(CrearEntidadComponent, {width:'25%'});

    dialogRef.afterClosed().subscribe(resp => {
      if (resp) {
        this.cargarOBuscarEntidades()
      }
    })
  }

  crearEntidadCombo(){
    this.dialog
    .open(CrearEntidadComponent, {width:'25%'})
    .afterClosed().subscribe(resp => {
      if (resp) {
        this.cargarOBuscarEntidades()
      }
    })
  }

  // eliminar ojo
  // actualizarEntidadX(id: any) {
  //   this.dialog
  //     .open(ActualizarEntidadComponent, { width: '55%', data: id, })
  //     .afterClosed().subscribe((resp) => {
  //       if (resp) {
  //         this.cargarOBuscarEntidades();
  //       }
  //     });
  // }

  actualizarEntidad(id: any) {
    console.log('IDXX',id);
    this.dialog
      .open(CrearEntidadComponent, { width: '55%', data: id})
      .afterClosed().subscribe((val) => {
        if (val == 'update') {
          this.cargarOBuscarEntidades();
        }
      });
  }

}
