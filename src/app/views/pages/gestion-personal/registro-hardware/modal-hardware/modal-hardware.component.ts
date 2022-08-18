import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/core/services/auth.service';
import { PersonalService } from 'src/app/core/services/personal.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-modal-hardware',
  templateUrl: './modal-hardware.component.html',
  styleUrls: ['./modal-hardware.component.scss']
})
export class ModalHardwareComponent implements OnInit {
  userID: number = 0;
  hardwareForm!: FormGroup;

  constructor(
    private personalService: PersonalService,
    private authService: AuthService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private dialogRef: MatDialogRef<ModalHardwareComponent>,
    @Inject(MAT_DIALOG_DATA) public EDIT_DATA: any
  ) { }

  ngOnInit(): void {
    this.newForm();
    this.valueChanges();
    this.getListMarcaHardware();
    this.getListTiposHardware();
    this.getUsuario();
    this.cargarHardwareByID();
    // console.log('EDIT_DATA', this.EDIT_DATA);
  }


  newForm(){
    this.hardwareForm = this.fb.group({
     tipo        : ['', [Validators.required]],
     marca       : ['', [Validators.required]],
     modelo      : ['', [Validators.required]],
     serie       : ['', [Validators.required]],
     imei        : [''],
     observacion : [''],
     equipo      : [''],
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

    if (!this.EDIT_DATA) {
      if (this.hardwareForm.valid) {
        const formValues = this.hardwareForm.getRawValue();
        let parametro: any =  {
            queryId: 16,
            mapValue: {
              param_id_tipo       : formValues.tipo,
              param_id_marca      : formValues.marca,
              param_descripcion   : formValues.equipo,
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
      }

    } else {
      this.actualizarHardware();
    }

    this.spinner.hide();
  }


  // MODAL ACTUALIZAR===============================================
  actualizarHardware(){
    this.spinner.show();

    const formValues = this.hardwareForm.getRawValue();
    let parametro: any[] = [{
        queryId: 17,
        mapValue: {
          param_id_recurso    : this.EDIT_DATA.id_recurso,
          param_id_tipo       : this.hardwareForm.value.tipo,
          param_id_marca      : this.hardwareForm.value.marca,
          param_descripcion   : this.hardwareForm.value.equipo,
          param_modelo        : this.hardwareForm.value.modelo,
          param_serie         : this.hardwareForm.value.serie,
          param_imei          : this.hardwareForm.value.imei,
          param_observacion   : this.hardwareForm.value.observacion,
          CONFIG_USER_ID      : this.userID,
          CONFIG_OUT_MSG_ERROR: "",
          CONFIG_OUT_MSG_EXITO: "",
        },
      }];

    this.personalService.actualizarHardware(parametro[0]).subscribe( {next: (resp) => {
      this.spinner.hide();

      console.log('DATA_ACTUALIZADO', resp);

      // this.cargarHardwareByID();
      this.dialogRef.close('actualizar')

      Swal.fire({
        title: 'Actualizar Hardware!',
        text : `Hardware:  ${formValues.modelo }, actualizado con éxito`,
        icon : 'success',
        confirmButtonText: 'Ok'
        })
    }, error: () => {
      Swal.fire(
        'ERROR',
        'No se pudo actualizar el usuario',
        'warning'
      );
    }});
  };

  actionBtn: string = 'Crear';
  cargarHardwareByID(){
    if (this.EDIT_DATA) {
      this.actionBtn = 'Actualizar'
        this.hardwareForm.controls['tipo'       ].setValue(this.EDIT_DATA.id_tipo);
        this.hardwareForm.controls['marca'      ].setValue(this.EDIT_DATA.id_marca);
        this.hardwareForm.controls['equipo'     ].setValue(this.EDIT_DATA.equipo);
        this.hardwareForm.controls['modelo'     ].setValue(this.EDIT_DATA.modelo);
        this.hardwareForm.controls['serie'      ].setValue(this.EDIT_DATA.serie);
        this.hardwareForm.controls['imei'       ].setValue(this.EDIT_DATA.imei);
        this.hardwareForm.controls['observacion'].setValue(this.EDIT_DATA.observacion);
    }
  }

  campoNoValido(campo: string): boolean {
    if ( this.hardwareForm.get(campo)?.invalid && this.hardwareForm.get(campo)?.touched ) {
      return true;
    } else {
      return false;
    }
  }

  close(succes?: boolean) {
    this.dialogRef.close(succes);
  }

}
