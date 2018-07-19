import { stringify } from 'qs';
import  request  from '../utils/request';
import * as menuConfig from './../common/menu';
import { menuData } from './../../mock/menuData'

export async function getAuthMenus() {
  return request('/api/menuData').then(function(datas){
    return new Promise(function (resolve) {
      resolve(menuConfig.getMenuData(datas));
    });
  });
}

export async function getRouterData(routerConfig, menuData) {
    const flatMenuData = menuConfig.getFlatMenuData(menuData);
    return menuConfig.getRouterData(routerConfig, flatMenuData);
}

export function getRouterDataSync(routerConfig, menuData) {
    const flatMenuData = menuConfig.getFlatMenuData(menuData);
    return menuConfig.getRouterData(routerConfig, flatMenuData);
}

