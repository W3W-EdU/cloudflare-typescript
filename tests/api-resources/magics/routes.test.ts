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

describe('resource routes', () => {
  // skipped: tests are disabled for the time being
  test.skip('update: only required params', async () => {
    const responsePromise = cloudflare.magics.routes.update(
      '023e105f4ecef8ad9ca31a8372d0c353',
      '023e105f4ecef8ad9ca31a8372d0c353',
      { nexthop: '203.0.113.1', prefix: '192.0.2.0/24', priority: 0 },
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
  test.skip('update: required and optional params', async () => {
    const response = await cloudflare.magics.routes.update(
      '023e105f4ecef8ad9ca31a8372d0c353',
      '023e105f4ecef8ad9ca31a8372d0c353',
      {
        nexthop: '203.0.113.1',
        prefix: '192.0.2.0/24',
        priority: 0,
        description: 'New route for new prefix 203.0.113.1',
        scope: { colo_names: ['den01', 'den01', 'den01'], colo_regions: ['APAC', 'APAC', 'APAC'] },
        weight: 0,
      },
    );
  });

  // skipped: tests are disabled for the time being
  test.skip('delete', async () => {
    const responsePromise = cloudflare.magics.routes.delete(
      '023e105f4ecef8ad9ca31a8372d0c353',
      '023e105f4ecef8ad9ca31a8372d0c353',
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
  test.skip('get', async () => {
    const responsePromise = cloudflare.magics.routes.get(
      '023e105f4ecef8ad9ca31a8372d0c353',
      '023e105f4ecef8ad9ca31a8372d0c353',
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
  test.skip('get: request options instead of params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      cloudflare.magics.routes.get('023e105f4ecef8ad9ca31a8372d0c353', '023e105f4ecef8ad9ca31a8372d0c353', {
        path: '/_stainless_unknown_path',
      }),
    ).rejects.toThrow(Cloudflare.NotFoundError);
  });

  // skipped: tests are disabled for the time being
  test.skip('magicStaticRoutesCreateRoutes: only required params', async () => {
    const responsePromise = cloudflare.magics.routes.magicStaticRoutesCreateRoutes(
      '023e105f4ecef8ad9ca31a8372d0c353',
      {},
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
  test.skip('magicStaticRoutesCreateRoutes: required and optional params', async () => {
    const response = await cloudflare.magics.routes.magicStaticRoutesCreateRoutes(
      '023e105f4ecef8ad9ca31a8372d0c353',
      {},
    );
  });

  // skipped: tests are disabled for the time being
  test.skip('magicStaticRoutesListRoutes', async () => {
    const responsePromise = cloudflare.magics.routes.magicStaticRoutesListRoutes(
      '023e105f4ecef8ad9ca31a8372d0c353',
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
  test.skip('magicStaticRoutesListRoutes: request options instead of params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      cloudflare.magics.routes.magicStaticRoutesListRoutes('023e105f4ecef8ad9ca31a8372d0c353', {
        path: '/_stainless_unknown_path',
      }),
    ).rejects.toThrow(Cloudflare.NotFoundError);
  });

  // skipped: tests are disabled for the time being
  test.skip('magicStaticRoutesUpdateManyRoutes: only required params', async () => {
    const responsePromise = cloudflare.magics.routes.magicStaticRoutesUpdateManyRoutes(
      '023e105f4ecef8ad9ca31a8372d0c353',
      {
        routes: [
          { nexthop: '203.0.113.1', prefix: '192.0.2.0/24', priority: 0 },
          { nexthop: '203.0.113.1', prefix: '192.0.2.0/24', priority: 0 },
          { nexthop: '203.0.113.1', prefix: '192.0.2.0/24', priority: 0 },
        ],
      },
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
  test.skip('magicStaticRoutesUpdateManyRoutes: required and optional params', async () => {
    const response = await cloudflare.magics.routes.magicStaticRoutesUpdateManyRoutes(
      '023e105f4ecef8ad9ca31a8372d0c353',
      {
        routes: [
          {
            description: 'New route for new prefix 203.0.113.1',
            nexthop: '203.0.113.1',
            prefix: '192.0.2.0/24',
            priority: 0,
            scope: { colo_names: ['den01', 'den01', 'den01'], colo_regions: ['APAC', 'APAC', 'APAC'] },
            weight: 0,
          },
          {
            description: 'New route for new prefix 203.0.113.1',
            nexthop: '203.0.113.1',
            prefix: '192.0.2.0/24',
            priority: 0,
            scope: { colo_names: ['den01', 'den01', 'den01'], colo_regions: ['APAC', 'APAC', 'APAC'] },
            weight: 0,
          },
          {
            description: 'New route for new prefix 203.0.113.1',
            nexthop: '203.0.113.1',
            prefix: '192.0.2.0/24',
            priority: 0,
            scope: { colo_names: ['den01', 'den01', 'den01'], colo_regions: ['APAC', 'APAC', 'APAC'] },
            weight: 0,
          },
        ],
      },
    );
  });
});
