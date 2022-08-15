import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/core/services/auth.service';
import { PersonalService } from 'src/app/core/services/personal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-agregar-hardware',
  templateUrl: './asignar-hardware.component.html',
  styleUrls: ['./asignar-hardware.component.scss']
})
export class AsignarHardwareComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  loadingItem: boolean = false;
  filtroForm!: FormGroup;

  page = 1;
  totalHardware: number = 0;
  pageSize = 5;
  // pageSizes = [3, 6, 9];

  constructor(
    private personalService: PersonalService,
    private fb: FormBuilder,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private dialogRef: MatDialogRef<AsignarHardwareComponent>,
    @Inject(MAT_DIALOG_DATA) public ID_PERSONAL_RECURSO: any

  ) { }

  ngOnInit(): void {
    this.newFilfroForm();
    this.cargarOBuscarHardwareDisponible();
    this.getListMarcaHardware();
    this.getListTiposHardware();

    console.log('ID_PERSON_REC', this.ID_PERSONAL_RECURSO);
  }

  newFilfroForm(){
    this.filtroForm = this.fb.group({
      tipo  : [''],
      marca : [''],
      serie : [''],
    })
  }

  userID: number = 0;
  getUsuario(){
   this.authService.getCurrentUser().subscribe( resp => {
     this.userID   = resp.user.userId;
     // console.log('ID-USER', this.userID);
   })
  }

  listaHardwareDisp: any[] = [];
  cargarOBuscarHardwareDisponible(){
    this.blockUI.start("Cargando listado de hardware...");
    let parametro: any[] = [{
      "queryId": 29,
      "mapValue": {
        param_serie    : this.filtroForm.value.serie,
        param_id_tipo  : this.filtroForm.value.tipo,
        param_id_marca : this.filtroForm.value.marca,
        param_id_estado: this.filtroForm.value.estado,
      }
    }];
    this.personalService.cargarOBuscarHardwareDisponible(parametro[0]).subscribe((resp: any) => {
    this.blockUI.stop();

     console.log('Lista-Hardware-disp', resp, resp.length);
      this.listaHardwareDisp = [];
      this.listaHardwareDisp = resp.list;

      this.spinner.hide();
    });
  }

  asignarRecursoH(idRecurso: number, tipo?: string){
    this.spinner.show();

      let parametro: any[] = [{
        "queryId": 25,
        "mapValue": {
          "param_id_persona": 498,
          "param_id_recurso": idRecurso,
          "CONFIG_USER_ID"  : this.userID,
          "CONFIG_OUT_MSG_ERROR":'',
          "CONFIG_OUT_MSG_EXITO":''}
      }];
      this.personalService.asignarRecurso(parametro[0]).subscribe( resp => {
        // this.cargarOBuscarPersonal();
        Swal.fire({
          title: 'Asignar recurso hardware',
          text: `El recurso Hardware: ${'x'}, se asignó con exito`,
          icon: 'success',
        });

      })
    }


  asignarRecurso(idRecurso: number, tipo?: string){
    this.spinner.show();

    if (this) {
      let parametro: any[] = [{
        "queryId": 25,
        "mapValue": {
          "param_id_persona": this.ID_PERSONAL_RECURSO,
          "param_id_recurso": idRecurso,
          "CONFIG_USER_ID"  : this.userID,
          "CONFIG_OUT_MSG_ERROR":'',
          "CONFIG_OUT_MSG_EXITO":''}
      }];

      this.personalService.asignarRecurso(parametro[0]).subscribe( resp => {
        // this.cargarOBuscarPersonal();
        Swal.fire({
          title: 'Asignar recurso hardware',
          text: `El recurso Hardware: ${''}, se asignó con exito`,
          icon: 'success',
        });

      })
      // this._service.asignarRecusoPersona(arrayParametro[0]).subscribe(data => {
      //   const arrayData:any[] = Array.of(data);
      //   let msj = arrayData[0].exitoMessage;
      //   this.showSuccess(msj);

      //   if (tipo == 'h') {
      //     this.cerrarModalHardware.nativeElement.click();
      //   }
      //   if (tipo == 'c') {
      //     this.cerrarModalCuenta.nativeElement.click();
      //   }
      //   this.ngOnInit();
      // });
    }else{
      // this.showError('No se puede asignar cuando el personal esta de baja')
      Swal.fire({
        title: 'Asignar recurso hardware',
        text: `No se pudo asignar el recurso: ${''}, cuadno el personal este de baja`,
        icon: 'warning',
      });

    }
    this.spinner.hide();
  }



  listTipos: any[] = [];
  getListTiposHardware(){
    let arrayParametro: any[] = [{queryId: 32}];

    this.personalService.getListTiposHardware(arrayParametro[0]).subscribe((resp) => {
      this.listTipos = resp;
    });
  }

  listMarca: any[] = [];
  getListMarcaHardware(){
    let arrayParametro: any[] = [{ queryId: 33 }];

    this.personalService.getListMarcaHardware(arrayParametro[0]).subscribe((resp) => {
      this.listMarca = resp;
    });
  }

  limpiarFiltro() {
    this.filtroForm.reset('', {emitEvent: false})

    this.cargarOBuscarHardwareDisponible();
  };

  totalfiltro = 0;
  cambiarPagina(event: number) {
    let offset = event*10;
    this.spinner.show();

    if (this.totalfiltro != this.totalHardware) {
      this.personalService.cargarOBuscarHardwareDisponible(offset.toString()).subscribe( (resp: any) => {
            this.listaHardwareDisp = resp.list;
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
