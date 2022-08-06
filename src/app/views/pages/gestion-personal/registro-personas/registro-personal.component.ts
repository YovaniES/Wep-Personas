import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

import { PersonalService } from 'src/app/core/services/personal.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { of } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { ActualizarPersonalComponent } from './actualizar-personal/actualizar-personal.component';
import { CrearPersonalComponent } from './crear-personal/crear-personal.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-registro-personas',
  templateUrl: './registro-personal.component.html',
  styleUrls: ['./registro-personal.component.scss']
})
export class RegistroPersonalComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  loadingItem: boolean = false;
  userId!: number;
  filtroForm!: FormGroup;

  page = 1;
  totalPersonal: number = 0;
  pageSize = 10;
  pageSizes = [3, 6, 9];

  constructor(
    private personalService: PersonalService,
    private authService: AuthService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    public datepipe: DatePipe,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.newFilfroForm();
    this.cargarOBuscarPersonal();
    this.getCodProyectos();
  }

  newFilfroForm(){
    this.filtroForm = this.fb.group({
      nombres           : [''],
      apellidos         : [''],
      dni               : [''],
      codProy           : [''],
      fechaIngresoInicio: [''],
      fechaIngresoFin   : [''],
    })
  }

  getUsuario(){
    this.authService.getCurrentUser().subscribe( resp => {
      this.userId   = resp.user.userId;
      // console.log('ID-USER', this.userId);
    })
   }

  listaPersonal: any[] = [];
  cargarOBuscarPersonal(){
    this.blockUI.start("Cargando personal...");
    let parametro: any[] = [{
      "queryId": 30,
      "mapValue": {
          nombre         : this.filtroForm.value.nombres + " " + this.filtroForm.value.apellidos,
          dni            : this.filtroForm.value.dni,
          codigo_proyecto: this.filtroForm.value.codProy,
          inicio         : this.datepipe.transform(this.filtroForm.value.fechaIngresoInicio,"yyyy/MM/dd"),
          fin            : this.datepipe.transform(this.filtroForm.value.fechaIngresoFin,"yyyy/MM/dd"),
      }
    }];
    this.personalService.cargarOBuscarPersonal(parametro[0]).subscribe(resp => {
    this.blockUI.stop();

     console.log('Lista-Personal', resp, resp.length);
      this.listaPersonal = [];
      this.listaPersonal = resp;

      this.spinner.hide();
    });
  }

  listCodProy: any[] = [];
  getCodProyectos(){
    let arrayParametro: any[] = [{queryId: 1}];

    this.personalService.getCodProyectos(arrayParametro[0]).subscribe((resp) => {
            this.listCodProy = resp;
            console.log('COD_PROY', resp);

    });
  }

  eliminarPersonal(id: number){
    this.spinner.show();

    let parametro:any[] = [{
      queryId: 37,
      mapValue: {
        param_id_persona: id,
        // CONFIG_USER_ID: this.userId,
        // CONFIG_OUT_MSG_ERROR: "",
        // CONFIG_OUT_MSG_EXITO: "",
      }
    }];
    Swal.fire({
      title: '¿Eliminar Personal?',
      text: `¿Estas seguro que deseas eliminar al personal: ${id} ?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar!',
    }).then((resp) => {
      if (resp.value) {
        this.personalService.eliminarPersonal(parametro[0]).subscribe(resp => {

          this.cargarOBuscarPersonal();

            Swal.fire({
              title: 'Eliminar Personal',
              text: `El Personal: ${id}, fue eliminado con éxito`,
              icon: 'success',
            });
          });
      }
    });
    this.spinner.hide();
  }

  limpiarFiltro() {
    this.filtroForm.reset('', {emitEvent: false})

    this.cargarOBuscarPersonal();
  }

  totalfiltro = 0;
  cambiarPagina(event: number) {
    let offset = event*10;
    this.spinner.show();

    if (this.totalfiltro != this.totalPersonal) {
      this.personalService.cargarOBuscarPersonal(offset.toString()).subscribe( resp => {
            this.listaPersonal = resp;
            this.spinner.hide();
          });
    } else {
      this.spinner.hide();
    }
      this.page = event;
  }

  crearPersonal(){
    const dialogRef = this.dialog.open(CrearPersonalComponent, {width:'55%'});

    dialogRef.afterClosed().subscribe(resp => {
      if (resp) {
        this.cargarOBuscarPersonal()
      }
    })
  }

  actualizarPersonal(id: any) {
    this.dialog
      .open(ActualizarPersonalComponent, { width: '55%', data: id, })
      .afterClosed().subscribe((resp) => {
        if (resp) {
          this.cargarOBuscarPersonal();
        }
      });
  }
}
