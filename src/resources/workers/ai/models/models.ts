// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../../resource';
import * as SchemaAPI from './schema';

export class Models extends APIResource {
  schema: SchemaAPI.Schema = new SchemaAPI.Schema(this._client);
}

export namespace Models {
  export import Schema = SchemaAPI.Schema;
  export type SchemaGetResponse = SchemaAPI.SchemaGetResponse;
  export type SchemaGetParams = SchemaAPI.SchemaGetParams;
}
