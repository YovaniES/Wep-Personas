import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
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

  ) { }

  ngOnInit(): void {
    this.newForm();
    this.getListTiposCuentas();
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
     console.log('VAOR', this.cuentaForm.value , parametro);
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
