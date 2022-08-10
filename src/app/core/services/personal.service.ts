import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { API_PERSONAS } from '../constants/url.constants';

@Injectable({
  providedIn: 'root',
})
export class PersonalService {
  constructor(private http: HttpClient) {}

  getListTiposHardware(obj: any){
    return this.http.post(API_PERSONAS, obj).pipe(
      map((marca: any) => {
        return marca.list.map((m: any) => {
          return {
            id         : m.id,
            nombre     : m.nombre,
            descripcion: m.descripcion
          }
        })
      })
    )
  }

  getListMarcaHardware(obj: any){
    return this.http.post(API_PERSONAS, obj).pipe(
      map((marca: any) => {
        return marca.list.map((m: any) => {
          return {
            id         : m.id,
            nombre     : m.nombre,
            descripcion: m.descripcion
          }
        })
      })
    )
  };

  getListEstados(obj: any) {
    return this.http.post(API_PERSONAS, obj);
  };

  getListGestores(obj: any) {
    return this.http.post(API_PERSONAS, obj);
  };

  getListLiquidaciones(obj: any) {
    return this.http.post(API_PERSONAS, obj);
  };

  crearCuenta(obj: any) {
    return this.http.post(API_PERSONAS, obj);
  };

  crearHardware(obj: any) {
    return this.http.post(API_PERSONAS, obj);
  }

  crearEntidadCombo(obj: any) {
    return this.http.post(API_PERSONAS, obj);
  }

  crearEntidadTabla(obj: any) {
    return this.http.post(API_PERSONAS, obj);
  }
  crearPersonal(obj: any) {
    return this.http.post(API_PERSONAS, obj);
  }

  crearFactura(obj: any) {
    return this.http.post(API_PERSONAS, obj);
  }

  // Listado de TIPOS
  getListTiposCuentas(obj: any){
    return this.http.post(API_PERSONAS, obj).pipe(
      map((tipo: any) => {
        return tipo.list.map((t: any) => {
          return {
            id          : t.id,
            nombre      : t.nombre,
            descripcion : t.descripcion
          }
        })
      })
    );
  };

  getListProyectos(obj: any){
    return this.http.post(API_PERSONAS, obj).pipe(
      map((proyectos: any) => {
        return proyectos.list.map((p: any) => {
          return {
            id          : p.id,
            codigo      : p.codigo,
            descripcion : p.descripcion
          }
        })
      })
    );
  };

  getListPerfiles(obj: any){
    return this.http.post(API_PERSONAS, obj).pipe(
      map((perfil: any) => {
        return perfil.list.map((p: any) => {
          return {
            id          : p.id,
            nombre      : p.nombre,
            descripcion : p.descripcion
          }
        })
      })
    );
  };

  getDescPerfil(obj: any){
    return this.http.post(API_PERSONAS, obj).pipe(
      map((descProyecto: any) => {
        return descProyecto.list.map((d: any) => {
          return {
            id          : d.id,
            nombre      : d.nombre,
            descripcion : d.descripcion
          }
        })
      })
    );
  }

  getDescProy(obj: any){
    return this.http.post(API_PERSONAS, obj).pipe(
      map((perfil: any) => {
        return perfil.list.map((p: any) => {
          return {
            id          : p.id,
            codigo      : p.codigo,
            descripcion : p.descripcion
          }
        })
      })
    );
  }

  getListEntidades(obj: any){
    return this.http.post(API_PERSONAS, obj).pipe(
      map((tipo: any) => {
        return tipo.list.map((e: any) => {
          return {
            id          : e.id,
            nombre      : e.nombre,
            descripcion : e.descripcion,
            idPadre     : e.idPadre
          }
        })
      })
    );
  };

  getListTotalTablas(obj: any) {
    return this.http.post(API_PERSONAS, obj).pipe(
      map((tablas: any) => {
        return tablas.list.map((t: any) => {
          return {
            id         : t.id,
            nombre     : t.nombre,
            descripcion: t.descripcion,
            idPadre    : t.idPadre,
          };
        });
      })
    );
  }


  cargarOBuscarcuentas(obj: any) {
    return this.http.post(API_PERSONAS, obj);
  }

  cargarOBuscarHardware(obj: any) {
    return this.http.post(API_PERSONAS, obj);
  }

  cargarOBuscarPersonal(obj: any) {
    return this.http.post(API_PERSONAS, obj);
  }

  cargarOBuscarEntidades(id: any) {
    return this.http.post(API_PERSONAS, id).pipe(
      map((entidad: any) => {
        return entidad.list.map((e: any) => {
          return {
            id                  : e.id,
            nombre              : e.nombre,
            descripcion         : e.descripcion,
            nombrePadre         : e.nombrePadre,
          }
        })
      })
    );
  };

  cargarOBuscarFacturas(obj: any) {
    return this.http.post(API_PERSONAS, obj);
  }

  getHistoricoCambiosProyecto(obj: any) {
    return this.http.post(API_PERSONAS, obj).pipe(
      map((histCamb: any) => {
        return histCamb.list.map( (historico: any) => {
          return {
            id_persona                : historico.id_persona,
            id_proyecto               : historico.id_proyecto,
            proyecto_codigo           : historico.proyecto_codigo,
            proyecto_descripcion      : historico.proyecto_descripcion,
            fecha_asignacion          : historico.fecha_asignacion,
            id_usuario_asignacion     : historico.id_usuario_asignacion,
            nombre_usuario_asignacion : historico.nombre_usuario_asignacion,
          }
        })
      })
    );
  }

  actualizarCuenta(obj: any) {
    return this.http.post(API_PERSONAS, obj);
  }

  actualizarHardware(obj: any){
    return this.http.post(API_PERSONAS, obj);
  }

  actualizarPersonal(obj: any){
    return this.http.post(API_PERSONAS, obj);
  }

  actualizarFactura(obj: any){
    return this.http.post(API_PERSONAS, obj);
  }

  eliminarCuenta(id: number) {
    return this.http.post(API_PERSONAS, id);
  }

  eliminarHardware(id: number) {
    return this.http.post(API_PERSONAS, id);
  }

  eliminarPersonal(id: number) {
    return this.http.post(API_PERSONAS, id);
  }

  eliminarFactura(id: number) {
    return this.http.post(API_PERSONAS, id);
  }

  cargarCuentasById(obj: any) {
    return this.http.post(API_PERSONAS, obj)
  };

  cargarPersonalById(obj: any) {
    return this.http.post(API_PERSONAS, obj)
  };

  cargarHardwareById(obj: any) {
    return this.http.post(API_PERSONAS, obj)
  }

}
