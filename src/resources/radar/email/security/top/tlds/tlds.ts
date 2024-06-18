// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import * as Core from '../../../../../../core';
import { APIResource } from '../../../../../../resource';
import { isRequestOptions } from '../../../../../../core';
import * as TldsAPI from './tlds';
import * as TopAPI from '../../../../http/top';
import * as MaliciousAPI from './malicious';
import * as SpamAPI from './spam';
import * as SpoofAPI from './spoof';

export class Tlds extends APIResource {
  malicious: MaliciousAPI.Malicious = new MaliciousAPI.Malicious(this._client);
  spam: SpamAPI.Spam = new SpamAPI.Spam(this._client);
  spoof: SpoofAPI.Spoof = new SpoofAPI.Spoof(this._client);

  /**
   * Get the top TLDs by email messages. Values are a percentage out of the total
   * emails.
   */
  get(query?: TldGetParams, options?: Core.RequestOptions): Core.APIPromise<TldGetResponse>;
  get(options?: Core.RequestOptions): Core.APIPromise<TldGetResponse>;
  get(
    query: TldGetParams | Core.RequestOptions = {},
    options?: Core.RequestOptions,
  ): Core.APIPromise<TldGetResponse> {
    if (isRequestOptions(query)) {
      return this.get({}, query);
    }
    return (
      this._client.get('/radar/email/security/top/tlds', { query, ...options }) as Core.APIPromise<{
        result: TldGetResponse;
      }>
    )._thenUnwrap((obj) => obj.result);
  }
}

export interface TldGetResponse {
  meta: TldGetResponse.Meta;

  top_0: Array<TopAPI.Browser>;
}

export namespace TldGetResponse {
  export interface Meta {
    dateRange: Array<Meta.DateRange>;

    lastUpdated: string;

    confidenceInfo?: Meta.ConfidenceInfo;
  }

  export namespace Meta {
    export interface DateRange {
      /**
       * Adjusted end of date range.
       */
      endTime: string;

      /**
       * Adjusted start of date range.
       */
      startTime: string;
    }

    export interface ConfidenceInfo {
      annotations?: Array<ConfidenceInfo.Annotation>;

      level?: number;
    }

    export namespace ConfidenceInfo {
      export interface Annotation {
        dataSource: string;

        description: string;

        eventType: string;

        isInstantaneous: boolean;

        endTime?: string;

        linkedUrl?: string;

        startTime?: string;
      }
    }
  }
}

export interface TldGetParams {
  /**
   * Filter for arc (Authenticated Received Chain).
   */
  arc?: Array<'PASS' | 'NONE' | 'FAIL'>;

  /**
   * End of the date range (inclusive).
   */
  dateEnd?: Array<string>;

  /**
   * For example, use `7d` and `7dControl` to compare this week with the previous
   * week. Use this parameter or set specific start and end dates (`dateStart` and
   * `dateEnd` parameters).
   */
  dateRange?: Array<
    | '1d'
    | '2d'
    | '7d'
    | '14d'
    | '28d'
    | '12w'
    | '24w'
    | '52w'
    | '1dControl'
    | '2dControl'
    | '7dControl'
    | '14dControl'
    | '28dControl'
    | '12wControl'
    | '24wControl'
  >;

  /**
   * Array of datetimes to filter the start of a series.
   */
  dateStart?: Array<string>;

  /**
   * Filter for dkim.
   */
  dkim?: Array<'PASS' | 'NONE' | 'FAIL'>;

  /**
   * Filter for dmarc.
   */
  dmarc?: Array<'PASS' | 'NONE' | 'FAIL'>;

  /**
   * Format results are returned in.
   */
  format?: 'JSON' | 'CSV';

  /**
   * Limit the number of objects in the response.
   */
  limit?: number;

  /**
   * Array of names that will be used to name the series in responses.
   */
  name?: Array<string>;

  /**
   * Filter for spf.
   */
  spf?: Array<'PASS' | 'NONE' | 'FAIL'>;

  /**
   * Filter for TLDs by category.
   */
  tldCategory?: 'CLASSIC' | 'COUNTRY';

  /**
   * Filter for tls version.
   */
  tlsVersion?: Array<'TLSv1_0' | 'TLSv1_1' | 'TLSv1_2' | 'TLSv1_3'>;
}

export namespace Tlds {
  export import TldGetResponse = TldsAPI.TldGetResponse;
  export import TldGetParams = TldsAPI.TldGetParams;
  export import Malicious = MaliciousAPI.Malicious;
  export import MaliciousGetResponse = MaliciousAPI.MaliciousGetResponse;
  export import MaliciousGetParams = MaliciousAPI.MaliciousGetParams;
  export import Spam = SpamAPI.Spam;
  export import SpamGetResponse = SpamAPI.SpamGetResponse;
  export import SpamGetParams = SpamAPI.SpamGetParams;
  export import Spoof = SpoofAPI.Spoof;
  export import SpoofGetResponse = SpoofAPI.SpoofGetResponse;
  export import SpoofGetParams = SpoofAPI.SpoofGetParams;
}
