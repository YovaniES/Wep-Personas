import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/core/services/auth.service';
import { PersonalService } from 'src/app/core/services/personal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-entidadlista',
  templateUrl: './modal-entidadlista.component.html',
  styleUrls: ['./modal-entidadlista.component.scss']
})
export class ModalEntidadlistaComponent implements OnInit {

  userID: number = 0;
  entidadListaForm!: FormGroup;

  constructor(
    private personalService: PersonalService,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ModalEntidadlistaComponent>,
    @Inject(MAT_DIALOG_DATA) public DATA_ENTIDAD: any
  ) { }

  ngOnInit(): void {
    this.newForm();
    this.getListEntidades();

    this.cargarListaEntidad();
    this.cargarTablaEntidad();
  }

  newForm(){
    this.entidadListaForm = this.fb.group({
      nombre      : ['', Validators.required],
      descripcion : [''],
      entidad     : [''],

      idPadre     : ['']
    })
  }

  crearOactualizarListaEntidad(){
    if (!this.DATA_ENTIDAD) {
      if (this.entidadListaForm.valid) {this.crearEntidadCombo()}
    } else {
      this.actualizarListaEntidad();
    }
  }

  crearOactualizarTablaEntidad(){
    if (!this.DATA_ENTIDAD) {
      if (this.entidadListaForm.valid) {this.crearEntidadTabla()}
    } else {
      this.actualizarTablaEntidad();
    }
  }


  btnAction: string = 'Registrar'
  cargarListaEntidad(){
    if (this.DATA_ENTIDAD) {
      this.btnAction = 'Actualizar'

    }
  }

  cargarTablaEntidad(){
    if (this.DATA_ENTIDAD) {
      this.btnAction = 'Actualizar'

    }
  }

  actualizarListaEntidad(){

  }

  actualizarTablaEntidad(){

  }

  crearEntidadCombo() {
    this.spinner.show();
    const formValues = this.entidadListaForm.getRawValue();

    let parametro: any =  {
        queryId: 49,
        mapValue: {
          "param_nombre"        : formValues.nombre,
          "param_descripcion"   : formValues.descripcion,
          "param_padre_id"      : formValues.idPadre,
          "CONFIG_USER_ID"      : this.userID,
          "CONFIG_OUT_MSG_ERROR":'',
          "CONFIG_OUT_MSG_EXITO":''
        },
      };
     console.log('AGREG-COMBO', this.entidadListaForm.value , parametro);
    this.personalService.crearEntidadCombo(parametro).subscribe((resp: any) => {
      Swal.fire({
        title: 'Crear lista Entidad!',
        text: `Entidad: ${formValues.nombre}, creado con éxito`,
        icon: 'success',
        confirmButtonText: 'Ok',
      });
      this.close(true);
    });
    this.spinner.hide();
  }

  crearEntidadTabla() {
    this.spinner.show();
    const formValues = this.entidadListaForm.getRawValue();

    let parametro: any =  {
        queryId: 52,
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
     console.log('VAOR', this.entidadListaForm.value , parametro);
    this.personalService.crearEntidadTabla(parametro).subscribe((resp: any) => {
      Swal.fire({
        title: 'Crear Entidad!',
        text: `Entidad: ${formValues.modelo}, creado con éxito`,
        icon: 'success',
        confirmButtonText: 'Ok',
      });
      this.close(true);
    });
    this.spinner.hide();
  }

  campoNoValido(campo: string): boolean {
    if ( this.entidadListaForm.get(campo)?.invalid && this.entidadListaForm.get(campo)?.touched ) {
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
