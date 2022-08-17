import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/core/services/auth.service';
import { PersonalService } from 'src/app/core/services/personal.service';
import Swal from 'sweetalert2';
import { AgregarFacturaComponent } from './agregar-factura/agregar-factura.component';
import { AgregarVentadeclaradaComponent } from './agregar-ventadeclarada/agregar-ventadeclarada.component';

@Component({
  selector: 'app-actualizar-liquidacion',
  templateUrl: './actualizar-liquidacion.component.html',
  styleUrls: ['./actualizar-liquidacion.component.scss']
})
export class ActualizarLiquidacionComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  loadingItem: boolean = false;

  userID: number = 0;
  facturaForm!: FormGroup;
  factura_Id = this.ID_REG_FACTURA;

  constructor(
    private personalService: PersonalService,
    private authService: AuthService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    public datePipe: DatePipe,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<ActualizarLiquidacionComponent>,
    @Inject(MAT_DIALOG_DATA) public ID_REG_FACTURA: any
  ) { }

  ngOnInit(): void {
    this.newForm();
    this.getListProyectos();
    this.getUserID();
    this.getListEstados();
    this.getListLiquidaciones();
    this.getListGestores();
    this.cargarFacturalById();
    this.getHistoricoCambiosEstado(this.ID_REG_FACTURA);
    this.cargarOBuscarVentaDeclarada();
    this.cargarOBuscarFactura();
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
     gestor              : [''],
     fecha_crea          : [''],

     id_factura          : [''],
     user                : [''],
    })
   }




  actualizarFactura() {
    this.spinner.show();
    let currentUser = this.authService.getUsername();

    const formValues = this.facturaForm.getRawValue();
    let parametro: any =  {
        queryId: 66,
        mapValue:{
          p_idFactura         : this.ID_REG_FACTURA,
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
          p_fechaCrea         : formValues.fechaCrea,
          p_idUsuarioActualiza: 5,
          p_fechaActualiza    : '',
          p_ver_estado        : 1,
          CONFIG_USER_ID      : this.userID,
          CONFIG_OUT_MSG_ERROR: '',
          CONFIG_OUT_MSG_EXITO: '',
        }};
     console.log('VAOR', this.facturaForm.value , parametro);
    this.personalService.actualizarFactura(parametro).subscribe((resp: any) => {
      Swal.fire({
        title: 'Actualizar Factura!',
        text: `La Factura: ${this.ID_REG_FACTURA}, ha sido actualizado con éxito`,
        icon: 'success',
        confirmButtonText: 'Ok',
      });


      // if(formValues.id_estado){
      //   this.agregarFacturaCambios()
      // }else{
      //   this.close(true)
      // }
      this.close(true);
    });
    this.spinner.hide();
  }


  estadoInicial: string = '';
  cargarFacturalById(){
    this.spinner.show();

    let parametro: any[] = [{
      queryId: 103,
      mapValue: {'param_id_factura': this.ID_REG_FACTURA}
    }];

    this.personalService.cargarFacturaById(parametro[0]).subscribe( (resp: any) => {

      console.log('LISTA-EDITAR_BY_ID', resp );
      for (let i = 0; i < resp.list.length; i++) {
        this.facturaForm.controls['id_liquidacion' ].setValue(resp.list[i].idLiquidacion);
        this.facturaForm.controls['codProy'        ].setValue(resp.list[i].idProyecto);
        this.facturaForm.controls['subservicio'    ].setValue(resp.list[i].subServicio);
        this.facturaForm.controls['id_gestor'      ].setValue(resp.list[i].idGestor);
        this.facturaForm.controls['venta_declarada'].setValue(resp.list[i].venta_declarada);
        // this.facturaForm.controls['fechaPeriodo'   ].setValue(resp.list[i].periodo);
        this.facturaForm.controls['id_estado'      ].setValue(resp.list[i].idEstado);
        this.facturaForm.controls['orden_compra'   ].setValue(resp.list[i].orden_compra);
        this.facturaForm.controls['certificacion'  ].setValue(resp.list[i].cod_certificacion);
        this.facturaForm.controls['factura'        ].setValue(resp.list[i].factura);
        this.facturaForm.controls['monto_facturado'].setValue(resp.list[i].monto_facturado);
        this.facturaForm.controls['comentarios'    ].setValue(resp.list[i].Comentarios);
        this.facturaForm.controls['gestor'         ].setValue(resp.list[i].gestor);


        this.estadoInicial = resp.list[i].estado;

        // if (resp.list[i].periodo !='null' && resp.list[i].periodo != '') {
        //   let fPeriodo = resp.list[i].periodo
        //   const str   = fPeriodo.split('/');
        //   const year  = Number(str[2]);
        //   const month = Number(str[1]);
        //   const date  = Number(str[0]);
        //   this.facturaForm.controls['fechaPeriodo'].setValue(this.datePipe.transform(new Date(year, month-1, date), 'yyyy-MM-dd'))
        // }

        if (resp.list[i].fechaCrea !='null' && resp.list[i].fechaCrea != '') {
          let fCrea = resp.list[i].fechaCrea
          const str   = fCrea.split('/');
          const year  = Number(str[2]);
          const month = Number(str[1]);
          const date  = Number(str[0]);
          this.facturaForm.controls['fecha_crea'].setValue(this.datePipe.transform(new Date(year, month-1, date), 'yyyy-MM-dd'))
        }
      }
      this.spinner.hide();
    })
  }

  actualizarVentaDeclarada(id: any){

  }

  EliminarVentaDeclarada(id: any){

  }



  agregarFacturaCambios(){
    if (this.estadoInicial != this.facturaForm.value.id_estado) {

      let parametro: any[] = [{
        queryId: 104,
        mapValue: {
        //  "p_idiniciativa"        : this.ID ,
        //  "p_idEstado"            : idEstado ,
        //  "p_id_motivo"           : id_motivo ,
        //  "p_dFecha"              : dFecha ,
        //  "p_usuario"             : currentUser,
        // "@CONFIG_USER_ID"        : this.userID,
        // "@CONFIG_OUT_MSG_ERROR"  : '' ,
        // "@CONFIG_OUT_MSG_EXITO"  : ''

        'p_idFactura'          : this.facturaForm.value.id_factura,
        'p_idEstado'           : this.facturaForm.value.id_estado,
        'p_venta_declarada'    : this.facturaForm.value.venta_declarada,
        'p_idProyecto'         : this.facturaForm.value.codProy,
        'p_dFecha'             : this.facturaForm.value.fecha_crea,
        'p_usuario'            : 'JHON SOTO',
        'CONFIG_USER_ID'       : this.userID,
        'CONFIG_OUT_MSG_EXITO' : '',
        'CONFIG_OUT_MSG_ERROR' : '',
        }
      }];
      // console.log('EST', this.estadoInicial, this.iniciativaEditForm.value);
      this.personalService.agregarFacturaCambios(parametro[0]).subscribe( resp => {
     })
    }
  }


  histCambiosEstado: any[] = [];
  getHistoricoCambiosEstado(id: number){
  this.spinner.show();
    let parametro: any[] = [{
      queryId: 67,
      mapValue: {p_id: this.ID_REG_FACTURA}
    }];

    this.personalService.getHistoricoCambiosEstado(parametro[0]).subscribe((resp: any) => {
      this.histCambiosEstado = resp.list;
      console.log('HistCambIDFact', resp.list)
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
            // console.log('LIQUIDAC', resp);
    });
  }

  listEstados: any[] = [];
  getListEstados(){
    let parametro: any[] = [{queryId: 101}];

    this.personalService.getListEstados(parametro[0]).subscribe((resp: any) => {
            this.listEstados = resp.list;
            // console.log('EST-FACT', resp);
    });
  }

  listGestores: any[] = [];
  getListGestores(){
    let arrayParametro: any[] = [{queryId: 102}];

    this.personalService.getListEstados(arrayParametro[0]).subscribe((resp: any) => {
            this.listGestores = resp.list;
            // console.log('GESTORES', resp);
    });
  };

  listProyectos: any[] = [];
  getListProyectos(){
    let parametro: any[] = [{queryId: 1}];

    this.personalService.getListProyectos(parametro[0]).subscribe((resp: any) => {
            this.listProyectos = resp;
            // console.log('COD_PROY', resp);
    });
  };


  listVentaDeclarada: any[] = [];
  cargarOBuscarVentaDeclarada(){
    this.blockUI.start("Cargando lista...");
    let parametro: any[] = [{
      "queryId": 72,
      "mapValue": { p_id : this.ID_REG_FACTURA }
    }];
    this.personalService.cargarOBuscarVentaDeclarada( parametro[0]).subscribe( (resp: any) => {
      this.blockUI.stop();

      console.log('List-VC', resp.list);
      this.listVentaDeclarada = resp.list;

      this.spinner.hide();

    })
  }

  listFactura: any[] = [];
  cargarOBuscarFactura(){
    this.blockUI.start("Cargando lista...");
    let parametro: any[] = [{
      "queryId": 71,
      "mapValue": { p_id : this.ID_REG_FACTURA }
    }];
    this.personalService.cargarOBuscarFactura( parametro[0]).subscribe( (resp: any) => {
      this.blockUI.stop();

      console.log('List-Factu', resp.list);
      this.listFactura = resp.list;

      this.spinner.hide();
    })
  }

  EliminarFactura(id: number){}

  close(succes?: boolean) {
    this.dialogRef.close(succes);
  }

  agregarVentaDeclarada(){
    const dialogRef = this.dialog.open(AgregarVentadeclaradaComponent, {width:'25%'});

    dialogRef.afterClosed().subscribe(resp => {
      if (resp) {
        this.cargarOBuscarVentaDeclarada()
      }
    })
  }

  agregarFactura(){
    const dialogRef = this.dialog.open(AgregarFacturaComponent, {width:'35%'});

    dialogRef.afterClosed().subscribe(resp => {
      if (resp) {
        this.cargarOBuscarFactura()
      }
    })
  };


  }


