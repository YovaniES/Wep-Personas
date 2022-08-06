import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
})
export class AsideComponent implements OnInit {
  @Output() generalfixedAside = new EventEmitter<Boolean>();
  fixedAside = true; //OBS: Verificar
  menuList = [
    {
      id: 1,
      code: 'MAN',
      text: 'Gestión Personal',
      order: 1,
      icon: 'people',
      type: 'PAREN',
      link: 'gestion',
      enable: false,
      module: 'Reporte',
      displayed: false,
      submenus: [
        {
          code: 'MAN-001',
          text: 'Personal',
          order: 0,
          icon: 'how_to_reg',
          type: 'ALONE',
          link: 'gestion/personas',
          enable: false,
          module: 'MAN',
          displayed: false,
        },
        {
          code: 'MAN-002',
          text: 'Recurso Hardware',
          order: 20,
          icon: 'phonelink',
          type: 'PAREN',
          link: 'gestion/hardware',
          enable: false,
          module: 'MAN',
          displayed: false,
        },
        {
          code: 'MAN-002',
          text: 'Recurso Cuenta',
          order: 20,
          icon: 'lock_clock',
          type: 'PAREN',
          link: 'gestion/cuentas',
          enable: false,
          module: 'MAN',
          displayed: false,
        },
      ],
    },

    {
      id: 2,
      code: 'HER',
      text: 'Mantenimiento',
      order: 1,
      icon: 'settings_suggest',
      type: 'PAREN',
      link: 'iniciativa',
      enable: false,
      module: 'administrador',
      displayed: false,
      submenus: [
        {
          code: 'PAS-001',
          text: 'Entidad',
          order: 3,
          icon: 'dashboard_customize',
          type: 'PAREN',
          link: 'mantenimiento/entidad',
          enable: false,
          module: 'PAS',
          displayed: false,
        },
        // {
        //   code: 'PAS-003',
        //   text: 'Reporte',
        //   order: 3,
        //   icon: 'format_list_numbered',
        //   type: 'ALONE',
        //   link: 'iniciativa/reporte',
        //   enable: false,
        //   module: 'PAS',
        //   displayed: false,
        // }
      ],
    },
  ];


  constructor() {}

  ngOnInit(): void { }


  clickLinkMenu() {
    this.menuList.forEach((item) => {
      item.displayed = false;
    });
  }

  clickToggleMenu(item: any) {
    const final = !item.displayed;
    if (!(this.fixedAside == false && final == false)) {
      this.menuList.map((item) => {
        item.displayed = false;
      });
      item.displayed = final;
    }
    this.toggleAside(true);
  }

  toggleAside(e: boolean) {
    this.fixedAside = e;
    this.generalfixedAside.emit(this.fixedAside);
  }
}
