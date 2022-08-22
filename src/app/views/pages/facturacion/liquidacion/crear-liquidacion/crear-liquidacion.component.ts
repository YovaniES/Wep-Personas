import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/core/services/auth.service';
import { PersonalService } from 'src/app/core/services/personal.service';
import { UtilService } from 'src/app/core/services/util.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-liquidacion',
  templateUrl: './crear-liquidacion.component.html',
  styleUrls: ['./crear-liquidacion.component.scss']
})
export class CrearLiquidacionComponent implements OnInit {
  userID: number = 0;
  facturaForm!: FormGroup;

  constructor(
    private personalService: PersonalService,
    private authService: AuthService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private utilService: UtilService,
    public datePipe: DatePipe,
    private dialogRef: MatDialogRef<CrearLiquidacionComponent>,
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
     id_liquidacion      : ['',[Validators.required]],
     codProy             : ['',[Validators.required]],
     subservicio         : ['',[Validators.required]],
     id_gestor           : ['',[Validators.required]],
     venta_declarada     : ['',[Validators.required]],
     fechaPeriodo        : ['',[Validators.required]],
     id_estado           : [ 1,[Validators.required]],
     orden_compra        : [''],
     certificacion       : [''],
     factura             : [''],
     monto_facturado     : [''],
     comentarios         : [''],
     gestor              : [''],
    })
   }

  crearLiquidacion() {
    this.spinner.show();
    let currentUser = this.authService.getUsername();

    const formValues = this.facturaForm.getRawValue();

    let parametro: any =  {
        queryId: 70,
        mapValue:{
          p_periodo           : this.utilService.generarPeriodo(formValues.fechaPeriodo),
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
          p_fechaCrea         : formValues.fecha_crea,
          p_idUsuarioActualiza: '',
          p_fechaActualiza    : '',
          p_ver_estado        : '',
          CONFIG_USER_ID      : this.userID,
          CONFIG_OUT_MSG_ERROR: '',
          CONFIG_OUT_MSG_EXITO: '',
        }};
     console.log('VAOR', this.facturaForm.value , parametro);
    this.personalService.crearLiquidacion(parametro).subscribe((resp: any) => {
      Swal.fire({
        title: 'Crear Factura!',
        text: `La Liquidación: ${formValues.id_liquidacion},fue creado con éxito`,
        icon: 'success',
        confirmButtonText: 'Ok',
      });
      this.close(true);
    });
    this.spinner.hide();
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


  campoNoValido(campo: string): boolean {
    if (this.facturaForm.get(campo)?.invalid && this.facturaForm.get(campo)?.touched ) {
      return true;
    } else {
      return false;
    }
  }

  close(succes?: boolean) {
    this.dialogRef.close(succes);
  }

}
