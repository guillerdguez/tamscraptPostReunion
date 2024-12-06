import { Injectable } from '@angular/core';
import { TipoHandler } from '../../Model/Domain/interface/TipoHandler';
import { LetteringHandler } from '../handler/LetteringHandler';
import { OfertasHandler } from '../handler/OfertasHandler';
import { ProductosHandler } from '../handler/ProductosHandler';
import { ScrapbookingHandler } from '../handler/ScrapbookingHandler';
import { UsersHandler } from '../handler/UsersHandler';

@Injectable({
  providedIn: 'root',
})
export class TipoFactory {
  private handlerRegistry: { [key: string]: () => TipoHandler };

  constructor(
    private productosHandler: ProductosHandler,
    private scrapbookingHandler: ScrapbookingHandler,
    private letteringHandler: LetteringHandler,
    private ofertasHandler: OfertasHandler,
    private usersHandler: UsersHandler
  ) {
    // Registrar los manejadores en un objeto
    this.handlerRegistry = {
      productos: () => this.productosHandler,
      scrapbooking: () => this.scrapbookingHandler,
      lettering: () => this.letteringHandler,
      ofertas: () => this.ofertasHandler,
      users: () => this.usersHandler,
    };
  }

  getHandler(tipo: string): TipoHandler | null {
    // Usar el registro para obtener el handler correspondiente
    const handlerFactory = this.handlerRegistry[tipo];
    return handlerFactory ? handlerFactory() : null;
  }
}
