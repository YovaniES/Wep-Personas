import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/core/services/auth.service';
import { PersonalService } from 'src/app/core/services/personal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-actualizar-hardware',
  templateUrl: './actualizar-hardware.component.html',
  styleUrls: ['./actualizar-hardware.component.scss']
})
export class ActualizarHardwareComponent implements OnInit {

  userID: number = 0;
  hardwareForm!: FormGroup;

  constructor(
    private personalService: PersonalService,
    private authService: AuthService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private dialogRef: MatDialogRef<ActualizarHardwareComponent>,
    @Inject(MAT_DIALOG_DATA) public ID_REG_HARDWARE: any

  ) { }

  ngOnInit(): void {
    this.newForm();
    this.getListMarcaHardware();
    this.getListTiposHardware();
    this.cargarHardwareById();
    this.getUsuario();

    console.log('VALUE', this.hardwareForm.value);
  }


  newForm(){
    this.hardwareForm = this.fb.group({
     id          : [''],
     tipo        : [''],
     marca       : [''],
     id_tipo     : [''],
     id_marca    : [''],
     descripcion : [''],
     modelo      : [''],
     serie       : [''],
     imei        : [''],
     observacion : [''],
    })
   }

   getUsuario(){
    this.authService.getCurrentUser().subscribe( resp => {
      this.userID   = resp.user.userId;
      console.log('ID-USER', this.userID);
    })
   }

   actualizarHardware(){
    this.spinner.show();

    const formValues = this.hardwareForm.getRawValue();
    let parametro: any[] = [{
        queryId: 17,
        mapValue: {
          param_id_recurso    : this.ID_REG_HARDWARE,
          param_id_tipo       : this.hardwareForm.value.id_tipo,
          param_id_marca      : this.hardwareForm.value.id_marca,
          param_descripcion   : this.hardwareForm.value.descripcion,
          param_modelo        : this.hardwareForm.value.modelo,
          param_serie         : this.hardwareForm.value.serie,
          param_imei          : this.hardwareForm.value.imei,
          param_observacion   : this.hardwareForm.value.observacion,
          CONFIG_USER_ID      : this.userID,
          CONFIG_OUT_MSG_ERROR: "",
          CONFIG_OUT_MSG_EXITO: "",
        },
      }];

    this.personalService.actualizarHardware(parametro[0]).subscribe( resp => {
      this.spinner.hide();
      console.log('DATA_ACTUALIZADO', resp);

      this.cargarHardwareById();
      this.close(true)

      Swal.fire({
        title: 'Actualizar Hardware!',
        text : `Hardware:  ${formValues.modelo }, actualizado con éxito`,
        icon : 'success',
        confirmButtonText: 'Ok'
        })
    });
  };

  cargarHardwareById(){
    this.spinner.show();

    let parametro: any[] = [{
      queryId: 34,
      mapValue: {'param_id_hardware': this.ID_REG_HARDWARE}
    }];

    this.personalService.cargarHardwareById(parametro[0]).subscribe( (resp: any) => {

      console.log('LISTA-EDITAR', resp );
      for (let i = 0; i < resp.list.length; i++) {
        this.hardwareForm.controls['tipo'       ].setValue(resp.list[i].tipo);
        this.hardwareForm.controls['marca'      ].setValue(resp.list[i].marca);
        this.hardwareForm.controls['id_tipo'    ].setValue(resp.list[i].id_tipo);
        this.hardwareForm.controls['id_marca'   ].setValue(resp.list[i].id_marca);
        this.hardwareForm.controls['descripcion'].setValue(resp.list[i].descripcion);
        this.hardwareForm.controls['modelo'     ].setValue(resp.list[i].modelo);
        this.hardwareForm.controls['serie'      ].setValue(resp.list[i].serie);
        this.hardwareForm.controls['imei'       ].setValue(resp.list[i].imei);
        this.hardwareForm.controls['observacion'].setValue(resp.list[i].observacion);
      }
      this.spinner.hide();
    })
  }

  listTipos: any[] = [];
  getListTiposHardware(){
    let parametro: any[] = [{queryId: 32}];

    this.personalService.getListTiposHardware(parametro[0]).subscribe((resp) => {
      this.listTipos = resp;
    });
  }


  listMarca: any[] = [];
  getListMarcaHardware(){
    let parametro: any[] = [{ queryId: 33 }];

    this.personalService.getListMarcaHardware(parametro[0]).subscribe((resp) => {
      this.listMarca = resp;
    });
  }

  close(succes?: boolean) {
    this.dialogRef.close(succes);
  }
}
