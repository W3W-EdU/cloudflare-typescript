// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../resource';
import * as Core from '../../../core';
import * as ListsAPI from './lists';
import * as BulkOperationsAPI from './bulk-operations';
import * as ItemsAPI from './items';
import { SinglePage } from '../../../pagination';

export class Lists extends APIResource {
  bulkOperations: BulkOperationsAPI.BulkOperations = new BulkOperationsAPI.BulkOperations(this._client);
  items: ItemsAPI.Items = new ItemsAPI.Items(this._client);

  /**
   * Creates a new list of the specified type.
   */
  create(params: ListCreateParams, options?: Core.RequestOptions): Core.APIPromise<ListsList> {
    const { account_id, ...body } = params;
    return (
      this._client.post(`/accounts/${account_id}/rules/lists`, { body, ...options }) as Core.APIPromise<{
        result: ListsList;
      }>
    )._thenUnwrap((obj) => obj.result);
  }

  /**
   * Updates the description of a list.
   */
  update(
    listId: string,
    params: ListUpdateParams,
    options?: Core.RequestOptions,
  ): Core.APIPromise<ListsList> {
    const { account_id, ...body } = params;
    return (
      this._client.put(`/accounts/${account_id}/rules/lists/${listId}`, {
        body,
        ...options,
      }) as Core.APIPromise<{ result: ListsList }>
    )._thenUnwrap((obj) => obj.result);
  }

  /**
   * Fetches all lists in the account.
   */
  list(
    params: ListListParams,
    options?: Core.RequestOptions,
  ): Core.PagePromise<ListsListsSinglePage, ListsList> {
    const { account_id } = params;
    return this._client.getAPIList(`/accounts/${account_id}/rules/lists`, ListsListsSinglePage, options);
  }

  /**
   * Deletes a specific list and all its items.
   */
  delete(
    listId: string,
    params: ListDeleteParams,
    options?: Core.RequestOptions,
  ): Core.APIPromise<ListDeleteResponse> {
    const { account_id } = params;
    return (
      this._client.delete(`/accounts/${account_id}/rules/lists/${listId}`, options) as Core.APIPromise<{
        result: ListDeleteResponse;
      }>
    )._thenUnwrap((obj) => obj.result);
  }

  /**
   * Fetches the details of a list.
   */
  get(listId: string, params: ListGetParams, options?: Core.RequestOptions): Core.APIPromise<ListsList> {
    const { account_id } = params;
    return (
      this._client.get(`/accounts/${account_id}/rules/lists/${listId}`, options) as Core.APIPromise<{
        result: ListsList;
      }>
    )._thenUnwrap((obj) => obj.result);
  }
}

export class ListsListsSinglePage extends SinglePage<ListsList> {}

/**
 * Valid characters for hostnames are ASCII(7) letters from a to z, the digits from
 * 0 to 9, wildcards (\*), and the hyphen (-).
 */
export interface Hostname {
  url_hostname: string;
}

/**
 * Valid characters for hostnames are ASCII(7) letters from a to z, the digits from
 * 0 to 9, wildcards (\*), and the hyphen (-).
 */
export interface HostnameParam {
  url_hostname: string;
}

export interface ListsList {
  /**
   * The unique ID of the list.
   */
  id?: string;

  /**
   * The RFC 3339 timestamp of when the list was created.
   */
  created_on?: string;

  /**
   * An informative summary of the list.
   */
  description?: string;

  /**
   * The type of the list. Each type supports specific list items (IP addresses,
   * ASNs, hostnames or redirects).
   */
  kind?: 'ip' | 'redirect' | 'hostname' | 'asn';

  /**
   * The RFC 3339 timestamp of when the list was last modified.
   */
  modified_on?: string;

  /**
   * An informative name for the list. Use this name in filter and rule expressions.
   */
  name?: string;

  /**
   * The number of items in the list.
   */
  num_items?: number;

  /**
   * The number of [filters](/operations/filters-list-filters) referencing the list.
   */
  num_referencing_filters?: number;
}

/**
 * The definition of the redirect.
 */
export interface Redirect {
  source_url: string;

  target_url: string;

  include_subdomains?: boolean;

  preserve_path_suffix?: boolean;

  preserve_query_string?: boolean;

  status_code?: 301 | 302 | 307 | 308;

  subpath_matching?: boolean;
}

/**
 * The definition of the redirect.
 */
export interface RedirectParam {
  source_url: string;

  target_url: string;

  include_subdomains?: boolean;

  preserve_path_suffix?: boolean;

  preserve_query_string?: boolean;

  status_code?: 301 | 302 | 307 | 308;

  subpath_matching?: boolean;
}

export interface ListDeleteResponse {
  /**
   * The unique ID of the item in the List.
   */
  id?: string;
}

export interface ListCreateParams {
  /**
   * Path param: Identifier
   */
  account_id: string;

  /**
   * Body param: The type of the list. Each type supports specific list items (IP
   * addresses, ASNs, hostnames or redirects).
   */
  kind: 'ip' | 'redirect' | 'hostname' | 'asn';

  /**
   * Body param: An informative name for the list. Use this name in filter and rule
   * expressions.
   */
  name: string;

  /**
   * Body param: An informative summary of the list.
   */
  description?: string;
}

export interface ListUpdateParams {
  /**
   * Path param: Identifier
   */
  account_id: string;

  /**
   * Body param: An informative summary of the list.
   */
  description?: string;
}

export interface ListListParams {
  /**
   * Identifier
   */
  account_id: string;
}

export interface ListDeleteParams {
  /**
   * Identifier
   */
  account_id: string;
}

export interface ListGetParams {
  /**
   * Identifier
   */
  account_id: string;
}

export namespace Lists {
  export type Hostname = ListsAPI.Hostname;
  export type ListsList = ListsAPI.ListsList;
  export type Redirect = ListsAPI.Redirect;
  export type ListDeleteResponse = ListsAPI.ListDeleteResponse;
  export import ListsListsSinglePage = ListsAPI.ListsListsSinglePage;
  export type ListCreateParams = ListsAPI.ListCreateParams;
  export type ListUpdateParams = ListsAPI.ListUpdateParams;
  export type ListListParams = ListsAPI.ListListParams;
  export type ListDeleteParams = ListsAPI.ListDeleteParams;
  export type ListGetParams = ListsAPI.ListGetParams;
  export import BulkOperations = BulkOperationsAPI.BulkOperations;
  export type OperationStatus = BulkOperationsAPI.OperationStatus;
  export type BulkOperationGetResponse = BulkOperationsAPI.BulkOperationGetResponse;
  export import Items = ItemsAPI.Items;
  export type ListCursor = ItemsAPI.ListCursor;
  export type ListItem = ItemsAPI.ListItem;
  export type ItemCreateResponse = ItemsAPI.ItemCreateResponse;
  export type ItemUpdateResponse = ItemsAPI.ItemUpdateResponse;
  export type ItemListResponse = ItemsAPI.ItemListResponse;
  export type ItemDeleteResponse = ItemsAPI.ItemDeleteResponse;
  export type ItemGetResponse = ItemsAPI.ItemGetResponse;
  export import ItemListResponsesCursorPagination = ItemsAPI.ItemListResponsesCursorPagination;
  export type ItemCreateParams = ItemsAPI.ItemCreateParams;
  export type ItemUpdateParams = ItemsAPI.ItemUpdateParams;
  export type ItemListParams = ItemsAPI.ItemListParams;
  export type ItemDeleteParams = ItemsAPI.ItemDeleteParams;
}
