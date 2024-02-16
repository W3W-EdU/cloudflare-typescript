// File generated from our OpenAPI spec by Stainless.

import * as Core from 'cloudflare/core';
import { APIResource } from 'cloudflare/resource';
import * as EdgesAPI from 'cloudflare/resources/logpush/edges';

export class Edges extends APIResource {
  /**
   * Creates a new Instant Logs job for a zone.
   */
  update(
    zoneId: string,
    body: EdgeUpdateParams,
    options?: Core.RequestOptions,
  ): Core.APIPromise<EdgeUpdateResponse | null> {
    return (
      this._client.post(`/zones/${zoneId}/logpush/edge`, { body, ...options }) as Core.APIPromise<{
        result: EdgeUpdateResponse | null;
      }>
    )._thenUnwrap((obj) => obj.result);
  }

  /**
   * Lists Instant Logs jobs for a zone.
   */
  get(zoneId: string, options?: Core.RequestOptions): Core.APIPromise<EdgeGetResponse> {
    return (
      this._client.get(`/zones/${zoneId}/logpush/edge`, options) as Core.APIPromise<{
        result: EdgeGetResponse;
      }>
    )._thenUnwrap((obj) => obj.result);
  }
}

export interface EdgeUpdateResponse {
  /**
   * Unique WebSocket address that will receive messages from Cloudflare’s edge.
   */
  destination_conf?: string;

  /**
   * Comma-separated list of fields.
   */
  fields?: string;

  /**
   * Filters to drill down into specific events.
   */
  filter?: string;

  /**
   * The sample parameter is the sample rate of the records set by the client:
   * "sample": 1 is 100% of records "sample": 10 is 10% and so on.
   */
  sample?: number;

  /**
   * Unique session id of the job.
   */
  session_id?: string;
}

export type EdgeGetResponse = Array<EdgeGetResponse.EdgeGetResponseItem | null>;

export namespace EdgeGetResponse {
  export interface EdgeGetResponseItem {
    /**
     * Unique WebSocket address that will receive messages from Cloudflare’s edge.
     */
    destination_conf?: string;

    /**
     * Comma-separated list of fields.
     */
    fields?: string;

    /**
     * Filters to drill down into specific events.
     */
    filter?: string;

    /**
     * The sample parameter is the sample rate of the records set by the client:
     * "sample": 1 is 100% of records "sample": 10 is 10% and so on.
     */
    sample?: number;

    /**
     * Unique session id of the job.
     */
    session_id?: string;
  }
}

export interface EdgeUpdateParams {
  /**
   * Comma-separated list of fields.
   */
  fields?: string;

  /**
   * Filters to drill down into specific events.
   */
  filter?: string;

  /**
   * The sample parameter is the sample rate of the records set by the client:
   * "sample": 1 is 100% of records "sample": 10 is 10% and so on.
   */
  sample?: number;
}

export namespace Edges {
  export import EdgeUpdateResponse = EdgesAPI.EdgeUpdateResponse;
  export import EdgeGetResponse = EdgesAPI.EdgeGetResponse;
  export import EdgeUpdateParams = EdgesAPI.EdgeUpdateParams;
}
