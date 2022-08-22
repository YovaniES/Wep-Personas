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
  entidadForm!: FormGroup;

  constructor(
    private personalService: PersonalService,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ModalEntidadlistaComponent>,
    @Inject(MAT_DIALOG_DATA) public DATA_ENTIDAD: any
  ) { }

  ngOnInit(): void {
    this.newEntidadForm();
    this.getListEntidades();
    this.cargarListaEntidadByID();
  }

  newEntidadForm(){
    this.entidadForm = this.fb.group({
      nombre      : ['', Validators.required],
      descripcion : [''],
      entidad     : [''],
      idPadre     : ['']
    })
  }

  crearOactualizarListaEntidad(){
    if (!this.DATA_ENTIDAD) {
      if (this.entidadForm.valid) {this.crearEntidadLista()}
    } else {
      this.actualizarListaEntidad();
    }
  }

  btnAction: string = 'Registrar'
  cargarListaEntidadByID(){
    if (this.DATA_ENTIDAD) {
      this.btnAction = 'Actualizar'

    }
  }

  actualizarListaEntidad(){

  }

  crearEntidadLista() {
    this.spinner.show();
    const formValues = this.entidadForm.getRawValue();

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

     console.log('LISTA-ENT-AGREGADO', this.entidadForm.value , parametro);
    this.personalService.crearEntidadLista(parametro).subscribe((resp: any) => {

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


  campoNoValido(campo: string): boolean {
    if ( this.entidadForm.get(campo)?.invalid && this.entidadForm.get(campo)?.touched ) {
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
