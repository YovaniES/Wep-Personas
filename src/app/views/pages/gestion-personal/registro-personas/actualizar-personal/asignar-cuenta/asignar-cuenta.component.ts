import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgxSpinnerService } from 'ngx-spinner';
import { PersonalService } from 'src/app/core/services/personal.service';

@Component({
  selector: 'app-asignar-cuenta',
  templateUrl: './asignar-cuenta.component.html',
  styleUrls: ['./asignar-cuenta.component.scss']
})
export class AsignarCuentaComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  loadingItem: boolean = false;
  filtroForm!: FormGroup;

  page = 1;
  totalCuenta: number = 0;
  pageSize = 5;
  pageSizes = [3, 6, 9];

  constructor(
    private personalService: PersonalService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private dialogRef: MatDialogRef<AsignarCuentaComponent>,
  ) { }

  ngOnInit(): void {
    this.newFilfroForm();
    this.cargarOBuscarCuentaDisponible();
  }

  newFilfroForm(){
    this.filtroForm = this.fb.group({
      username : [''],
    })
  }

  listaCuentaDisp: any[] = [];
  cargarOBuscarCuentaDisponible(){
    this.blockUI.start("Cargando listado de cuentas...");
    let parametro: any[] = [{
      "queryId": 44,
      "mapValue": {
        param_username    : this.filtroForm.value.username,
      }
    }];
    this.personalService.cargarOBuscarCuentaDisponible(parametro[0]).subscribe((resp: any) => {
    this.blockUI.stop();

     console.log('Lista-Cuenta-disp', resp.list, resp.list.length);
      this.listaCuentaDisp = [];
      this.listaCuentaDisp = resp.list;

      this.spinner.hide();
    });
  }



  asignarCuenta(id: any){

  }

  limpiarFiltro() {
    this.filtroForm.reset('', {emitEvent: false})

    this.cargarOBuscarCuentaDisponible();
  };

  totalfiltro = 0;
  cambiarPagina(event: number) {
    let offset = event*10;
    this.spinner.show();

    if (this.totalfiltro != this.totalCuenta) {
      this.personalService.cargarOBuscarCuentaDisponible(offset.toString()).subscribe( (resp: any) => {
            this.listaCuentaDisp = resp.list;
            this.spinner.hide();
          });
    } else {
      this.spinner.hide();
    }
      this.page = event;
  }
  close(succes?: boolean) {
    this.dialogRef.close(succes);
  }

}
