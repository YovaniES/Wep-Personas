import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgxSpinnerService } from 'ngx-spinner';
import { PersonalService } from 'src/app/core/services/personal.service';
import Swal from 'sweetalert2';
import { ModalEntidadComponent } from './modal-entidad/modal-entidad.component';

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

    this.getListTotalTablas();
    // this.cargarOBuscarEntidades(3);
  }

  newFilfroForm(){
    this.filtroForm = this.fb.group({
      entidad  : [''],
    })
  }

  totaltablas = {
    id: "",
  };

  idPadre     : any
  nombre      : any
  tablaEntidad: any
  getInfoTotalTablaEntidad(id: any, evento: any) {
    this.totaltablas.id = id;
    this.idPadre = evento.target["options"][evento.target["options"].selectedIndex].id;
    this.nombre  = evento.target["options"][evento.target["options"].selectedIndex].innerText;
    this.tablaEntidad = [];

    this.cargarOBuscarEntidades(id);
  }


  listEntidadX: any[] = [];
  cargarOBuscarEntidades(id: any){
    this.blockUI.start("Cargando lista de entidades...");

    let parametro: any[] = [{
      "queryId": 48,
      "mapValue": { param_id_tabla: id }
    }];
    this.personalService.cargarOBuscarEntidades(parametro[0]).subscribe(resp => {
    this.blockUI.stop();

     console.log('ID_TABLA_ENTIDAD', resp, [resp.length]);
      this.listEntidadX = [];
      this.listEntidadX = resp;

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
      text : `¿Estas seguro que deseas eliminar la Cuenta: ${id} ?`,
      icon : 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor : '#d33',
      confirmButtonText : 'Si, Eliminar!',
    }).then((resp) => {
      if (resp.value) {
        this.personalService.eliminarHardware(parametro[0]).subscribe(resp => {

          // this.cargarOBuscarEntidades();
            Swal.fire({
              title: 'Eliminar Hardware',
              text : `El Hardware: ${id}, fue eliminado con éxito`,
              icon : 'success',
            });
          });
      }
    });
    this.spinner.hide();
  }


  crearEntidadCombo(){
    this.dialog.open(ModalEntidadComponent, {width:'25%'})
               .afterClosed().subscribe(resp => {
      if (resp) {
        // this.cargarOBuscarEntidades()
      }
    })
  }

  crearEntidadTabla(){
    this.dialog.open(ModalEntidadComponent, {width:'25%'})
               .afterClosed().subscribe(resp => {
            if (resp) {
              // this.cargarOBuscarEntidades()
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


  totalfiltro = 0;
  cambiarPagina(event: number) {
    let offset = event * 10;
    this.spinner.show();

    if (this.totalfiltro != this.totalEntidad) {
      this.personalService
        .cargarOBuscarPersonal(offset.toString()).subscribe((resp: any) => {
          this.listEntidadX = resp.list;
          this.spinner.hide();
        });
    } else {
      this.spinner.hide();
    }
    this.page = event;
  }

  listEntidad: any[] = [];
  getListEntidades(){
    let parametro: any[] = [{queryId: 47}];

    this.personalService.getListEntidades(parametro[0]).subscribe((resp: any) => {
      this.listEntidad = resp.list;

      console.log('List-Ent', this.listEntidad, this.listEntidad.length);

    });
  }

  // datosInfoEntidad = {
  //   nombre     : "",
  //   descripcion: "",
  //   idPadre    : "",
  // };

  // getEntidadesTabla(id: any) {
  //   this.datosInfoEntidad.idPadre = id;
  // }

  listTablas: any[] = [];
  getListTotalTablas(){
    let parametro: any[] = [{ queryId: 47}]
    this.personalService.getListTotalTablas(parametro[0]).subscribe( (resp: any) => {
      this.listTablas = resp;

      console.log('listado', this.listTablas);

    })
  }

  actualizarEntidad(DATA: any) {
    console.log('DATA_ENTIDAD',DATA);
    this.dialog
      .open(ModalEntidadComponent, { width: '25%', data: DATA})
      .afterClosed().subscribe((val) => {
        if (val == 'Actualizar') {
          // this.cargarOBuscarEntidades();
        }
      });
  }




}
