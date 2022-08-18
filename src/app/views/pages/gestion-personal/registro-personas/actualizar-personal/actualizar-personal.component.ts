import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/core/services/auth.service';
import { PersonalService } from 'src/app/core/services/personal.service';
import Swal from 'sweetalert2';
import { AsignarHardwareComponent } from './agregar-hardware/asignar-hardware.component';
import { AsignarCuentaComponent } from './asignar-cuenta/asignar-cuenta.component';
@Component({
  selector: 'app-actualizar-personas',
  templateUrl: './actualizar-personal.component.html',
  styleUrls: ['./actualizar-personal.component.scss']
})
export class ActualizarPersonalComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  loadingItem: boolean = false;

  personalForm!: FormGroup;

  constructor(
    private personalService: PersonalService,
    private authService: AuthService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    public datePipe: DatePipe,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<ActualizarPersonalComponent>,
    @Inject(MAT_DIALOG_DATA) public ID_REG_PERSONAL: any
  ) { }

  ngOnInit(): void {
    this.newForm();
    this.cargarPersonalById();

    this.getListProyectos();
    this.getListPerfiles();
    this.getHistoricoCambiosProyecto(this.ID_REG_PERSONAL);
    this.getUsuario();

    this.ListaHardwareAsignado();
    this.ListaCuentaAsignado();
  }


    newForm(){
      this.personalForm = this.fb.group({
       idPersonal     : [''],
       nombre         : ['', [Validators.required]],
       apPaterno      : [''],
       apMaterno      : [''],
       dni            : [''],
       correo         : [''],
       fechaNacimiento: [''],
       codCorp        : [''],
       codPerfil      : [''],
       descPerfil     : [''],
       fechaIngreso   : [''],
       codProy        : [''],
       descProy       : [''],
       estado         : [''],
       perfil         : [''],
       proyecto       : [''],
      })
     }

   userID: number = 0;
   getUsuario(){
    this.authService.getCurrentUser().subscribe( resp => {
      this.userID   = resp.user.userId;
      // console.log('ID-USER', this.userID);
    })
   };

  actualizarPersonal(){
    this.spinner.show();

    const formValues = this.personalForm.getRawValue();
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
          param_id_proyecto       : formValues.codProy,
          param_id_perfil         : formValues.codPerfil,
          param_estado            : 1,
          CONFIG_USER_ID          : this.userID,
          CONFIG_OUT_MSG_ERROR    : "",
          CONFIG_OUT_MSG_EXITO    : "",
        },
      }];
    this.personalService.actualizarPersonal(parametro[0]).subscribe( resp => {
      this.spinner.hide();
      console.log('DATA_ACTUALIZADO', resp);

      this.cargarPersonalById();
      this.close(true)

      Swal.fire({
        title: 'Actualizar Personal!',
        text : `El Personal:  ${formValues.nombre +' '+formValues.apPaterno }, fue actualizado con éxito`,
        icon : 'success',
        confirmButtonText: 'Ok'
        })
    });
  };

  cargarPersonalById(){
    this.spinner.show();

    let parametro: any[] = [{
      queryId: 31,
      mapValue: {'param_id_persona': this.ID_REG_PERSONAL}
    }];

    this.personalService.cargarPersonalById(parametro[0]).subscribe( (resp: any) => {

      console.log('LISTA-EDITAR_BY_ID', resp );
      for (let i = 0; i < resp.list.length; i++) {
        this.personalForm.controls['idPersonal'].setValue(resp.list[i].id);
        this.personalForm.controls['nombre'    ].setValue(resp.list[i].nombres);
        this.personalForm.controls['apPaterno' ].setValue(resp.list[i].apellido_paterno);
        this.personalForm.controls['apMaterno' ].setValue(resp.list[i].apellido_materno);
        this.personalForm.controls['dni'       ].setValue(resp.list[i].dni);
        this.personalForm.controls['correo'    ].setValue(resp.list[i].correo);
        this.personalForm.controls['codCorp'   ].setValue(resp.list[i].codigo_corporativo);
        this.personalForm.controls['codPerfil' ].setValue(resp.list[i].id_perfil);
        this.personalForm.controls['perfil'    ].setValue(resp.list[i].perfil);
        this.personalForm.controls['proyecto'  ].setValue(resp.list[i].codigo_proyecto);
        this.personalForm.controls['codProy'   ].setValue(resp.list[i].id_codigo_proyecto);
        this.personalForm.controls['descProy'  ].setValue(resp.list[i].proyecto_descripcion);

        if (resp.list[i].fecha_ingreso !='null' && resp.list[i].fecha_ingreso != '') {
          let fechaIngr = resp.list[i].fecha_ingreso
          const str   = fechaIngr.split('/');
          const year  = Number(str[2]);
          const month = Number(str[1]);
          const date  = Number(str[0]);
          this.personalForm.controls['fechaIngreso'].setValue(this.datePipe.transform(new Date(year, month-1, date), 'yyyy-MM-dd'))
        }

        if (resp.list[i].fecha_nacimiento !='null' && resp.list[i].fecha_nacimiento != '') {
          let fechaNac = resp.list[i].fecha_nacimiento
          const str   = fechaNac.split('/');
          const year  = Number(str[2]);
          const month = Number(str[1]);
          const date  = Number(str[0]);
          this.personalForm.controls['fechaNacimiento'].setValue(this.datePipe.transform(new Date(year, month-1, date), 'yyyy-MM-dd'))
        }
        // this.personalForm.controls['estado'].setValue(resp.list[i].estado);
      }
      this.spinner.hide();
    })
  }

  eliminarPersonal(id: number){
    this.spinner.show();

    let parametro:any[] = [{
      queryId: 37,
      mapValue: {
        param_id_persona: id,
      }
    }];

    Swal.fire({
      title: '¿Eliminar Personal?',
      text: `¿Estas seguro que deseas eliminar al personal: ${id} ?`,
      icon: 'question',
      confirmButtonColor: '#ec4756',
      cancelButtonColor: '#0d6efd',
      confirmButtonText: 'Si, Eliminar!',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
    }).then((resp) => {
      if (resp.value) {
        this.personalService.eliminarPersonal(parametro[0]).subscribe(resp => {

          // this.cargarOBuscarPersonal();

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

  listHardwareAsignado: any[]=[];
  ListaHardwareAsignado(){
    this.spinner.show();
    let parametro:any[] = [{
      "queryId": 27,
      "mapValue": {
      "param_id_persona": this.ID_REG_PERSONAL,
      }
    }];

    this.personalService.ListaHardwareAsignado(parametro[0]).subscribe( (resp: any) => {
      this.listHardwareAsignado = resp.list;
      console.log('HARD-ASIG', resp.list), resp.list.length;
    })
  }

  listCuentaAsignado: any[]=[];
  ListaCuentaAsignado(){
    this.spinner.show();
    let parametro:any[] = [{
      "queryId": 28,
      "mapValue": {
      "param_id_persona": this.ID_REG_PERSONAL,
      }
    }];

    this.personalService.ListaCuentaAsignado(parametro[0]).subscribe( (resp: any) => {
      this.listCuentaAsignado = resp.list;
      console.log('CUENT-ASIG', resp.list), resp.list.length;
    })
  }

  histCambiosProyecto: any[] = [];
  getHistoricoCambiosProyecto(id: number){
  this.spinner.show();
    let parametro: any[] = [{
      queryId: 57,
      mapValue: {
        param_id_persona: this.ID_REG_PERSONAL,
      }
    }];

    this.personalService.getHistoricoCambiosProyecto(parametro[0]).subscribe((resp: any) => {
      this.histCambiosProyecto = resp;
      console.log('ListHistCambID', resp)
    });
    this.spinner.hide();
  }


  desasignarRecurso(idRecurso: number){
    this.spinner.show();

    let parametro:any[] = [{
      "queryId": 26,
      "mapValue": {
        "param_id_persona"    : this.ID_REG_PERSONAL,
        "param_id_recurso"    : idRecurso,
        "CONFIG_USER_ID"      : this.userID,
        "CONFIG_OUT_MSG_ERROR": '',
        "CONFIG_OUT_MSG_EXITO": ''
      }
    }];
    this.personalService.desasignarRecurso(parametro[0]).subscribe(resp => {
      const arrayData:any[] = Array.of(resp);

      // let msj = arrayData[0].exitoMessage;
      // this.showSuccess(msj);
      this.ngOnInit();
    });
    this.spinner.hide();
  }

  listProyectos: any[] = [];
  getListProyectos(){
    let parametro: any[] = [{queryId: 1}];

    this.personalService.getListProyectos(parametro[0]).subscribe((resp: any) => {
            this.listProyectos = resp;
            console.log('COD_PROY', resp);
    });
  };

  listPerfiles: any[] = [];
  getListPerfiles(){
    let parametro: any[] = [{queryId: 10}];

    this.personalService.getListPerfiles(parametro[0]).subscribe((resp) => {
            this.listPerfiles = resp;
            console.log('PERFILES', resp);
    });
  };

  close(succes?: boolean) {
    this.dialogRef.close(succes);
  }

  campoNoValido(campo: string): boolean {
    if ( this.personalForm.get(campo)?.invalid && (this.personalForm.get(campo)?.dirty || this.personalForm.get(campo)?.touched) ) {
      return true;
    } else {
      return false;
    }
  }

  agregarHardware(){
    const dialogRef = this.dialog.open(AsignarHardwareComponent, {width:'35%'});

    dialogRef.afterClosed().subscribe(resp => {
      if (resp) {
        this.ListaHardwareAsignado()
      }
    })
  }

  agregarCuenta(){
    const dialogRef = this.dialog.open(AsignarCuentaComponent, {width:'35%'});

    dialogRef.afterClosed().subscribe(resp => {
      if (resp) {
        this.ListaCuentaAsignado()
      }
    })
  };
}







