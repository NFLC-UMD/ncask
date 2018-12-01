import {getService} from '@loopback/service-proxy';
import {inject, Provider} from '@loopback/core';
import {AuthorDataSource} from '../datasources/author.datasource';
import {Catalog} from '../models/catalog.model';

export interface AuthorService {
  // this is where you define the Node.js methods that will be
  // mapped to the SOAP operations as stated in the datasource
  // json file.
  get(filter: object): Promise<Catalog[]>;

}

export class AuthorServiceProvider implements Provider<AuthorService> {
  constructor(
    // author must match the name property in the datasource json file
    @inject('datasources.author')
    protected dataSource: AuthorDataSource = new AuthorDataSource(),
  ) {}

  value(): Promise<AuthorService> {
    return getService(this.dataSource);
  }
}
