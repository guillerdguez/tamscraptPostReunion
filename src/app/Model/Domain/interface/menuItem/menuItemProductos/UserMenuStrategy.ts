import { MenuItem } from 'primeng/api';
import { Injectable } from '@angular/core';
import { MenuStrategy } from '../MenuStrategy';
import { CallbacksProductoService } from '../../../../../Service/Callbacks/CallbacksProductoService';

@Injectable({
  providedIn: 'root',
})
export class UserMenuStrategy implements MenuStrategy {
  constructor(private callbacks: CallbacksProductoService) {}

  getMenuItems(context: any, selectedItems: any[]): MenuItem[] {
    return [
      {
        label: 'Ver',
        icon: 'pi pi-eye',
        command: () => this.callbacks.editProducto(context),
      },
      {
        label: 'Favorito',
        icon: 'pi pi-heart',
        command: () => this.callbacks.toggleFavorito(selectedItems),
      },
      {
        label: 'Carrito',
        icon: 'pi pi-shopping-cart',
        command: () => this.callbacks.toggleCart(selectedItems),
      },
    ];
  }
}
