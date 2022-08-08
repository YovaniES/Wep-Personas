import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { API_PERSONAS } from '../constants/url.constants';

@Injectable({
  providedIn: 'root',
})
export class PersonalService {
  constructor(private http: HttpClient) {}


  /*Listado de Cuentas*/
  getListadoCuenta(queryId: any){
    return this.http.post(API_PERSONAS, queryId).pipe(
      map((cuenta: any) => {
        return cuenta.list.map((c: any) => {
          return {
            id                    : c.id,
            usuario               : c.usuario,
            password              : c.password,
            tipo                  : c.tipo,
            fechaUltimaRenovacion : c.fechaUltimaRenovacion,
            fechaProximaRenovacion: c.fechaProximaRenovacion,
            estado                : c.estado,
            nombres               : c.nombres
          }
        })
    }));
  };

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
  }

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

  // getInfoProyecto(obj: any){
  //   return this.http.post(API_PERSONAS, obj);
  // }

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

  // LISTADO Y BUSQUEDA DE REGISTROS PARA LA TABLA
  cargarOBuscarcuentas(id: any) {
    return this.http.post(API_PERSONAS, id).pipe(
      map((cuenta: any) => {
        return cuenta.list.map((c: any) => {
          return {
            id                    : c.id,
            usuario               : c.usuario,
            password              : c.password,
            tipo                  : c.tipo,
            fechaUltimaRenovacion : c.fechaUltimaRenovacion,
            fechaProximaRenovacion: c.fechaProximaRenovacion,
            estado                : c.estado,
            nombres               : c.nombres
          }
        })
      })
    );
  };

  cargarOBuscarHardware(id: any) {
    return this.http.post(API_PERSONAS, id).pipe(
      map((hardware: any) => {
        return hardware.list.map((r: any) => {
          return {
            id_recurso         : r.id_recurso,
            tipo               : r.tipo,
            marca              : r.marca,
            correo             : r.correo,
            equipo             : r.equipo,
            modelo             : r.modelo,
            serie              : r.serie,
            imei               : r.imei,
            persona_asignada   : r.persona_asignada,
            codigo_corporativo : r.codigo_corporativo,
            proyecto           : r.proyecto,
            estado_recurso     : r.estado_recurso,
            observacion        : r.observacion,
          }
        })
      })
    );
  };

  cargarOBuscarPersonal(id: any) {
    return this.http.post(API_PERSONAS, id).pipe(
      map((personal: any) => {
        return personal.list.map((p: any) => {
          return {
            id                  : p.id,
            nombres             : p.nombres,
            apellidos           : p.apellidos,
            correo              : p.correo,
            dni                 : p.dni,
            codigo_corporativo  : p.codigo_corporativo,
            perfil              : p.perfil,
            codigo_proyecto     : p.codigo_proyecto,
            proyecto_descripcion: p.proyecto_descripcion,
            fecha_ingreso       : p.fecha_ingreso,
            estado              : p.estado,
          }
        })
      })
    );
  };

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

  actualizarCuenta(obj: any) {
    return this.http.post(API_PERSONAS, obj);
  }

  actualizarHardware(obj: any){
    return this.http.post(API_PERSONAS, obj);
  }

  actualizarPersonal(obj: any){
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
