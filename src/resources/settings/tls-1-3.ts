// File generated from our OpenAPI spec by Stainless.

import * as Core from 'cloudflare/core';
import { APIResource } from 'cloudflare/resource';
import * as TLS1_3API from 'cloudflare/resources/settings/tls-1-3';

export class TLS1_3 extends APIResource {
  /**
   * Changes TLS 1.3 setting.
   */
  update(
    zoneId: string,
    body: TLS1_3UpdateParams,
    options?: Core.RequestOptions,
  ): Core.APIPromise<TLS1_3UpdateResponse> {
    return (
      this._client.patch(`/zones/${zoneId}/settings/tls_1_3`, { body, ...options }) as Core.APIPromise<{
        result: TLS1_3UpdateResponse;
      }>
    )._thenUnwrap((obj) => obj.result);
  }

  /**
   * Gets TLS 1.3 setting enabled for a zone.
   */
  get(zoneId: string, options?: Core.RequestOptions): Core.APIPromise<TLS1_3GetResponse> {
    return (
      this._client.get(`/zones/${zoneId}/settings/tls_1_3`, options) as Core.APIPromise<{
        result: TLS1_3GetResponse;
      }>
    )._thenUnwrap((obj) => obj.result);
  }
}

/**
 * Enables Crypto TLS 1.3 feature for a zone.
 */
export interface TLS1_3UpdateResponse {
  /**
   * ID of the zone setting.
   */
  id: 'tls_1_3';

  /**
   * Current value of the zone setting.
   */
  value: 'on' | 'off' | 'zrt';

  /**
   * Whether or not this setting can be modified for this zone (based on your
   * Cloudflare plan level).
   */
  editable?: true | false;

  /**
   * last time this setting was modified.
   */
  modified_on?: string | null;
}

/**
 * Enables Crypto TLS 1.3 feature for a zone.
 */
export interface TLS1_3GetResponse {
  /**
   * ID of the zone setting.
   */
  id: 'tls_1_3';

  /**
   * Current value of the zone setting.
   */
  value: 'on' | 'off' | 'zrt';

  /**
   * Whether or not this setting can be modified for this zone (based on your
   * Cloudflare plan level).
   */
  editable?: true | false;

  /**
   * last time this setting was modified.
   */
  modified_on?: string | null;
}

export interface TLS1_3UpdateParams {
  /**
   * Value of the zone setting. Notes: Default value depends on the zone's plan
   * level.
   */
  value: 'on' | 'off' | 'zrt';
}

export namespace TLS1_3 {
  export import TLS1_3UpdateResponse = TLS1_3API.TLS1_3UpdateResponse;
  export import TLS1_3GetResponse = TLS1_3API.TLS1_3GetResponse;
  export import TLS1_3UpdateParams = TLS1_3API.TLS1_3UpdateParams;
}
