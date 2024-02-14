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

describe('resource httpTests', () => {
  // skipped: tests are disabled for the time being
  test.skip('retrieve: only required params', async () => {
    const responsePromise = cloudflare.dex.httpTests.retrieve(
      '01a7362d577a6c3019a474fd6f485823',
      'f174e90a-fafe-4643-bbbc-4a0ed4fc8415',
      { interval: 'minute', timeEnd: '1689606812000', timeStart: '1689520412000' },
    );
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // skipped: tests are disabled for the time being
  test.skip('retrieve: required and optional params', async () => {
    const response = await cloudflare.dex.httpTests.retrieve(
      '01a7362d577a6c3019a474fd6f485823',
      'f174e90a-fafe-4643-bbbc-4a0ed4fc8415',
      {
        interval: 'minute',
        timeEnd: '1689606812000',
        timeStart: '1689520412000',
        colo: 'string',
        deviceId: ['string', 'string', 'string'],
      },
    );
  });
});
