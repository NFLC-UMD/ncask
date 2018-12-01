/* tslint:disable:no-any */
import {operation, param, requestBody, Request, RestBindings, get, ResponseObject} from '@loopback/rest';

import {Catalog} from '../models/catalog.model';
import {AuthorService} from '../services/author.service';
import {serviceProxy} from '@loopback/service-proxy';
import {inject} from '@loopback/context';

const CATALOG_RESPONSE: ResponseObject = {
  description: 'Catalog Response',
  content: {
    'application/json': {
      schema: {
        type: 'array'
      },
    },
  },
};

/**
 * The controller class is generated from OpenAPI spec with operations tagged
 * by Catalog
 * Public endpoint for searching the catalog of published content.
 */
export class CatalogController {
  @serviceProxy('authorService')
  private authorService: AuthorService;

  constructor(@inject(RestBindings.Http.REQUEST) private req: Request) {}

  /**
   * @param filter Filter defining fields, where, include, order, offset, and limit - must be a JSON-encoded string ({"something":"value"})
   * @returns Request was successful
   */
  @get('/Catalog', {
    responses: {
      '200': CATALOG_RESPONSE,
    },
  })
  async catalogFind(@param({name: 'filter', in: 'query'}) filter: object): Promise<Catalog[]> {
      return this.authorService.get(filter);
  }

  /**
   * 
   * 

   * @param where Criteria to match model instances
   * @returns Request was successful
   */
  @operation('get', '/Catalog/count')
  async catalogCount(@param({name: 'where', in: 'query'}) where: string): Promise<{
  count?: number;
}> {
    throw new Error('Not implemented');
  }

  /**
   * 
   * 

   * @returns Request was successful
   */
  @operation('post', '/Catalog/refresh')
  async catalogRefreshMatView(): Promise<{
  
}> {
    throw new Error('Not implemented');
  }

  /**
   * 
   * 

   * @returns Request was successful
   */
  @operation('get', '/Catalog/filters')
  async catalogGetFilters(): Promise<{
  
}> {
    throw new Error('Not implemented');
  }

  /**
   * 
   * 

   * @returns Request was successful
   */
  @operation('get', '/Catalog/properties')
  async catalogProperties(): Promise<{
  
}> {
    throw new Error('Not implemented');
  }

}

