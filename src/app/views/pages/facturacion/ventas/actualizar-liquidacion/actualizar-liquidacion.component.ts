import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/core/services/auth.service';
import { PersonalService } from 'src/app/core/services/personal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-actualizar-liquidacion',
  templateUrl: './actualizar-liquidacion.component.html',
  styleUrls: ['./actualizar-liquidacion.component.scss']
})
export class ActualizarLiquidacionComponent implements OnInit {
  userID: number = 0;
  facturaForm!: FormGroup;

  constructor(
    private personalService: PersonalService,
    private authService: AuthService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private dialogRef: MatDialogRef<ActualizarLiquidacionComponent>,
  ) { }

  ngOnInit(): void {
    this.newForm();
    this.getListProyectos();
    this.getUserID();
    this.getListEstados();
    this.getListLiquidaciones();
    this.getListGestores();
  }


  newForm(){
    this.facturaForm = this.fb.group({
     id_liquidacion      : [''],
     codProy             : [''],
     subservicio         : [''],
     id_gestor           : [''],
     venta_declarada     : [''],
     fechaPeriodo        : [''],
     id_estado           : [''],
     orden_compra        : [''],
     certificacion       : [''],
     factura             : [''],
     monto_facturado     : [''],
     comentarios         : [''],
     gestor              : ['']
    })
   }

   getUserID(){
    this.authService.getCurrentUser().subscribe( resp => {
      this.userID   = resp.user.userId;
      console.log('ID-USER', this.userID);
    })
   }

  listLiquidaciones: any[] = [];
  getListLiquidaciones(){
    let parametro: any[] = [{queryId: 82}];
    this.personalService.getListLiquidaciones(parametro[0]).subscribe((resp: any) => {
            this.listLiquidaciones = resp.list;
            console.log('LIQUIDAC', resp);
    });
  }

  listEstados: any[] = [];
  getListEstados(){
    let parametro: any[] = [{queryId: 101}];

    this.personalService.getListEstados(parametro[0]).subscribe((resp: any) => {
            this.listEstados = resp.list;
            console.log('EST-FACT', resp);
    });
  }

  listGestores: any[] = [];
  getListGestores(){
    let arrayParametro: any[] = [{queryId: 102}];

    this.personalService.getListEstados(arrayParametro[0]).subscribe((resp: any) => {
            this.listGestores = resp.list;
            console.log('GESTORES', resp);
    });
  };

  listProyectos: any[] = [];
  getListProyectos(){
    let parametro: any[] = [{queryId: 1}];

    this.personalService.getListProyectos(parametro[0]).subscribe((resp: any) => {
            this.listProyectos = resp;
            console.log('COD_PROY', resp);
    });
  };

  actualizarFactura() {
    this.spinner.show();
    let currentUser = this.authService.getUsername();

    const formValues = this.facturaForm.getRawValue();

    let parametro: any =  {
        queryId: 70,
        mapValue:{
          p_periodo           : formValues.fechaPeriodo,
          p_idProyecto        : formValues.codProy,
          p_idLiquidacion     : formValues.id_liquidacion,
          p_subServicio       : formValues.subservicio,
          p_gestor            : formValues.gestor,
          p_idGestor          : formValues.id_gestor,
          p_venta_declarada   : formValues.venta_declarada,
          p_idEstado          : formValues.id_estado,
          p_orden_compra      : formValues.orden_compra,
          p_cod_certificacion : formValues.certificacion,
          p_factura           : formValues.factura,
          p_monto_facturado   : formValues.monto_facturado,
          p_Comentarios       : formValues.comentarios,
          p_idMotivo          : '',
          p_idUsuarioCrea     : this.userID,
          p_fechaCrea         : '',
          p_idUsuarioActualiza: '',
          p_fechaActualiza    : '',
          p_ver_estado        : '',
          CONFIG_USER_ID      : this.userID,
          CONFIG_OUT_MSG_ERROR: '',
          CONFIG_OUT_MSG_EXITO: '',
        }};
     console.log('VAOR', this.facturaForm.value , parametro);
    this.personalService.actualizarFactura(parametro).subscribe((resp: any) => {
      Swal.fire({
        title: 'Actualizar Factura!',
        text: `La Factura: ${formValues.id_liquidacion}, ha sido actualizado con éxito`,
        icon: 'success',
        confirmButtonText: 'Ok',
      });
      this.close(true);
    });
    this.spinner.hide();
  }


  campoNoValido(campo: string): boolean {
    if (
      this.facturaForm.get(campo)?.invalid &&
      this.facturaForm.get(campo)?.touched
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
