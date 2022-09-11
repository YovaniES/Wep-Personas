import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/core/services/auth.service';
import { PersonalService } from 'src/app/core/services/personal.service';
import { VacacionesPersonalService } from 'src/app/core/services/vacaciones-personal.service';
import Swal from 'sweetalert2';
import { AsignarVacacionesComponent } from './asignar-vacaciones/asignar-vacaciones.component';

@Component({
  selector: 'app-modal-vacaciones',
  templateUrl: './modal-vacaciones.component.html',
  styleUrls: ['./modal-vacaciones.component.scss']
})
export class ModalVacacionesComponent implements OnInit {

  @BlockUI() blockUI!: NgBlockUI;
  loadingItem: boolean = false;
  vacacionesForm!: FormGroup;

  constructor(
    private personalService: PersonalService,
    private vacacionesService: VacacionesPersonalService,
    private authService: AuthService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    public datePipe: DatePipe,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<ModalVacacionesComponent>,
    @Inject(MAT_DIALOG_DATA) public DATA_VACACIONES: any
  ) { }

  ngOnInit(): void {
    this.newForm();
    this.cargarVacacionesById();
    this.getHistoricoCambiosProyecto(this.DATA_VACACIONES);
    this.getUsuario();
    this.cargarVacacionesAsignado();
    this.ListaCuentaAsignado();
    this.getLstSistemaVacaciones();
    console.log('DATA_VACACIONES', this.DATA_VACACIONES);
  }

    newForm(){
      this.vacacionesForm = this.fb.group({
       idPersonal   : [''],
       nombre       : ['', [Validators.required]],
       apPaterno    : [''],
       apMaterno    : [''],
       codCorp      : [''],
       fechaIngreso : [''],
       id_proyecto  : [''],
       estado       : [''],
       proyecto     : [''],

       idSistema    : [''],
       periodoVac   : ['']
      })
     }

  actualizarPersonalVacaciones(){
    this.spinner.show();

    const formValues = this.vacacionesForm.getRawValue();
    let parametro: any[] = [{
        queryId: 8,
        mapValue: {
          param_id_persona        : formValues.idPersonal,
          param_codigo_corporativo: formValues.codCorp,
          param_nombres           : formValues.nombre,
          param_apellido_paterno  : formValues.apPaterno,
          param_apellido_materno  : formValues.apMaterno,
          param_dni               : formValues.dni,
          param_correo            : formValues.correo,
          param_fecha_ingreso     : formValues.fechaIngreso,
          param_fecha_nacimiento  : formValues.fechaNacimiento,
          param_id_proyecto       : formValues.id_proyecto,
          param_id_perfil         : formValues.codPerfil,
          param_id_sistema        : formValues.idSistema,
          param_periodo           : formValues.periodoVac,
          param_estado            : 1,
          CONFIG_USER_ID          : this.userID,
          CONFIG_OUT_MSG_ERROR    : "",
          CONFIG_OUT_MSG_EXITO    : "",
        },
      }];
    this.vacacionesService.actualizarPersonalVacaciones(parametro[0]).subscribe( resp => {
      this.spinner.hide();
      console.log('DATA_ACTUALIZADO', resp);

      this.cargarVacacionesById();
      this.close(true)

      Swal.fire({
        title: 'Actualizar Vacaciones!',
        text : `La vacación:  ${ formValues.nombre +' '+formValues.apPaterno }, fue actualizado con éxito`,
        icon : 'success',
        confirmButtonText: 'Ok'
        })
    });
  };

  cargarVacacionesById(){
    this.spinner.show();
        this.vacacionesForm.controls['idPersonal' ].setValue(this.DATA_VACACIONES.id);
        this.vacacionesForm.controls['nombre'     ].setValue(this.DATA_VACACIONES.nombres);
        this.vacacionesForm.controls['apPaterno'  ].setValue(this.DATA_VACACIONES.apellido_paterno);
        this.vacacionesForm.controls['apMaterno'  ].setValue(this.DATA_VACACIONES.apellido_materno);
        this.vacacionesForm.controls['codCorp'    ].setValue(this.DATA_VACACIONES.codigo_corporativo);
        this.vacacionesForm.controls['proyecto'   ].setValue(this.DATA_VACACIONES.codigo_proyecto);
        this.vacacionesForm.controls['id_proyecto'].setValue(this.DATA_VACACIONES.id_proyecto);
        this.vacacionesForm.controls['estado'     ].setValue(this.DATA_VACACIONES.estado);

        this.vacacionesForm.controls['idSistema' ].setValue(this.DATA_VACACIONES.id_sistema);
        // this.vacacionesForm.controls['periodoVac' ].setValue(this.DATA_VACACIONES.periodo);

        if (this.DATA_VACACIONES.fecha_ingreso) {
          let fechaIngr = this.DATA_VACACIONES.fecha_ingreso
          const str   = fechaIngr.split('/');
          const year  = Number(str[2]);
          const month = Number(str[1]);
          const date  = Number(str[0]);
          this.vacacionesForm.controls['fechaIngreso'].setValue(this.datePipe.transform(new Date(year, month-1, date), 'yyyy-MM-dd'))
        }
      this.spinner.hide();
  }

  eliminarVacaciones(idRecurso: number){
    this.spinner.show();

    let parametro:any[] = [{
      "queryId": 26,
      "mapValue": {
        "param_id_persona"    : this.DATA_VACACIONES.id,
        "param_id_recurso"    : idRecurso,
        "CONFIG_USER_ID"      : this.userID,
        "CONFIG_OUT_MSG_ERROR": '',
        "CONFIG_OUT_MSG_EXITO": ''
      }
    }];
      Swal.fire({
        title: 'Eliminar vacaciones?',
        text: `¿Estas seguro que desea Eliminar la vacación: ${idRecurso}?`,
        icon: 'question',
        confirmButtonColor: '#ec4756',
        cancelButtonColor : '#0d6efd',
        confirmButtonText : 'Si, Desasignar!',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
      }).then((resp) => {
        if (resp.value) {
          this.vacacionesService.eliminarVacaciones(parametro[0]).subscribe(resp => {
            this.cargarVacacionesAsignado();
            this.ListaCuentaAsignado();

              Swal.fire({
                title: 'Eliminar vacaciones',
                text : `La vacación: ${idRecurso}, fue eliminado con éxito`,
                icon : 'success',
              });
            });
        }
    });
    this.spinner.hide();
  }

  listVacacionesAsignado: any[]=[];
  cargarVacacionesAsignado(){
    this.listVacacionesAsignado = [];

    this.spinner.show();
    let parametro:any[] = [{
      "queryId": 128,
      "mapValue": {
      "p_id_persona": this.DATA_VACACIONES.id,
      }
    }];

    this.vacacionesService.cargarVacacionesAsignado(parametro[0]).subscribe( (resp: any) => {
      this.listVacacionesAsignado = resp.list;
      console.log('VACACIONES-ASIG', resp.list);
    })
  }


  totalCuentaAsignado: number = 0;
  listCuentaAsignado: any[]=[];
  ListaCuentaAsignado(){
    this.spinner.show();
    let parametro:any[] = [{
      "queryId": 28,
      "mapValue": {
      "param_id_persona": this.DATA_VACACIONES.id,
      }
    }];

    this.personalService.ListaCuentaAsignado(parametro[0]).subscribe( (resp: any) => {
      this.listCuentaAsignado = resp.list;
      this.totalCuentaAsignado = resp.list.length;
      // console.log('CUENT-ASIG', resp.list, this.totalCuentaAsignado);
    })
  }

  histCambiosProyecto: any[] = [];
  getHistoricoCambiosProyecto(id: number){
  this.spinner.show();
    let parametro: any[] = [{ queryId: 57, mapValue: {
        param_id_persona: this.DATA_VACACIONES.id,
      }
    }];
    this.personalService.getHistoricoCambiosProyecto(parametro[0]).subscribe((resp: any) => {
      this.histCambiosProyecto = resp.list;
      // console.log('ListHistCambID', resp)
    });
    this.spinner.hide();
  }

  listSistemaVacaciones: any[] = [];
  getLstSistemaVacaciones(){
  let parametro: any[] = [{ queryId: 126}];
  this.vacacionesService.getLstSistemaVacaciones(parametro[0]).subscribe((resp: any) => {
    this.listSistemaVacaciones = resp.list;
    console.log('SISTEMA-ASIG_VAC', resp.list);
    })
  }

  userID: number = 0;
  getUsuario(){
   this.authService.getCurrentUser().subscribe( resp => {
     this.userID   = resp.user.userId;
     // console.log('ID-USER', this.userID);
   })
  };

  close(succes?: boolean) {
    this.dialogRef.close(succes);
  }

  campoNoValido(campo: string): boolean {
    if ( this.vacacionesForm.get(campo)?.invalid && (this.vacacionesForm.get(campo)?.dirty || this.vacacionesForm.get(campo)?.touched) ) {
      return true;
    } else {
      return false;
    }
  }

  asignarVacaciones(){
    const dialogRef = this.dialog.open(AsignarVacacionesComponent, { width:'35%', data: {vacForm: this.vacacionesForm.value, isCreation: true} });

    dialogRef.afterClosed().subscribe(resp => {
      if (resp) {
        this.cargarVacacionesAsignado()
      }
    })
  };


  actualizarVacaciones(DATA: any){
    console.log('DATA_VACACIONES', DATA);
    // const DATA = this.facturaForm.value
    const dialogRef = this.dialog.open(AsignarVacacionesComponent, { width:'35%', data: DATA});

    dialogRef.afterClosed().subscribe(resp => {
      if (resp) {
        this.cargarVacacionesAsignado()
      }
    })
  };
}
