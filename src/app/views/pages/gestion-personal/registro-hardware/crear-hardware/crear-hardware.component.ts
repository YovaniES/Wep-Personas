import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/core/services/auth.service';
import { PersonalService } from 'src/app/core/services/personal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-hardware',
  templateUrl: './crear-hardware.component.html',
  styleUrls: ['./crear-hardware.component.scss']
})
export class CrearHardwareComponent implements OnInit {
  userID: number = 0;
  hardwareForm!: FormGroup;

  constructor(
    private personalService: PersonalService,
    private authService: AuthService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private dialogRef: MatDialogRef<CrearHardwareComponent>,
  ) { }

  ngOnInit(): void {
    this.newForm();
    this.valueChanges();
    this.getListMarcaHardware();
    this.getListTiposHardware();
    this.getUsuario();
  }


  newForm(){
    this.hardwareForm = this.fb.group({
     tipo        : ['', [Validators.required]],
     marca       : ['', [Validators.required]],
     modelo      : ['', [Validators.required]],
     serie       : ['', [Validators.required]],
     imei        : [''],
     descripcion : [''],
     observacion : [''],
    })
   }


  valueChanges(){
    this.hardwareForm.get('modelo')?.valueChanges.subscribe((valor: string) => {
      this.hardwareForm.patchValue( {modelo: valor.toUpperCase()}, {emitEvent: false});
    });

    this.hardwareForm.get('serie')?.valueChanges.subscribe((valor: string) => {
      this.hardwareForm.patchValue( {serie: valor.toUpperCase()}, {emitEvent: false});
    })
  }

  getUsuario(){
    this.authService.getCurrentUser().subscribe( resp => {
      this.userID   = resp.user.userId;
      console.log('ID-USER', this.userID);
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
    const formValues = this.hardwareForm.getRawValue();

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
     console.log('VAOR', this.hardwareForm.value , parametro);
    this.personalService.crearHardware(parametro).subscribe((resp: any) => {
      Swal.fire({
        title: 'Crear Hardware!',
        text: `Hardware: ${formValues.modelo}, creado con éxito`,
        icon: 'success',
        confirmButtonText: 'Ok',
      });
      this.close(true);
    });
    this.spinner.hide();
  }


  campoNoValido(campo: string): boolean {
    if (
      this.hardwareForm.get(campo)?.invalid &&
      this.hardwareForm.get(campo)?.touched
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
