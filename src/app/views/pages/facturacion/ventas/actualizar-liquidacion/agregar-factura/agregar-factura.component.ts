import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/core/services/auth.service';
import { PersonalService } from 'src/app/core/services/personal.service';
import { CrearPersonalComponent } from 'src/app/views/pages/gestion-personal/registro-personas/crear-personal/crear-personal.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-agregar-factura',
  templateUrl: './agregar-factura.component.html',
  styleUrls: ['./agregar-factura.component.scss']
})
export class AgregarFacturaComponent implements OnInit {
  facturaForm!: FormGroup;

  constructor(
    private personalService: PersonalService,
    private authService: AuthService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private dialogRef: MatDialogRef<CrearPersonalComponent>,
    @Inject(MAT_DIALOG_DATA) public DATA_LIQUID: any
  ) { }

  ngOnInit(): void {
    this.newForm();
    this.getUserID();
    this.getListEstadosFacturacion();
    this.cargarFacturaByID();
    console.log('DATA_LIQUID_F', this.DATA_LIQUID);
  }

  newForm(){
    this.facturaForm = this.fb.group({
     ordenCompra   : ['',[Validators.required]],
     importe       : ['',[Validators.required]],
     certificacion : ['',[Validators.required]],
     estFactura    : [ 6,[Validators.required]],
     factura       : ['F001-',[Validators.required]],
     fechaFact     : ['',[Validators.required]],
     comentarios   : ['']
    })
   }

  agregarOactualizarFactura(){
    this.spinner.show();

    if (!this.DATA_LIQUID) {
      if (this.facturaForm.valid) { this.agregarFactura() }
    } else {
      this.actualizarFactura();
    }
    this.spinner.hide();
  }


  agregarFactura() {
    // this.spinner.show();
    const formValues = this.facturaForm.getRawValue();

    let parametro: any =  {
        queryId: 107777777777777,
        mapValue: {
          p_idFactura       : 199,
          p_periodo         : formValues.periodo,
          p_venta_declarada : formValues.ventaDeclarada,
          p_comentario      : formValues.comentario,
          p_fecha_creacion  : formValues.fechaCrea,
          p_usuario_creacion: this.userID,
          CONFIG_USER_ID    : this.userID,
          // CONFIG_OUT_MSG_ERROR    : "",
          // CONFIG_OUT_MSG_EXITO    : "",
        },
      };
     console.log('VAOR', this.facturaForm.value , parametro);
    this.personalService.agregarFactura(parametro).subscribe((resp: any) => {
      Swal.fire({
        title: 'Agregar Factura!',
        text: `La Factura: ${formValues.ventaDeclarada}, fue agregado con éxito`,
        icon: 'success',
        confirmButtonText: 'Ok',
      });
      this.close(true);
    });
    // this.spinner.hide();
  }

  actualizarFactura(){

  }

// certificacion: "5036851706"
// comentario: "Factura detallada xy"
// estado: "Certificado"
// factura: "F001-016920"
// fecha_facturacion: "12/08/2022"
// idFactCertificacion: 199
// idFactura: 200
// importe: 1950
// oc: "9404282914"

// certificacion: null
// codProy: 3
// comentarios: null
// factura: null
// fechaPeriodo: "2022-04"
// fecha_crea: "2022-08-10"
// gestor: "Ricardo Fernandez"
// id_estado: 6
// id_factura: ""
// id_gestor: 2
// id_liquidacion: 2
// monto_facturado: null
// orden_compra: null
// subservicio: "services nuevo"
// user: ""
// venta_declarada: 2345

  actionBtn: string = 'Agregar'
  cargarFacturaByID(){
    if (this.DATA_LIQUID) {
    this.actionBtn = 'Actualizar'
      this.facturaForm.controls['ordenCompra'  ].setValue(this.DATA_LIQUID.orden_compra);
      this.facturaForm.controls['importe'      ].setValue(this.DATA_LIQUID.importe);
      this.facturaForm.controls['certificacion'].setValue(this.DATA_LIQUID.certificacion);
      this.facturaForm.controls['estFactura'   ].setValue(this.DATA_LIQUID.id_estado);
      this.facturaForm.controls['factura'      ].setValue(this.DATA_LIQUID.id_factura);
      this.facturaForm.controls['fechaFact'    ].setValue(this.DATA_LIQUID.fecha_facturacion);
      this.facturaForm.controls['comentarios'  ].setValue(this.DATA_LIQUID.comentarios);
    }
  }

  userID: number = 0;
  getUserID(){
   this.authService.getCurrentUser().subscribe( resp => {
     this.userID   = resp.user.userId;
     console.log('ID-USER', this.userID);
   })
  }


  listEstadosFacturacion: any[] = [];
  getListEstadosFacturacion(){
    let parametro: any[] = [{queryId: 106}];

    this.personalService.getListEstadosFacturacion(parametro[0]).subscribe((resp: any) => {
            this.listEstadosFacturacion = resp.list;
            console.log('EST-FACTX', resp);
    });
  }


  campoNoValido(campo: string): boolean {
    if (this.facturaForm.get(campo)?.invalid && this.facturaForm.get(campo)?.touched) {
      return true;
    } else {
      return false;
    }
  }


  close(succes?: boolean) {
    this.dialogRef.close(succes);
  }
}
