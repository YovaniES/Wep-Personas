import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/core/services/auth.service';
import { FacturacionService } from 'src/app/core/services/facturacion.service';
import { UtilService } from 'src/app/core/services/util.service';
import { VacacionesPersonalService } from 'src/app/core/services/vacaciones-personal.service';
import { CrearPersonalComponent } from 'src/app/views/pages/gestion-personal/registro-personas/crear-personal/crear-personal.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-asignar-vacaciones',
  templateUrl: './asignar-vacaciones.component.html',
  styleUrls: ['./asignar-vacaciones.component.scss']
})
export class AsignarVacacionesComponent implements OnInit {
  vacacionesForm!: FormGroup;

  constructor(
    private vacacionesService: VacacionesPersonalService,
    private utilService: UtilService,
    private authService: AuthService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    public datePipe: DatePipe,
    private dialogRef: MatDialogRef<CrearPersonalComponent>,
    @Inject(MAT_DIALOG_DATA) public DATA_VACAC: any
  ) { }

  ngOnInit(): void {
    this.newForm();
    this.getUserID();
    this.cargarVacacionesByID();
    console.log('DATA_VACAC_VD', this.DATA_VACAC, this.DATA_VACAC.vdForm);
    // console.log('VENTA_DECL_VD', this.DATA_VACAC.vdForm.venta_declarada);
    // console.log('VD',this.cargarVentaDeclarada());
  }

  newForm(){
    this.vacacionesForm = this.fb.group({
    //  ventaDeclarada : [this.DATA_VACAC.vdForm.venta_declarada, [Validators.required]],
     ventaDeclarada : ['', [Validators.required]],
     periodo        : ['', [Validators.required]],
     comentario     : ['-',[Validators.required]],
     fechaCrea      : ['']
    })
   }

   agregarOactualizarVacaciones(){
    if (!this.DATA_VACAC) {
    return
      }

    if (this.DATA_VACAC.isCreation) {
      if (this.vacacionesForm.valid) { this.agregarVacaciones()}
    } else {
      this.actualizarVacaciones();
    }
   }

   agregarVacaciones() {
    this.spinner.show();
    const formValues = this.vacacionesForm.getRawValue();

    let parametro: any =  {
        queryId: 105,
        mapValue: {
          p_idFactura       : this.DATA_VACAC.vdForm.id_factura,
          p_periodo         : this.utilService.generarPeriodo(formValues.periodo),
          p_venta_declarada : formValues.ventaDeclarada, //this.DATA_VACAC.vdForm.venta_declarada, //formValues.ventaDeclarada,
          p_comentario      : formValues.comentario,
          p_fecha_creacion  : '',
          p_usuario_creacion: this.userID,
          CONFIG_USER_ID    : this.userID,
          // CONFIG_OUT_MSG_ERROR    : "",
          // CONFIG_OUT_MSG_EXITO    : "",
        },
      };
     console.log('VAOR_VACA', this.vacacionesForm.value , parametro);
    this.vacacionesService.agregarVacaciones(parametro).subscribe((resp: any) => {
      Swal.fire({
        title: 'Agregar vacaciones!',
        text : `La vacación: ${formValues.ventaDeclarada}, fue creado con éxito`,
        icon : 'success',
        confirmButtonText: 'Ok',
      });
      this.close(true);
    });
    this.spinner.hide();
  }

  actualizarVacaciones() {
    this.spinner.show();

    const formValues = this.vacacionesForm.getRawValue();
    let parametro: any[] = [{ queryId: 110,
        mapValue: {
          p_idFactVenta        : this.DATA_VACAC.idFactVenta,
          p_idFactura          : this.DATA_VACAC.idFactura,
          p_periodo            : this.utilService.generarPeriodo(formValues.periodo) ,
          // p_venta_declarada    : this.DATA_VACAC.vdForm.venta_declarada,
          p_venta_declarada    : formValues.ventaDeclarada ,
          p_comentario         : formValues.comentario ,
          p_dFecha             : formValues.fechaCrea,
          p_usuario            : this.userID ,
          CONFIG_USER_ID       : this.userID,
          CONFIG_OUT_MSG_ERROR : "",
          CONFIG_OUT_MSG_EXITO : "",
        },
      }];
     this.vacacionesService.actualizarVacaciones(parametro[0]).subscribe({next: (res) => {
        this.spinner.hide();

        this.close(true)
          Swal.fire({
            title: 'Actualizar vacaciones!',
            text : `La Vacación: ${formValues.ventaDeclarada }, se actualizó con éxito`,
            icon : 'success',
            confirmButtonText: 'Ok'
            });

          this.vacacionesForm.reset();
          this.dialogRef.close('Actualizar');
        }, error:()=>{
          Swal.fire(
            'ERROR',
            'No se pudo actualizar la vacación',
            'warning'
          );
        }
     });
  }

  titleBtn: string = 'Agregar';
  cargarVacacionesByID(){
    if (!this.DATA_VACAC.isCreation) {
      this.titleBtn = 'Actualizar'
      this.vacacionesForm.controls['ventaDeclarada'].setValue(this.DATA_VACAC.venta_declarada);
      this.vacacionesForm.controls['periodo'       ].setValue(this.formatPeriodo(this.DATA_VACAC.periodo));
      this.vacacionesForm.controls['comentario'    ].setValue(this.DATA_VACAC.comentario);
      // this.vacacionesForm.controls['fechaCrea'     ].setValue(this.DATA_VACAC.dFecha);

      if (this.DATA_VACAC.dFecha !='null' && this.DATA_VACAC.dFecha != '') {
        this.vacacionesForm.controls['fechaCrea'].setValue(this.DATA_VACAC.dFecha)
        }
    }
  }

  formatPeriodo(fechaPeriodo: string){
    const mesAndYear = fechaPeriodo.split('/');

    return mesAndYear[1] + '-' + mesAndYear[0]
  }

   userID: number = 0;
   getUserID(){
    this.authService.getCurrentUser().subscribe( resp => {
      this.userID   = resp.user.userId;
      console.log('ID-USER', this.userID);
    })
   }

  campoNoValido(campo: string): boolean {
    if (this.vacacionesForm.get(campo)?.invalid && this.vacacionesForm.get(campo)?.touched) {
      return true;
    } else {
      return false;
    }
  }

  close(succes?: boolean) {
    this.dialogRef.close(succes);
  }
}
