// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../resource';
import * as FallthroughAPI from './fallthrough';

export class ExpressionTemplate extends APIResource {
  fallthrough: FallthroughAPI.Fallthrough = new FallthroughAPI.Fallthrough(this._client);
}

export namespace ExpressionTemplate {
  export import Fallthrough = FallthroughAPI.Fallthrough;
  export type FallthroughCreateResponse = FallthroughAPI.FallthroughCreateResponse;
  export type FallthroughCreateParams = FallthroughAPI.FallthroughCreateParams;
}
