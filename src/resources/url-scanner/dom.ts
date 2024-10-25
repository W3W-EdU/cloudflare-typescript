// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../resource';
import * as Core from '../../core';
import * as DOMAPI from './dom';

export class DOM extends APIResource {
  /**
   * Returns a plain text response, with the scan's DOM content as rendered by
   * Chrome.
   */
  get(accountId: string, scanId: string, options?: Core.RequestOptions): Core.APIPromise<string> {
    return this._client.get(`/accounts/${accountId}/urlscanner/v2/dom/${scanId}`, {
      ...options,
      headers: { Accept: 'text/plain', ...options?.headers },
    });
  }
}

/**
 * HTML of webpage.
 */
export type DOMGetResponse = string;

export namespace DOM {
  export type DOMGetResponse = DOMAPI.DOMGetResponse;
}
