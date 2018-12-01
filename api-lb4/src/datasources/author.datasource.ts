import {inject} from '@loopback/core';
import {juggler} from '@loopback/repository';
import * as config from './author.datasource.json';
import { Catalog } from '../models/catalog.model';

export interface AuthorService {
  get(filter: object): Promise<Catalog[]>;
}

export class AuthorDataSource extends juggler.DataSource {
  static dataSourceName = 'author';

  constructor(
    @inject('datasources.config.author', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
