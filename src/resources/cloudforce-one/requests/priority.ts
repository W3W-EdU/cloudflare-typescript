// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import * as Core from 'cloudflare/core';
import { APIResource } from 'cloudflare/resource';
import * as PriorityAPI from 'cloudflare/resources/cloudforce-one/requests/priority';
import * as RequestsAPI from 'cloudflare/resources/cloudforce-one/requests/requests';

export class PriorityResource extends APIResource {
  /**
   * Create a New Priority Requirement
   */
  create(
    accountIdentifier: string,
    body: PriorityCreateParams,
    options?: Core.RequestOptions,
  ): Core.APIPromise<Priority> {
    return (
      this._client.post(`/accounts/${accountIdentifier}/cloudforce-one/requests/priority/new`, {
        body,
        ...options,
      }) as Core.APIPromise<{ result: Priority }>
    )._thenUnwrap((obj) => obj.result);
  }

  /**
   * Update a Priority Intelligence Requirement
   */
  update(
    accountIdentifier: string,
    priorityIdentifer: string,
    body: PriorityUpdateParams,
    options?: Core.RequestOptions,
  ): Core.APIPromise<RequestsAPI.Item> {
    return (
      this._client.put(
        `/accounts/${accountIdentifier}/cloudforce-one/requests/priority/${priorityIdentifer}`,
        { body, ...options },
      ) as Core.APIPromise<{ result: RequestsAPI.Item }>
    )._thenUnwrap((obj) => obj.result);
  }

  /**
   * Delete a Priority Intelligence Report
   */
  delete(
    accountIdentifier: string,
    priorityIdentifer: string,
    options?: Core.RequestOptions,
  ): Core.APIPromise<PriorityDeleteResponse> {
    return (
      this._client.delete(
        `/accounts/${accountIdentifier}/cloudforce-one/requests/priority/${priorityIdentifer}`,
        options,
      ) as Core.APIPromise<{ result: PriorityDeleteResponse }>
    )._thenUnwrap((obj) => obj.result);
  }

  /**
   * Get a Priority Intelligence Requirement
   */
  get(
    accountIdentifier: string,
    priorityIdentifer: string,
    options?: Core.RequestOptions,
  ): Core.APIPromise<RequestsAPI.Item> {
    return (
      this._client.get(
        `/accounts/${accountIdentifier}/cloudforce-one/requests/priority/${priorityIdentifer}`,
        options,
      ) as Core.APIPromise<{ result: RequestsAPI.Item }>
    )._thenUnwrap((obj) => obj.result);
  }

  /**
   * Get Priority Intelligence Requirement Quota
   */
  quota(accountIdentifier: string, options?: Core.RequestOptions): Core.APIPromise<RequestsAPI.Quota> {
    return (
      this._client.get(
        `/accounts/${accountIdentifier}/cloudforce-one/requests/priority/quota`,
        options,
      ) as Core.APIPromise<{ result: RequestsAPI.Quota }>
    )._thenUnwrap((obj) => obj.result);
  }
}

export type Label = string;

export interface Priority {
  /**
   * UUID
   */
  id: string;

  /**
   * Priority creation time
   */
  created: string;

  /**
   * List of labels
   */
  labels: Array<Label>;

  /**
   * Priority
   */
  priority: number;

  /**
   * Requirement
   */
  requirement: string;

  /**
   * The CISA defined Traffic Light Protocol (TLP)
   */
  tlp: 'clear' | 'amber' | 'amber-strict' | 'green' | 'red';

  /**
   * Priority last updated time
   */
  updated: string;
}

export interface PriorityEdit {
  /**
   * List of labels
   */
  labels: Array<Label>;

  /**
   * Priority
   */
  priority: number;

  /**
   * Requirement
   */
  requirement: string;

  /**
   * The CISA defined Traffic Light Protocol (TLP)
   */
  tlp: 'clear' | 'amber' | 'amber-strict' | 'green' | 'red';
}

export type PriorityDeleteResponse = unknown | Array<unknown> | string;

export interface PriorityCreateParams {
  /**
   * List of labels
   */
  labels: Array<Label>;

  /**
   * Priority
   */
  priority: number;

  /**
   * Requirement
   */
  requirement: string;

  /**
   * The CISA defined Traffic Light Protocol (TLP)
   */
  tlp: 'clear' | 'amber' | 'amber-strict' | 'green' | 'red';
}

export interface PriorityUpdateParams {
  /**
   * List of labels
   */
  labels: Array<Label>;

  /**
   * Priority
   */
  priority: number;

  /**
   * Requirement
   */
  requirement: string;

  /**
   * The CISA defined Traffic Light Protocol (TLP)
   */
  tlp: 'clear' | 'amber' | 'amber-strict' | 'green' | 'red';
}

export namespace PriorityResource {
  export import Label = PriorityAPI.Label;
  export import Priority = PriorityAPI.Priority;
  export import PriorityEdit = PriorityAPI.PriorityEdit;
  export import PriorityDeleteResponse = PriorityAPI.PriorityDeleteResponse;
  export import PriorityCreateParams = PriorityAPI.PriorityCreateParams;
  export import PriorityUpdateParams = PriorityAPI.PriorityUpdateParams;
}
