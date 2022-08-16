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
    @Inject(MAT_DIALOG_DATA) public ID_VENTA: any
  ) { }

  ngOnInit(): void {
    this.newForm();
    this.getUserID();
    console.log('ID_VENTA', this.ID_VENTA);

  }

  newForm(){
    this.facturaForm = this.fb.group({
     ordenCompra   : ['',[Validators.required]],
     importe       : ['',[Validators.required]],
     certificacion : ['',[Validators.required]],
     estFactura    : ['',[Validators.required]],
     factura       : ['',[Validators.required]],
     fechaFact     : ['',[Validators.required]],
     comentarios   : ['']
    })
   }

   userID: number = 0;
   getUserID(){
    this.authService.getCurrentUser().subscribe( resp => {
      this.userID   = resp.user.userId;
      console.log('ID-USER', this.userID);
    })
   }

   listEstados: any[] = [];
   getListEstados(){
     let parametro: any[] = [{queryId: 101}];

     this.personalService.getListEstados(parametro[0]).subscribe((resp: any) => {
             this.listEstados = resp.list;
             // console.log('EST-FACT', resp);
     });
   }

  agregarVentaDeclarada() {
    this.spinner.show();
    const formValues = this.facturaForm.getRawValue();

    let parametro: any =  {
        queryId: 105,
        mapValue: {
          p_idFactura       : 200,
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
