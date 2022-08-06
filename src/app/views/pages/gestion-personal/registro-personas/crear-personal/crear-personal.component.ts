import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/core/services/auth.service';
import { PersonalService } from 'src/app/core/services/personal.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-crear-personas',
  templateUrl: './crear-personal.component.html',
  styleUrls: ['./crear-personal.component.scss']
})
export class CrearPersonalComponent implements OnInit {
  userID: number = 0;
  personalForm!: FormGroup;

  constructor(
    private personalService: PersonalService,
    private authService: AuthService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private dialogRef: MatDialogRef<CrearPersonalComponent>,
  ) { }

  ngOnInit(): void {
    this.newForm();
    this.valueChanges();
    this.getListMarcaHardware();
    this.getListTiposHardware();

  }


  newForm(){
    this.personalForm = this.fb.group({
     tipo        : ['', [Validators.required]],
     marca       : ['', [Validators.required]],
     modelo      : ['', [Validators.required]],
     serie       : ['', [Validators.required]],
     imei        : ['', [Validators.required]],
     descripcion : ['', [Validators.required]],
     observacion : ['', [Validators.required]],

     nombre         : [''],
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
    })
   }


  valueChanges(){
    this.personalForm.get('modelo')?.valueChanges.subscribe((valor: string) => {
      this.personalForm.patchValue( {modelo: valor.toUpperCase()}, {emitEvent: false});
    });

    this.personalForm.get('serie')?.valueChanges.subscribe((valor: string) => {
      this.personalForm.patchValue( {serie: valor.toUpperCase()}, {emitEvent: false});
    })
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

  crearHardware() {
    this.spinner.show();
    const formValues = this.personalForm.getRawValue();

    let parametro: any =  {
        queryId: 16,
        mapValue: {
          param_id_tipo       : formValues.tipo,
          param_id_marca      : formValues.marca,
          param_descripcion   : formValues.descripcion,
          param_modelo        : formValues.modelo,
          param_serie         : formValues.serie,
          param_imei          : formValues.imei,
          param_observacion   : formValues.observacion,
          CONFIG_USER_ID      : this.userID,
          CONFIG_OUT_MSG_ERROR: "",
          CONFIG_OUT_MSG_EXITO: "",
        },
      };
     console.log('VAOR', this.personalForm.value , parametro);
    this.personalService.crearHardware(parametro).subscribe((resp: any) => {
      Swal.fire({
        title: 'Crear Personal!',
        text: `Personal: ${formValues.modelo}, creado con éxito`,
        icon: 'success',
        confirmButtonText: 'Ok',
      });
      this.close(true);
    });
    this.spinner.hide();
  }


  campoNoValido(campo: string): boolean {
    if (
      this.personalForm.get(campo)?.invalid &&
      this.personalForm.get(campo)?.touched
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
