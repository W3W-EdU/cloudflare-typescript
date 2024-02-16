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

describe('resource verifications', () => {
  // skipped: tests are disabled for the time being
  test.skip('update: only required params', async () => {
    const responsePromise = cloudflare.ssls.verifications.update(
      '023e105f4ecef8ad9ca31a8372d0c353',
      'a77f8bd7-3b47-46b4-a6f1-75cf98109948',
      { validation_method: 'txt' },
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
    const response = await cloudflare.ssls.verifications.update(
      '023e105f4ecef8ad9ca31a8372d0c353',
      'a77f8bd7-3b47-46b4-a6f1-75cf98109948',
      { validation_method: 'txt' },
    );
  });

  // skipped: tests are disabled for the time being
  test.skip('sslVerificationSSLVerificationDetails', async () => {
    const responsePromise = cloudflare.ssls.verifications.sslVerificationSSLVerificationDetails(
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
  test.skip('sslVerificationSSLVerificationDetails: request options instead of params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      cloudflare.ssls.verifications.sslVerificationSSLVerificationDetails(
        '023e105f4ecef8ad9ca31a8372d0c353',
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(Cloudflare.NotFoundError);
  });

  // skipped: tests are disabled for the time being
  test.skip('sslVerificationSSLVerificationDetails: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      cloudflare.ssls.verifications.sslVerificationSSLVerificationDetails(
        '023e105f4ecef8ad9ca31a8372d0c353',
        { retry: true },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(Cloudflare.NotFoundError);
  });
});
