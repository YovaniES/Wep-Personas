import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/core/services/auth.service';
import { PersonalService } from 'src/app/core/services/personal.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-actualizar-personas',
  templateUrl: './actualizar-personal.component.html',
  styleUrls: ['./actualizar-personal.component.scss']
})
export class ActualizarPersonalComponent implements OnInit {

  userID: number = 0;
  personalForm!: FormGroup;

  constructor(
    private personalService: PersonalService,
    private authService: AuthService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private dialogRef: MatDialogRef<ActualizarPersonalComponent>,
    @Inject(MAT_DIALOG_DATA) public ID_REG_PERSONAL: any

  ) { }

  ngOnInit(): void {
    this.newForm();
    this.getListMarcaHardware();
    this.getListTiposHardware();
    this.cargarPersonalById();
    // this.cargarCuentasById();
  }


  newForm(){
    this.personalForm = this.fb.group({
    //  idHardware  : [''],
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
      // console.log('ID-USER', this.userID);
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

   actualizarPersonal(){
    this.spinner.show();

    const formValues = this.personalForm.getRawValue();
    let parametro: any[] = [{
        queryId: 17,
        mapValue: {
          param_id_recurso    : formValues.idHardware,
          param_id_tipo       : formValues.idTipo,
          param_id_marca      : formValues.idMarca,
          param_descripcion   : formValues.descripcion,
          param_modelo        : formValues.modelo,
          param_serie         : formValues.serie,
          param_imei          : formValues.imei,
          param_observacion   : formValues.observacion,
          CONFIG_USER_ID      : this.userID,
          CONFIG_OUT_MSG_ERROR: "",
          CONFIG_OUT_MSG_EXITO: "",
        },
      }];

    this.personalService.actualizarPersonal(parametro[0]).subscribe( resp => {
      this.spinner.hide();
      console.log('DATA_ACTUALIZADO', resp);

      // this.cargarPersonalById();
      this.close(true)

      Swal.fire({
        title: 'Actualizar Personal!',
        text : `Personal:  ${formValues.modelo }, actualizado con éxito`,
        icon : 'success',
        confirmButtonText: 'Ok'
        })
    });
  };

  cargarPersonalById(){
    this.spinner.show();

    let parametro: any[] = [{
      queryId: 34,
      mapValue: {'param_id_hardware': this.ID_REG_PERSONAL}
    }];

    this.personalService.cargarPersonalById(parametro[0]).subscribe( (resp: any) => {

      console.log('LISTA-EDITAR', resp );
      for (let i = 0; i < resp.list.length; i++) {
        this.personalForm.controls['tipo'       ].setValue(resp.list[i].tipo);
        this.personalForm.controls['marca'      ].setValue(resp.list[i].marca);
        this.personalForm.controls['id_tipo'    ].setValue(resp.list[i].id_tipo);
        this.personalForm.controls['id_marca'   ].setValue(resp.list[i].id_marca);
        this.personalForm.controls['descripcion'].setValue(resp.list[i].descripcion);
        this.personalForm.controls['modelo'     ].setValue(resp.list[i].modelo);
        this.personalForm.controls['serie'      ].setValue(resp.list[i].serie);
        this.personalForm.controls['imei'       ].setValue(resp.list[i].imei);
        this.personalForm.controls['observacion'].setValue(resp.list[i].observacion);
      }
      this.spinner.hide();
    })
  }

  close(succes?: boolean) {
    this.dialogRef.close(succes);
  }
}
