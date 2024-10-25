// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../resource';
import * as RayIDAPI from './rayid';
import * as ControlAPI from './control/control';
import * as ReceivedAPI from './received/received';

export class Logs extends APIResource {
  control: ControlAPI.Control = new ControlAPI.Control(this._client);
  RayID: RayIDAPI.RayID = new RayIDAPI.RayID(this._client);
  received: ReceivedAPI.Received = new ReceivedAPI.Received(this._client);
}

export namespace Logs {
  export import Control = ControlAPI.Control;
  export import RayID = RayIDAPI.RayID;
  export type RayIDGetResponse = RayIDAPI.RayIDGetResponse;
  export type RayIDGetParams = RayIDAPI.RayIDGetParams;
  export import Received = ReceivedAPI.Received;
  export type ReceivedGetResponse = ReceivedAPI.ReceivedGetResponse;
  export type ReceivedGetParams = ReceivedAPI.ReceivedGetParams;
}
