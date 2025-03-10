import { Component } from '@angular/core';
import { GenericModel } from '../../../Model/Views/Dynamic/GenericModel';
import { AuthService } from '../../../Service/seguridad/AuthService.service';
import { Producto } from '../../../Model/Domain/Producto/ProductoClass';
import { ProductoService } from '../../../Service/producto/Producto.service';
import { CallbacksProductoService } from '../../../Service/Callbacks/CallbacksProductoService';
import { UserAuthority } from '../../../Model/Domain/User/UserAuthority.enum';

@Component({
  selector: 'app-dialago-oferta',
  templateUrl: './dialago-oferta.component.html',
  styleUrl: './dialago-oferta.component.css',
})
export class DialagoOfertaComponent {
  isDialogVisible: boolean = false;
  params!: any[];
  userAuthority = UserAuthority;
  constructor(
    public genericModel: GenericModel,
    public authService: AuthService,
    private productoService: ProductoService,
    private callbacksProductoService: CallbacksProductoService
  ) {}
  ngOnInit(): void {
    this.callbacksProductoService.openOfertaDialog$.subscribe(
      (selectedItems: Producto[]) => {
        this.params = [...selectedItems];
        this.isDialogVisible = true;
      }
    );
  }

  save(): void {
    this.productoService.alternarOfertas(this.params);

    this.isDialogVisible = false;
    this.genericModel.elementsSeleccionados.length = 0;
  }
}
