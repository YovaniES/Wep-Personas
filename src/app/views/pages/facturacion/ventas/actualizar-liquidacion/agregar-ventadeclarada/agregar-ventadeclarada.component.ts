import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/core/services/auth.service';
import { PersonalService } from 'src/app/core/services/personal.service';
import { UtilService } from 'src/app/core/services/util.service';
import { CrearPersonalComponent } from 'src/app/views/pages/gestion-personal/registro-personas/crear-personal/crear-personal.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-agregar-ventadeclarada',
  templateUrl: './agregar-ventadeclarada.component.html',
  styleUrls: ['./agregar-ventadeclarada.component.scss']
})
export class AgregarVentadeclaradaComponent implements OnInit {
  ventaDeclaradaForm!: FormGroup;
  titleBtn: string = 'Agregar';

  constructor(
    private personalService: PersonalService,
    private utilService: UtilService,
    private authService: AuthService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    public datePipe: DatePipe,
    private dialogRef: MatDialogRef<CrearPersonalComponent>,
    @Inject(MAT_DIALOG_DATA) public DATA_LIQUID: any
  ) { }

  ngOnInit(): void {
    this.newForm();
    this.getUserID();
    this.cargarVentaDeclaradaByID();
    console.log('DATA_LIQUID_VC', this.DATA_LIQUID);
  }

  newForm(){
    this.ventaDeclaradaForm = this.fb.group({
     idFactVenta    : [''],
     ventaDeclarada : ['', [Validators.required]],
     periodo        : ['', [Validators.required]],
     comentario     : [''],
     fechaCrea      : ['']
    })
   }

   agregarOactualizarVentaDeclarada(){
    if (!this.DATA_LIQUID) {
      if (this.ventaDeclaradaForm.valid) { this.agregarVentaDeclarada()}
    } else {
      this.actualizarVentaDeclarada();
    }
   }

   agregarVentaDeclarada() {
    this.spinner.show();
    const formValues = this.ventaDeclaradaForm.getRawValue();

    let parametro: any =  {
        queryId: 105,
        mapValue: {
          p_idFactura       : this.DATA_LIQUID.idFactura,
          p_periodo         : this.utilService.generarPeriodo(formValues.periodo),
          p_venta_declarada : formValues.ventaDeclarada,
          p_comentario      : formValues.comentario,
          p_fecha_creacion  : '',
          p_usuario_creacion: this.userID,
          CONFIG_USER_ID    : this.userID,
          // CONFIG_OUT_MSG_ERROR    : "",
          // CONFIG_OUT_MSG_EXITO    : "",
        },
      };
     console.log('VAOR', this.ventaDeclaradaForm.value , parametro);
    this.personalService.agregarVentaDeclarada(parametro).subscribe((resp: any) => {
      Swal.fire({
        title: 'Agregar Venta Declarada!',
        text : `La venta declarada: ${formValues.ventaDeclarada}, fue creado con éxito`,
        icon : 'success',
        confirmButtonText: 'Ok',
      });
      this.close(true);
    });
    this.spinner.hide();
  }

  actualizarVentaDeclarada() {
    this.spinner.show();

    const formValues = this.ventaDeclaradaForm.getRawValue();
    let parametro: any[] = [{ queryId: 110,
        mapValue: {
          p_idFactVenta        : 179,
          p_idFactura          : this.DATA_LIQUID.idFactura,
          p_periodo            : this.utilService.generarPeriodo(formValues.periodo) ,
          p_venta_declarada    : formValues.ventaDeclarada ,
          p_comentario         : formValues.comentario ,
          p_dFecha             : '2025-02-14',
          p_usuario            : this.userID ,
          CONFIG_USER_ID       : this.userID,
          CONFIG_OUT_MSG_ERROR : "",
          CONFIG_OUT_MSG_EXITO : "",
        },
      }];
    this.personalService.actualizarCuenta(parametro[0]).subscribe({next: (res) => {
        this.spinner.hide();

        this.close(true)
          Swal.fire({
            title: 'Actualizar venta declarada!',
            text : `La Venta declarada: ${formValues.ventaDeclarada }, se actualizó con éxito`,
            icon : 'success',
            confirmButtonText: 'Ok'
            });

          this.ventaDeclaradaForm.reset();
          this.dialogRef.close('Actualizar');
        }, error:()=>{
          Swal.fire(
            'ERROR',
            'No se pudo actualizar la venta declarada',
            'warning'
          );
        }
     });
  }

  cargarVentaDeclaradaByID(){
    if (this.DATA_LIQUID) {
      this.titleBtn = 'Actualizar'
      this.ventaDeclaradaForm.controls['ventaDeclarada'].setValue(this.DATA_LIQUID.venta_declarada);
      this.ventaDeclaradaForm.controls['periodo'       ].setValue(this.formatPeriodo(this.DATA_LIQUID.periodo));
      this.ventaDeclaradaForm.controls['comentario'    ].setValue(this.DATA_LIQUID.comentario);
      this.ventaDeclaradaForm.controls['fechaCrea'     ].setValue(this.DATA_LIQUID.dFecha);
    }
  }

  formatPeriodo(fechaPeriodo: string){
    const mesAndYear = fechaPeriodo.split('/');

    return mesAndYear[1] + '-' + mesAndYear[0]
  }


  cargarVentaDeclaradaById(){ //NO SE USA ELIMINAR +++++++++++++++++++++++++++++++++
    this.spinner.show();
    let parametro: any[] = [{
      queryId: 107,
      mapValue: {'param_id_factura': 200}
  }];
  this.personalService.cargarVentaDeclaradaById(parametro[0]).subscribe( (resp: any) => {
          for (let i = 0; i < resp.list.length; i++) {
          this.ventaDeclaradaForm.controls['ventaDeclarada'].setValue(resp.list[i].venta_declarada);
          this.ventaDeclaradaForm.controls['comentario'    ].setValue(resp.list[i].comentario);
          this.ventaDeclaradaForm.controls['periodo'       ].setValue(resp.list[i].periodo);
          // this.ventaDeclaradaForm.controls['fechaCrea'     ].setValue(resp.list[i].fechaCrea);
          if (resp.list[i].fechaCrea !='null' && resp.list[i].fechaCrea != '') {
            let fechaIngr = resp.list[i].fechaCrea
            const str   = fechaIngr.split('/');
            const year  = Number(str[2]);
            const month = Number(str[1]);
            const date  = Number(str[0]);
            this.ventaDeclaradaForm.controls['fechaCrea'].setValue(this.datePipe.transform(new Date(year, month-1, date), 'yyyy-MM-dd'))
          }
          // if (resp.list[i].periodo !='null' && resp.list[i].periodo != '') {
          //   let fechaIngr = resp.list[i].periodo
          //   const str   = fechaIngr.split('/');
          //   const year  = Number(str[2]);
          //   const month = Number(str[1]);
          //   // const date  = Number(str[0]);
          //   this.ventaDeclaradaForm.controls['periodo'].setValue(this.datePipe.transform(new Date(year, month-1), 'yyyy-MM'))
          // }
          }
    })
  }

   userID: number = 0;
   getUserID(){
    this.authService.getCurrentUser().subscribe( resp => {
      this.userID   = resp.user.userId;
      console.log('ID-USER', this.userID);
    })
   }

  campoNoValido(campo: string): boolean {
    if (this.ventaDeclaradaForm.get(campo)?.invalid && this.ventaDeclaradaForm.get(campo)?.touched) {
      return true;
    } else {
      return false;
    }
  }

  close(succes?: boolean) {
    this.dialogRef.close(succes);
  }
}
