import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/core/services/auth.service';
import { PersonalService } from 'src/app/core/services/personal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-entidadtabla',
  templateUrl: './modal-entidadtabla.component.html',
  styleUrls: ['./modal-entidadtabla.component.scss']
})
export class ModalEntidadtablaComponent implements OnInit {

  userID: number = 0;
  entidadTablaForm!: FormGroup;

  constructor(
    private personalService: PersonalService,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ModalEntidadtablaComponent>,
    @Inject(MAT_DIALOG_DATA) public DATA_ENTIDAD: any
  ) { }

  ngOnInit(): void {
    this.newForm();
    this.getListEntidades();
    this.cargarTablaEntidadByID();
  }

  newForm(){
    this.entidadTablaForm = this.fb.group({
      nombre       : ['', Validators.required],
      descripcion  : [''],
      entidad      : [''],
      idPadre      : [''],

      idCorrelativo: [''],
      id_tabla     : ['']
    })
  }

  agregarOactualizarTablaEntidad(){
    if (!this.DATA_ENTIDAD) {
      if (this.entidadTablaForm.valid) {this.agregarEntidadTabla()}
    } else {
      this.actualizarTablaEntidad();
    }
  }


  btnAction: string = 'Agregar'
  cargarTablaEntidadByID(){
    if (this.DATA_ENTIDAD) {
      this.btnAction = 'Actualizar'
        this.entidadTablaForm.controls['idCorrelativo'].setValue(this.DATA_ENTIDAD.id);
        this.entidadTablaForm.controls['nombre'       ].setValue(this.DATA_ENTIDAD.nombre);
        this.entidadTablaForm.controls['descripcion'  ].setValue(this.DATA_ENTIDAD.descripcion);
        this.entidadTablaForm.controls['entidad'      ].setValue(this.DATA_ENTIDAD.entidad);
        this.entidadTablaForm.controls['id_tabla'      ].setValue(this.DATA_ENTIDAD.id_tabla)
        this.entidadTablaForm.controls['idPadre'      ].setValue(this.DATA_ENTIDAD.idPadre);
    }
  }


  actualizarTablaEntidad(){

  }




  agregarEntidadTabla() {
    this.spinner.show();
    const formValues = this.entidadTablaForm.getRawValue();

    let parametro: any =  {
        queryId: 1140000000000,
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
     console.log('VAOR', this.entidadTablaForm.value , parametro);
    this.personalService.agregarEntidadTabla(parametro).subscribe((resp: any) => {
      Swal.fire({
        title: 'Agregar Entidad!',
        text: `Entidad: ${formValues.modelo}, creado con éxito`,
        icon: 'success',
        confirmButtonText: 'Ok',
      });
      this.close(true);
    });
    this.spinner.hide();
  }

  campoNoValido(campo: string): boolean {
    if ( this.entidadTablaForm.get(campo)?.invalid && this.entidadTablaForm.get(campo)?.touched ) {
      return true;
    } else {
      return false;
    }
  }

  userId() {
    this.authService.getCurrentUser().subscribe((resp) => {
      this.userID = resp.userId;
      // console.log('ID-USER', this.userID);
    });
  }

  listEntidad: any[] = [];
  getListEntidades(){
    let arrayParametro: any[] = [{queryId: 47}];

    this.personalService.getListEntidades(arrayParametro[0]).subscribe((resp: any) => {
      this.listEntidad = resp.list;
    });
  }

  close(succes?: boolean) {
    this.dialogRef.close(succes);
  }

}
