import { Injectable } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { CallbacksService } from '../../../../../Service/Callbacks/CallbacksService';
import { MenuStrategy } from '../MenuStrategy';

@Injectable({
  providedIn: 'root',
})
export class AdminMenuStrategy implements MenuStrategy {
  url: string = '/newProducto';
  constructor(private callbacks: CallbacksService) {}

  getMenuItems(context: any, selectedItems: any[]): MenuItem[] {
    return [
      {
        label: 'Crear',
        icon: 'pi pi-plus',

        command: () => this.callbacks.createProducto(),
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        command: () => this.callbacks.deleteProductos(selectedItems),
      },
      {
        label: 'Editar',
        icon: 'pi pi-pencil',
        command: () => this.callbacks.editProducto(context),
      },
      {
        label: 'Oferta',
        icon: 'pi pi-tag',
        command: () => this.callbacks.toggleOferta(selectedItems),
      },
    ];
  }
}
