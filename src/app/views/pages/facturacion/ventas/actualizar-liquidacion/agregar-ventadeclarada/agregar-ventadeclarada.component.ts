import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/core/services/auth.service';
import { PersonalService } from 'src/app/core/services/personal.service';
import { CrearPersonalComponent } from 'src/app/views/pages/gestion-personal/registro-personas/crear-personal/crear-personal.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-agregar-ventadeclarada',
  templateUrl: './agregar-ventadeclarada.component.html',
  styleUrls: ['./agregar-ventadeclarada.component.scss']
})
export class AgregarVentadeclaradaComponent implements OnInit {
  ventaDeclaradaForm!: FormGroup;
  titleBtn: string = 'Registrar';

  constructor(
    private personalService: PersonalService,
    private authService: AuthService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    public datePipe: DatePipe,
    private dialogRef: MatDialogRef<CrearPersonalComponent>,
    @Inject(MAT_DIALOG_DATA) public ID_VENTA: any = 200
  ) { }

  ngOnInit(): void {
    this.newForm();
    this.cargarVentaDeclaradaById();
    this.getUserID();
    console.log('ID_VENTA', this.ID_VENTA);

  }

  newForm(){
    this.ventaDeclaradaForm = this.fb.group({
     ventaDeclarada : ['', [Validators.required]],
     comentario     : [''],
     periodo        : ['', [Validators.required]],
     fechaCrea      : ['']
    })
   }

   cargarVentaDeclaradaById(){
    this.spinner.show();

    let parametro: any[] = [{
      queryId: 107,
      mapValue: {'param_id_factura': 200}
    }];

    this.personalService.cargarVentaDeclaradaById(parametro[0]).subscribe( (resp: any) => {

          if (this.ID_VENTA) {
            this.titleBtn = 'ActualizarX';

            for (let i = 0; i < resp.list.length; i++) {
            this.ventaDeclaradaForm.controls['ventaDeclarada'].setValue(resp.list[i].venta_declarada);
            this.ventaDeclaradaForm.controls['comentario'    ].setValue(resp.list[i].comentario);
            // this.ventaDeclaradaForm.controls['periodo'       ].setValue(resp.list[i].periodo);
            // this.ventaDeclaradaForm.controls['fechaCrea'     ].setValue(resp.list[i].fechaCrea);
            if (resp.list[i].fechaCrea !='null' && resp.list[i].fechaCrea != '') {
              let fechaIngr = resp.list[i].fechaCrea
              const str   = fechaIngr.split('/');
              const year  = Number(str[2]);
              const month = Number(str[1]);
              const date  = Number(str[0]);
              this.ventaDeclaradaForm.controls['fechaCrea'].setValue(this.datePipe.transform(new Date(year, month-1, date), 'yyyy-MM-dd'))
            }

            if (resp.list[i].periodo !='null' && resp.list[i].periodo != '') {
              let fechaIngr = resp.list[i].periodo
              const str   = fechaIngr.split('/');
              const year  = Number(str[2]);
              const month = Number(str[1]);
              // const date  = Number(str[0]);
              this.ventaDeclaradaForm.controls['periodo'].setValue(this.datePipe.transform(new Date(year, month-1), 'yyyy-MM'))
            }
            }
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

  agregarVentaDeclarada() {
    this.spinner.show();
    const formValues = this.ventaDeclaradaForm.getRawValue();

    let parametro: any =  {
        queryId: 105,
        mapValue: {
          p_idFactura       : 199,  // AGREGAR ID DINMICO =============================>>>>>>>>>
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
     console.log('VAOR', this.ventaDeclaradaForm.value , parametro);
    this.personalService.agregarVentaDeclarada(parametro).subscribe((resp: any) => {
      Swal.fire({
        title: 'Agregar Venta Declarada!',
        text: `La venta declarada: ${formValues.ventaDeclarada}, fue creado con éxito`,
        icon: 'success',
        confirmButtonText: 'Ok',
      });
      this.close(true);
    });
    this.spinner.hide();
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
