// File generated from our OpenAPI spec by Stainless.

import * as Core from 'cloudflare/core';
import { APIResource } from 'cloudflare/resource';
import * as AvailabilitiesAPI from 'cloudflare/resources/speed/availabilities';

export class Availabilities extends APIResource {
  /**
   * Retrieves quota for all plans, as well as the current zone quota.
   */
  list(zoneId: string, options?: Core.RequestOptions): Core.APIPromise<AvailabilityListResponse> {
    return (
      this._client.get(`/zones/${zoneId}/speed_api/availabilities`, options) as Core.APIPromise<{
        result: AvailabilityListResponse;
      }>
    )._thenUnwrap((obj) => obj.result);
  }
}

export interface AvailabilityListResponse {
  quota?: AvailabilityListResponse.Quota;

  regions?: Array<AvailabilityListResponse.Region>;

  regionsPerPlan?: unknown;
}

export namespace AvailabilityListResponse {
  export interface Quota {
    /**
     * Cloudflare plan.
     */
    plan?: string;

    /**
     * The number of tests available per plan.
     */
    quotasPerPlan?: Record<string, number>;

    /**
     * The number of remaining schedules available.
     */
    remainingSchedules?: number;

    /**
     * The number of remaining tests available.
     */
    remainingTests?: number;

    /**
     * The number of schedules available per plan.
     */
    scheduleQuotasPerPlan?: Record<string, number>;
  }

  /**
   * A test region with a label.
   */
  export interface Region {
    label?: string;

    /**
     * A test region.
     */
    value?:
      | 'asia-east1'
      | 'asia-northeast1'
      | 'asia-northeast2'
      | 'asia-south1'
      | 'asia-southeast1'
      | 'australia-southeast1'
      | 'europe-north1'
      | 'europe-southwest1'
      | 'europe-west1'
      | 'europe-west2'
      | 'europe-west3'
      | 'europe-west4'
      | 'europe-west8'
      | 'europe-west9'
      | 'me-west1'
      | 'southamerica-east1'
      | 'us-central1'
      | 'us-east1'
      | 'us-east4'
      | 'us-south1'
      | 'us-west1';
  }
}

export namespace Availabilities {
  export import AvailabilityListResponse = AvailabilitiesAPI.AvailabilityListResponse;
}
