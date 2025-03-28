import {
  Component,
  OnInit,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ElementRef,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ContextMenu } from 'primeng/contextmenu';
import { GenericModel } from '../../Model/Views/Dynamic/GenericModel';
import { ProductoService } from '../../Service/producto/Producto.service';
import { User } from '../../Model/Domain/User/UserClass';
import { Producto } from '../../Model/Domain/Producto/ProductoClass';
import { AuthService } from '../../Service/seguridad/AuthService.service';
import { UserAuthority } from '../../Model/Domain/User/UserAuthority.enum';
import { PasarInformacionTablaService } from '../../Service/pasar-informacion-tabla/pasar-informacion-tabla.service';
import { CallbacksProductoService } from '../../Service/Callbacks/CallbacksProductoService';

@Component({
  selector: 'app-esquema-lista',
  templateUrl: './esquema-lista.component.html',
  styleUrls: ['./esquema-lista.component.css'],
})
export class EsquemaListaComponent implements OnInit {
  @Input() title: string = '';
  @Output() paramsChange = new EventEmitter<any>();
  @Output() TableSelected = new EventEmitter<any[]>();

  itemsCopy: MenuItem[] = [];
  firstItem: any[] = [];
  items: MenuItem[] = [];
  layout!: 'list' | 'grid';
  userAuthority = UserAuthority;

  @ViewChild('menu') menu!: ContextMenu;
  @ViewChild('top') topElement!: ElementRef;
  headers: any[] = [];
  private currentTipo: string | null = null;
 
  private accumulatedCartClicks: { [productId: number]: number } = {};
  private clickTimers: { [productId: number]: any } = {};

  get datos(): User[] | Producto[] {
    return this.genericModel.elements;
  }

  constructor(
    private route: ActivatedRoute,
    public genericModel: GenericModel,
    public authService: AuthService,
    public pasarInformacionTablaService: PasarInformacionTablaService,
    public productoService: ProductoService,
    public callbacksProductoService: CallbacksProductoService
  ) {}

  ngOnInit() {
    // Parte clave para rellenar la tabla en función de la URL
    this.route.paramMap.subscribe((params) => {
      const tipo = params.get('tipo');
      if (tipo !== this.currentTipo) {
        this.currentTipo = tipo;
        this.pasarInformacionTablaService.inicializar(tipo);
      }
    });

    this.pasarInformacionTablaService.title.subscribe((title) => {
      this.title = title;
    });

    this.layout = this.authService.hasAuthority(UserAuthority.ADMIN)
      ? 'list'
      : 'grid';
  }

  
  // Selecciona los elementos de la tabla
  onselectedTable(event: MouseEvent, item: any) {
    if (this.authService.hasAuthority(UserAuthority.ADMIN)) {
      if (event.button !== 2 && event.button !== 1) {
        if (!this.genericModel.elementsSeleccionados.includes(item)) {
          this.genericModel.elementsSeleccionados.push(item);
        } else {
          this.genericModel.elementsSeleccionados =
            this.genericModel.elementsSeleccionados.filter(
              (selected) => selected !== item
            );
        }
        this.TableSelected.emit(this.genericModel.elementsSeleccionados);
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['params']?.currentValue) {
      this.genericModel.elements = [];
    }
  }

  onContextMenu(event: MouseEvent, item: any) {
    if (this.authService.hasAuthority(UserAuthority.ADMIN)) {
      event.preventDefault();

      if (!this.genericModel.elementsSeleccionados.includes(item)) {
        this.genericModel.elementsSeleccionados.push(item);
        this.TableSelected.emit(this.genericModel.elementsSeleccionados);
      }

      this.items = item.getMenuItems(this.genericModel.elementsSeleccionados);

      this.menu.show(event);
    }
  }

  onValueChange(item: any, field: string, newValue: any): void {
    item[field] = newValue;
    this.paramsChange.emit(item.setDetails(item));
  }
  // Hace que no salga el create donde no debe
  getCreate() {
    if (this.title !== 'Pedidos') {
      this.items = this.datos[0].getMenuItems(
        this.genericModel.elementsSeleccionados
      );
      this.itemsCopy = [...this.items];
      this.firstItem = [this.itemsCopy[0]];
      this.firstItem[0].command();
    }
  }

  // Pone el scroll en la parte de arriba
  onPageChange(event: any): void {
    this.topElement.nativeElement.scrollIntoView();
  }

  accumulatedAddCart(item: Producto): void {
    const productId = item.id;
    if (!this.accumulatedCartClicks[productId]) {
      this.accumulatedCartClicks[productId] = 0;
    }
    this.accumulatedCartClicks[productId]++;

    if (this.clickTimers[productId]) {
      clearTimeout(this.clickTimers[productId]);
    }
    this.clickTimers[productId] = setTimeout(() => {
      const totalClicks = this.accumulatedCartClicks[productId];
      for (let i = 0; i < totalClicks; i++) {
        this.callbacksProductoService.alternarCart([item]);
      }
      this.accumulatedCartClicks[productId] = 0;
      this.clickTimers[productId] = null;
    }, 500);
  }
}
