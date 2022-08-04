import { Component, OnInit } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Menu } from 'src/app/core/models/menu.models';
import { MenuService } from 'src/app/core/services/menu.service';

@Component({
  selector: 'app-menu-mobile',
  templateUrl: './menu-mobile.component.html',
  styles: [],
})
export class MenuMobileComponent implements OnInit {
  subMenus: Menu[] = [];
  subMenuActive: boolean = false;
  subMenuTitle: string = '';
  active: boolean = false;
  headerLogo = './assets/images/logos/cardano.svg';

  menuList = [
    {
      id: 1,
      code: 'MAN',
      text: 'Reportes',
      order: 1,
      icon: 'business',
      type: 'PAREN',
      link: 'dashboard',
      enable: false,
      module: 'Reporte',
      displayed: false,
      submenus: [
        {
          code: 'MAN-001',
          text: 'Reporte iniciativa',
          order: 0,
          icon: 'dashboard_customize',
          type: 'ALONE',
          link: 'dashboard/iniciativa',
          enable: false,
          module: 'MAN',
          displayed: false,
        },
        // {
        //   code: 'MAN-002',
        //   text: 'otros',
        //   order: 20,
        //   icon: 'people',
        //   type: 'PAREN',
        //   link: 'dashboard/abc',
        //   enable: false,
        //   module: 'MAN',
        //   displayed: false,
        // },
      ],
    },

    {
      id: 2,
      code: 'HER',
      text: 'Mantenimiento iniciativa',
      order: 1,
      icon: 'admin_panel_settings',
      type: 'PAREN',
      link: 'iniciativa',
      enable: false,
      module: 'administrador',
      displayed: false,
      submenus: [
        {
          code: 'PAS-001',
          text: 'Registros',
          order: 3,
          icon: 'menu_open',
          type: 'PAREN',
          link: 'iniciativa/registros',
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
  constructor(private menuService: MenuService, private router: Router) {}

  ngOnInit(): void {
    this.menuService.activeMenuMobile.subscribe((e) => (this.active = e));
  }

  close() {
    this.menuService.activeMenuMobile.emit(false);
  }

  closeSubMenu() {
    this.subMenuActive = false;
    this.subMenuTitle = '';
    this.subMenus = [];
  }
  showSubMenu(item: Menu) {
    this.subMenuActive = true;
    this.subMenus = item.submenus;
    this.subMenuTitle = item.text;
  }
  gotoPage(link: string | UrlTree) {
    this.subMenuActive = false;
    this.active = false;
    this.router.navigateByUrl(link);
  }
}
