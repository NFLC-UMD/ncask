import {model, property} from '@loopback/repository';

/**
 * The model class is generated from OpenAPI schema - Catalog
 * Public endpoint for searching the catalog of published content.
 */
@model({name: 'Catalog'})
export class Catalog {
  constructor(data?: Partial<Catalog>) {
    if (data != null && typeof data === 'object') {
      Object.assign(this, data);
    }
  }

  /**
   * 
   */
  @property({name: 'id'})
  id: string;

  /**
   * 
   */
  @property({name: 'title'})
  title?: string;

  /**
   * 
   */
  @property({name: 'releasedate'})
  releasedate?: Date;

  /**
   * 
   */
  @property({name: 'product'})
  product?: string;

  /**
   * 
   */
  @property({name: 'lessontype'})
  lessontype?: string;

  /**
   * 
   */
  @property({name: 'sm_count'})
  sm_count?: number;

  /**
   * 
   */
  @property({name: 'sm_langs'})
  sm_langs?: {
  
};

  /**
   * 
   */
  @property({name: 'sm_modalities'})
  sm_modalities?: {
  
};

  /**
   * 
   */
  @property({name: 'sm_levels'})
  sm_levels?: {
  
};

  /**
   * 
   */
  @property({name: 'sm_topics'})
  sm_topics?: {
  
};

}

