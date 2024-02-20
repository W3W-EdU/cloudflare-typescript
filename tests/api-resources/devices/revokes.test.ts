// File generated from our OpenAPI spec by Stainless.

import Cloudflare from 'cloudflare';
import { Response } from 'node-fetch';

const cloudflare = new Cloudflare({
  apiKey: '144c9defac04969c7bfad8efaa8ea194',
  apiEmail: 'dev@cloudflare.com',
  apiToken: 'Sn3lZJTBX6kkg7OdcBUAxOO963GEIyGQqnFTOFYY',
  userServiceKey: 'My User Service Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource revokes', () => {
  // skipped: tests are disabled for the time being
  test.skip('create: only required params', async () => {
    const responsePromise = cloudflare.devices.revokes.create('699d98642c564d2e855e9661899b7252', [
      'f174e90a-fafe-4643-bbbc-4a0ed4fc8415',
      'f174e90a-fafe-4643-bbbc-4a0ed4fc8415',
      'f174e90a-fafe-4643-bbbc-4a0ed4fc8415',
    ]);
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // skipped: tests are disabled for the time being
  test.skip('create: required and optional params', async () => {
    const response = await cloudflare.devices.revokes.create('699d98642c564d2e855e9661899b7252', [
      'f174e90a-fafe-4643-bbbc-4a0ed4fc8415',
      'f174e90a-fafe-4643-bbbc-4a0ed4fc8415',
      'f174e90a-fafe-4643-bbbc-4a0ed4fc8415',
    ]);
  });
});
