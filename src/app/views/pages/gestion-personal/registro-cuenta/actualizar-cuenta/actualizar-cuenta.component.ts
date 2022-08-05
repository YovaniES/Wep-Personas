import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-actualizar-cuenta',
  templateUrl: './actualizar-cuenta.component.html',
  styleUrls: ['./actualizar-cuenta.component.scss']
})
export class ActualizarCuentaComponent implements OnInit {

  cuentaForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ActualizarCuentaComponent>,

  ) { }

  ngOnInit(): void {
    this.newForm();
  }


  newForm(){
    this.cuentaForm = this.fb.group({
     usuario : ['', [Validators.required]],
     password: ['', [Validators.required]],
     idTipo  : ['', [Validators.required]],
    })
   }

   ActualizarCuenta(){

   }

   close(succes?: boolean) {
    this.dialogRef.close(succes);
  }
}
