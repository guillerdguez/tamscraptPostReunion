import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './UI/home/home.component';
import { EsquemaListaComponent } from './UI/esquema-lista/esquema-lista.component';
import { ProductoDetailComponent } from './UI/productos/producto-editar/producto-detail.component';
import { UserDetailComponent } from './UI/clientes/user-editar/user-detail.component';
import { FormularioComponentProducto } from './UI/productos/formularioProductos/formulario.component';
import { authGuard } from './Service/seguridad/AuthGuard';
import { roleGuard } from './Service/seguridad/RoleGuard';
import { LoginComponent } from './UI/clientes/seguridad/login/login.component';
import { CartComponent } from './UI/compra/cart/cart.component';
import { CheckoutComponent } from './UI/compra/checkout/checkout.component';
import { UserAuthority } from './Model/Domain/User/UserAuthority.enum';
import { FormularioComponentUser } from './UI/clientes/formularioProductos/formulario.component';
import { PedidoDeailComponent } from './UI/compra/pedido/pedido-deail/pedido-deail.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'productos', redirectTo: '/tabla/productos' },
  { path: 'favorito', redirectTo: '/tabla/favorito' },
  { path: 'ofertas', redirectTo: '/tabla/ofertas' },
  { path: 'lettering', redirectTo: '/tabla/lettering' },
  { path: 'scrapbooking', redirectTo: '/tabla/scrapbooking' },
  { path: 'users', redirectTo: '/tabla/users' },
  { path: 'pedidosCliente', redirectTo: 'tabla/pedidosCliente' },

  { path: 'tabla/:tipo', component: EsquemaListaComponent },
  { path: 'carrito', component: CartComponent, canMatch: [authGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: FormularioComponentUser },
  { path: 'checkout', component: CheckoutComponent },

  {
    path: 'detail/Productos/:id',
    component: ProductoDetailComponent,
    // canMatch: [authGuard],
  },
  {
    path: 'detail/Pedidos/:id',
    component: PedidoDeailComponent,
  },
  {
    path: 'detail/Users/:id',
    component: UserDetailComponent,
    canMatch: [authGuard],
  },

  // Rutas de Administrador

  {
    path: 'newProducto',
    component: FormularioComponentProducto,
    canMatch: [authGuard, () => roleGuard(UserAuthority.ADMIN)],
  },
  {
    path: 'pedidos',
    redirectTo: '/tabla/pedidos',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
