import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/core/services/auth.service';
import { PersonalService } from 'src/app/core/services/personal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-actualizar-cuenta',
  templateUrl: './actualizar-cuenta.component.html',
  styleUrls: ['./actualizar-cuenta.component.scss']
})
export class ActualizarCuentaComponent implements OnInit {
  userID: number = 0;
  cuentaForm!: FormGroup;

  constructor(
    private personalService: PersonalService,
    private authService: AuthService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private dialogRef: MatDialogRef<ActualizarCuentaComponent>,
    @Inject(MAT_DIALOG_DATA) public ID_REG_CUENTA: any
  ) { }

  ngOnInit(): void {
    this.newForm();
    this.getListTiposCuentas();
    this.cargarCuentasById();
  }


  newForm(){
    this.cuentaForm = this.fb.group({
     id                    : [''],
     usuario               : [''],
     idTipo                : [''],
     tipo                  : [''],
     password              : [''],
     fechaUltimaRenovacion : [''],
     fechaProximaRenovacion: [''],
    })
   }

   getUsuario(){
    this.authService.getCurrentUser().subscribe( resp => {
      this.userID   = resp.user.userId;
      // console.log('ID-USER', this.userID);
    })
   }

   tipos: any[] = [];
   getListTiposCuentas() {
     let Parametro: any[] = [{ queryId: 40}];
     this.personalService.getListTiposCuentas(Parametro[0]).subscribe((resp) => {
       this.tipos = resp;
     });
   }

   actualizarCuenta(){
    this.spinner.show();

    const formValues = this.cuentaForm.getRawValue();
    let parametro: any[] = [{
        queryId: 20,
        mapValue: {
          param_id_recurso              : formValues.id,
          param_usuario                 : formValues.usuario,
          param_password                : formValues.password,
          param_id_tipo                 : formValues.idTipo,
          param_fecha_ultima_renovacion : formValues.fechaUltimaRenovacion,
          param_fecha_proxima_renovacion: formValues.fechaProximaRenovacion,
          CONFIG_USER_ID                : this.userID,
          CONFIG_OUT_MSG_ERROR          : "",
          CONFIG_OUT_MSG_EXITO          : "",
        },
      }];

    this.personalService.actualizarCuenta(parametro[0]).subscribe( resp => {
      this.spinner.hide();
      // console.log('DATA_ACTUALIZADO', resp);

      this.cargarCuentasById();
      this.close(true)

      Swal.fire({
        title: 'Actualizar Cuenta!',
        text : `La cuenta de:  ${formValues.usuario }, se actualizó con éxito`,
        icon : 'success',
        confirmButtonText: 'Ok'
        })
    });
  };


  cargarCuentasById(){
    this.spinner.show();
    let parametro: any[] = [{
      queryId: 43,
      mapValue: {'param_id_cuenta': this.ID_REG_CUENTA}
    }];

    this.personalService.cargarCuentasById(parametro[0]).subscribe( (resp: any) => {

      console.log('LISTA-EDITAR', resp );
      for (let i = 0; i < resp.list.length; i++) {
        this.cuentaForm.controls['id'                    ].setValue(resp.list[i].id);
        this.cuentaForm.controls['tipo'                  ].setValue(resp.list[i].tipo);
        this.cuentaForm.controls['idTipo'                ].setValue(resp.list[i].id_tipo);
        this.cuentaForm.controls['usuario'               ].setValue(resp.list[i].usuario);
        this.cuentaForm.controls['password'              ].setValue(resp.list[i].password);
        this.cuentaForm.controls['fechaUltimaRenovacion' ].setValue(resp.list[i].fecha_ultima_renovacion);
        this.cuentaForm.controls['fechaProximaRenovacion'].setValue(resp.list[i].fecha_proxima_renovacion);
      }
      this.spinner.hide();
    })
  }


   close(succes?: boolean){
    this.dialogRef.close(succes);
  }
}
