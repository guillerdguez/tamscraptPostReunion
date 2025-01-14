import { Component, OnInit, DoCheck } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ProductoService } from '../../../Service/producto/Producto.service';
import { GenericModel } from '../../../Model/Views/Dynamic/GenericModel';
import { AuthService } from '../../../Service/seguridad/AuthService.service';
import { CallbacksProductoService } from '../../../Service/Callbacks/CallbacksProductoService';
import { UserAuthority } from '../../../Model/Domain/User/UserAuthority.enum';
import { CartService } from '../../../Service/carrito/CartService';
import { filter } from 'rxjs';

@Component({
  selector: 'app-producto-detail',
  templateUrl: './producto-detail.component.html',
  styleUrls: ['./producto-detail.component.css'],
})
export class ProductoDetailComponent implements OnInit, DoCheck {
  params: any[] = [];
  userAuthority = UserAuthority;
  cantidad: number = 1;
  private elementAnterior: any;

  constructor(
    private productoService: ProductoService,
    private location: Location,
    public genericModel: GenericModel,
    public authService: AuthService,
    public router: Router,
    public route: ActivatedRoute,
    public callbacksProductoService: CallbacksProductoService,
    public cartService: CartService
  ) {}
  //en ocasiones no se actualiza el producto
  ngOnInit(): void {
    if (
      this.authService.hasAuthority(UserAuthority.ADMIN) &&
      this.genericModel.elementsSeleccionados.length !== 0
    ) {
      console.log('llega', this.genericModel.elementsSeleccionados.length);
      // this.params = [...this.genericModel.elementsSeleccionados];
      this.genericModel.elementsSeleccionados =
        this.genericModel.elementsSeleccionados.filter(
          (item, index, self) =>
            index === self.findIndex((t) => t.id === item.id)
        );
      this.params = this.genericModel.elementsSeleccionados;
    } else {
      const id = Number(this.route.snapshot.paramMap.get('id'));
      this.productoService.getProducto(id);
      console.log('llega2', this.genericModel.elementsSeleccionados.length);
    }
    this.location.subscribe(() => {
      console.log('llega');
      this.genericModel.elementsSeleccionados.length = 0;
    });
    // da problemas con la edicion  de multiples
    // this.router.events
    //   .pipe(filter((event) => event instanceof NavigationEnd))
    //   .subscribe(() => {
    //     // Se ejecuta cada vez que se completa una navegación
    //     this.genericModel.elementsSeleccionados.length = 0;
    //   });
  }

  ngDoCheck(): void {
    if (this.genericModel.element !== this.elementAnterior) {
      this.elementAnterior = this.genericModel.element;
      this.asignarParamsDesdeGenericModel();
    }
  }
  //da fallos al ir hacia atras
  private asignarParamsDesdeGenericModel(): void {
    if (
      Array.isArray(this.genericModel.element) &&
      this.genericModel.element.length > 0
    ) {
      const primerElem = this.genericModel.element[0];
      if (Array.isArray(primerElem)) {
        this.params = [...primerElem];
      } else {
        this.params = [...this.genericModel.element];
      }
    }
  }

  goBack(): void {
    this.location.back();
    this.router.navigateByUrl(this.router.url);
    this.genericModel.elementsSeleccionados.length = 0;
  }

  save(): void {
    this.productoService.editMultipleProductos(this.params);
    this.location.back();
    this.router.navigateByUrl(this.router.url);
  }

  calcularPrecioOriginal(
    precioConDescuento: number,
    descuento: number
  ): number {
    return parseFloat((precioConDescuento / (1 - descuento / 100)).toFixed(2));
  }

  incrementar(): void {
    this.cantidad++;
  }

  decrementar(): void {
    if (this.cantidad > 1) {
      this.cantidad--;
    }
  }

  addCarrito(): void {
    if (this.params.length > 0) {
      this.cartService.addProductoCarrito(this.params[0], this.cantidad);
      this.cantidad = 1;
    }
  }
}

// import { Component, OnInit, DoCheck } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { Location } from '@angular/common';
// import { ProductoService } from '../../../Service/producto/Producto.service';
// import { GenericModel } from '../../../Model/Views/Dynamic/GenericModel';
// import { AuthService } from '../../../Service/seguridad/AuthService.service';
// import { CallbacksProductoService } from '../../../Service/Callbacks/CallbacksProductoService';
// import { UserAuthority } from '../../../Model/Domain/User/UserAuthority.enum';
// import { CartService } from '../../../Service/carrito/CartService';

// @Component({
//   selector: 'app-producto-detail',
//   templateUrl: './producto-detail.component.html',
//   styleUrls: ['./producto-detail.component.css'],
// })
// export class ProductoDetailComponent implements OnInit, DoCheck {
//   params: any[] = [];
//   userAuthority = UserAuthority;
//   cantidad: number = 1;
//   private elementAnterior: any;

//   constructor(
//     private productoService: ProductoService,
//     private location: Location,
//     public genericModel: GenericModel,
//     public authService: AuthService,
//     public router: Router,
//     public route: ActivatedRoute,
//     public callbacksProductoService: CallbacksProductoService,
//     public cartService: CartService
//   ) {}

//   ngOnInit(): void {
//     if (this.genericModel.elementsSeleccionados.length !== 0) {
//       this.params = [...this.genericModel.elementsSeleccionados];
//     } else {
//       const id = Number(this.route.snapshot.paramMap.get('id'));
//       this.productoService.getProducto(id);
//     }

//     this.location.subscribe(() => {
//       this.genericModel.elementsSeleccionados.length = 0;
//     });
//   }

//   ngDoCheck(): void {
//     if (this.genericModel.element !== this.elementAnterior) {
//       this.elementAnterior = this.genericModel.element;
//       this.asignarParamsDesdeGenericModel();
//       console.log('llega');
//     }
//   }

//   private asignarParamsDesdeGenericModel(): void {
//     if (
//       Array.isArray(this.genericModel.element) &&
//       this.genericModel.element.length > 0
//     ) {
//       const primerElem = this.genericModel.element[0];
//       if (Array.isArray(primerElem)) {
//         this.params = [...primerElem];
//       } else {
//         this.params = [...this.genericModel.element];
//       }
//     }
//     console.log('params asignados:', this.params);
//   }

//   goBack(): void {
//     this.location.back();
//     this.router.navigateByUrl(this.router.url);
//     this.genericModel.elementsSeleccionados.length = 0;
//   }

//   save(): void {
//     this.productoService.editMultipleProductos(this.params);
//     this.location.back();
//     this.router.navigateByUrl(this.router.url);
//   }

//   calcularPrecioOriginal(
//     precioConDescuento: number,
//     descuento: number
//   ): number {
//     return parseFloat((precioConDescuento / (1 - descuento / 100)).toFixed(2));
//   }

//   incrementar(): void {
//     this.cantidad++;
//   }

//   decrementar(): void {
//     if (this.cantidad > 1) {
//       this.cantidad--;
//     }
//   }

//   addCarrito(): void {
//     if (this.params.length > 0) {
//       this.cartService.addProductoCarrito(this.params[0], this.cantidad);
//       this.cantidad = 1;
//     }
//   }
// }
