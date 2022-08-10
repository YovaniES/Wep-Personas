import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/core/services/auth.service';
import { PersonalService } from 'src/app/core/services/personal.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-crear-cuenta',
  templateUrl: './crear-cuenta.component.html',
  styleUrls: ['./crear-cuenta.component.scss']
})
export class CrearCuentaComponent implements OnInit {
  userID: number = 0;
  cuentaForm!: FormGroup;

  constructor(
    private personalService: PersonalService,
    private authService: AuthService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private dialogRef: MatDialogRef<CrearCuentaComponent>,
    @Inject(MAT_DIALOG_DATA) public DATA: any


  ) { }

  ngOnInit(): void {
    this.newForm();
    this.getListTiposCuentas();
    // console.log('ID_DATA', this.DATA);
    this.userId();
  }


  userId() {
    this.authService.getCurrentUser().subscribe((resp) => {
      this.userID = resp.userId;
      // console.log('ID-USER', this.userID);
    });
  }

  newForm(){
   this.cuentaForm = this.fb.group({
    usuario : ['', [Validators.required]],
    password: ['', [Validators.required]],
    idTipo  : ['', [Validators.required]],
   })
  }

  tipos: any[] = [];
  getListTiposCuentas() {
    let Parametro: any[] = [{ queryId: 40}];
    this.personalService.getListTiposCuentas(Parametro[0]).subscribe((resp) => {
      this.tipos = resp;

      // console.log('TIPOS', resp);
    });
  }


  crearCuenta() {
    console.log('CUENTAS', this.cuentaForm.value);

        this.spinner.show();
    const formValues = this.cuentaForm.getRawValue();

    let parametro: any =  {
        queryId: 19,
        mapValue: {
          param_usuario       : formValues.usuario,
          param_password      : formValues.password,
          param_id_tipo       : formValues.idTipo,
          CONFIG_USER_ID      : this.userID,
          CONFIG_OUT_MSG_ERROR: "",
          CONFIG_OUT_MSG_EXITO: "",
        },
      };
    //  console.log('VAOR', this.cuentaForm.value , parametro);
    this.personalService.crearCuenta(parametro).subscribe((resp: any) => {
      Swal.fire({
        title: 'Crear cuenta!',
        text: `Cuenta: ${formValues.usuario} , creado con éxito`,
        icon: 'success',
        confirmButtonText: 'Ok',
      });
      this.close(true);
    });
      this.spinner.hide();
  }


  // actualizarCuenta() {
  //   this.spinner.show();

  //   const formValues = this.cuentaForm.getRawValue();
  //   let parametro: any[] = [{
  //       queryId: 20,
  //       mapValue: {
  //         param_id_recurso              : formValues.id,
  //         param_usuario                 : formValues.usuario,
  //         param_password                : formValues.password,
  //         param_id_tipo                 : formValues.idTipo,
  //         param_fecha_ultima_renovacion : formValues.fechaUltimaRenovacion,
  //         param_fecha_proxima_renovacion: formValues.fechaProximaRenovacion,
  //         CONFIG_USER_ID                : this.userID,
  //         CONFIG_OUT_MSG_ERROR          : "",
  //         CONFIG_OUT_MSG_EXITO          : "",
  //       },
  //     }];
  //   this.personalService.actualizarCuenta(parametro[0]).subscribe({
  //       next: (res) => {
  //       this.spinner.hide();

  //       this.cargarCuentasById();
  //       this.close(true)

  //         Swal.fire({
  //           title: 'Actualizar Cuenta!',
  //           text : `La cuenta de:  ${formValues.usuario }, se actualizó con éxito`,
  //           icon : 'success',
  //           confirmButtonText: 'Ok'
  //           });

  //         this.cuentaForm.reset();
  //         this.dialogRef.close('update');
  //       }, error:()=>{
  //         Swal.fire(
  //           'ERROR',
  //           'No se pudo actualizar el usuario',
  //           'warning'
  //         );
  //       }
  //     });
  // }

  // cargarCuentasById(){

  //   if (this.DATA) {
  //     this.spinner.show();
  //     let parametro: any[] = [{
  //       queryId: 43,
  //       mapValue: {'param_id_cuenta': this.DATA.id}
  //     }];

  //     this.personalService.cargarCuentasById(parametro[0]).subscribe( (resp: any) => {

  //       console.log('LISTA-EDITAR', resp );
  //       for (let i = 0; i < resp.list.length; i++) {
  //         this.cuentaForm.controls['id'                    ].setValue(this.DATA.id);
  //         this.cuentaForm.controls['tipo'                  ].setValue(this.DATA.tipo);
  //         this.cuentaForm.controls['idTipo'                ].setValue(this.DATA.id_tipo);
  //         this.cuentaForm.controls['usuario'               ].setValue(this.DATA.usuario);
  //         this.cuentaForm.controls['password'              ].setValue(this.DATA.password);
  //         this.cuentaForm.controls['fechaUltimaRenovacion' ].setValue(this.DATA.fecha_ultima_renovacion);
  //         this.cuentaForm.controls['fechaProximaRenovacion'].setValue(this.DATA.fecha_proxima_renovacion);
  //       }
  //       this.spinner.hide();
  //     })
  //   }
  // }

  campoNoValido(campo: string): boolean {
    if (
      this.cuentaForm.get(campo)?.invalid &&
      this.cuentaForm.get(campo)?.touched
    ) {
      return true;
    } else {
      return false;
    }
  }


  close(succes?: boolean) {
    this.dialogRef.close(succes);
  }
}


