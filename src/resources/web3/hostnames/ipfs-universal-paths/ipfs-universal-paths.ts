// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../../resource';
import * as ContentListsAPI from './content-lists/content-lists';

export class IPFSUniversalPaths extends APIResource {
  contentLists: ContentListsAPI.ContentLists = new ContentListsAPI.ContentLists(this._client);
}

export namespace IPFSUniversalPaths {
  export import ContentLists = ContentListsAPI.ContentLists;
  export type ContentList = ContentListsAPI.ContentList;
  export type ContentListUpdateParams = ContentListsAPI.ContentListUpdateParams;
  export type ContentListGetParams = ContentListsAPI.ContentListGetParams;
}
