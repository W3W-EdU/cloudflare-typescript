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

describe('resource fallbackDomains', () => {
  // skipped: tests are disabled for the time being
  test.skip('devicesGetLocalDomainFallbackList', async () => {
    const responsePromise = cloudflare.devices.policies.fallbackDomains.devicesGetLocalDomainFallbackList(
      '699d98642c564d2e855e9661899b7252',
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
  test.skip('devicesGetLocalDomainFallbackList: request options instead of params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      cloudflare.devices.policies.fallbackDomains.devicesGetLocalDomainFallbackList(
        '699d98642c564d2e855e9661899b7252',
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(Cloudflare.NotFoundError);
  });

  // skipped: tests are disabled for the time being
  test.skip('devicesGetLocalDomainFallbackListForADeviceSettingsPolicy', async () => {
    const responsePromise =
      cloudflare.devices.policies.fallbackDomains.devicesGetLocalDomainFallbackListForADeviceSettingsPolicy(
        '699d98642c564d2e855e9661899b7252',
        'f174e90a-fafe-4643-bbbc-4a0ed4fc8415',
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
  test.skip('devicesGetLocalDomainFallbackListForADeviceSettingsPolicy: request options instead of params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      cloudflare.devices.policies.fallbackDomains.devicesGetLocalDomainFallbackListForADeviceSettingsPolicy(
        '699d98642c564d2e855e9661899b7252',
        'f174e90a-fafe-4643-bbbc-4a0ed4fc8415',
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(Cloudflare.NotFoundError);
  });

  // skipped: tests are disabled for the time being
  test.skip('devicesSetLocalDomainFallbackList: only required params', async () => {
    const responsePromise = cloudflare.devices.policies.fallbackDomains.devicesSetLocalDomainFallbackList(
      '699d98642c564d2e855e9661899b7252',
      [{ suffix: 'example.com' }, { suffix: 'example.com' }, { suffix: 'example.com' }],
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
  test.skip('devicesSetLocalDomainFallbackList: required and optional params', async () => {
    const response = await cloudflare.devices.policies.fallbackDomains.devicesSetLocalDomainFallbackList(
      '699d98642c564d2e855e9661899b7252',
      [
        {
          description: 'Domain bypass for local development',
          dns_server: [{}, {}, {}],
          suffix: 'example.com',
        },
        {
          description: 'Domain bypass for local development',
          dns_server: [{}, {}, {}],
          suffix: 'example.com',
        },
        {
          description: 'Domain bypass for local development',
          dns_server: [{}, {}, {}],
          suffix: 'example.com',
        },
      ],
    );
  });

  // skipped: tests are disabled for the time being
  test.skip('devicesSetLocalDomainFallbackListForADeviceSettingsPolicy: only required params', async () => {
    const responsePromise =
      cloudflare.devices.policies.fallbackDomains.devicesSetLocalDomainFallbackListForADeviceSettingsPolicy(
        '699d98642c564d2e855e9661899b7252',
        'f174e90a-fafe-4643-bbbc-4a0ed4fc8415',
        [{ suffix: 'example.com' }, { suffix: 'example.com' }, { suffix: 'example.com' }],
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
  test.skip('devicesSetLocalDomainFallbackListForADeviceSettingsPolicy: required and optional params', async () => {
    const response =
      await cloudflare.devices.policies.fallbackDomains.devicesSetLocalDomainFallbackListForADeviceSettingsPolicy(
        '699d98642c564d2e855e9661899b7252',
        'f174e90a-fafe-4643-bbbc-4a0ed4fc8415',
        [
          {
            description: 'Domain bypass for local development',
            dns_server: [{}, {}, {}],
            suffix: 'example.com',
          },
          {
            description: 'Domain bypass for local development',
            dns_server: [{}, {}, {}],
            suffix: 'example.com',
          },
          {
            description: 'Domain bypass for local development',
            dns_server: [{}, {}, {}],
            suffix: 'example.com',
          },
        ],
      );
  });
});
