// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Cloudflare from 'cloudflare';
import { Response } from 'node-fetch';

const cloudflare = new Cloudflare({
  apiKey: '144c9defac04969c7bfad8efaa8ea194',
  apiEmail: 'user@example.com',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource liveInputs', () => {
  test('create: only required params', async () => {
    const responsePromise = cloudflare.stream.liveInputs.create({
      account_id: '023e105f4ecef8ad9ca31a8372d0c353',
    });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('create: required and optional params', async () => {
    const response = await cloudflare.stream.liveInputs.create({
      account_id: '023e105f4ecef8ad9ca31a8372d0c353',
      defaultCreator: 'string',
      deleteRecordingAfterDays: 45,
      meta: { name: 'test stream 1' },
      recording: {
        allowedOrigins: ['example.com'],
        mode: 'off',
        requireSignedURLs: false,
        timeoutSeconds: 0,
      },
    });
  });

  test('update: only required params', async () => {
    const responsePromise = cloudflare.stream.liveInputs.update('66be4bf738797e01e1fca35a7bdecdcd', {
      account_id: '023e105f4ecef8ad9ca31a8372d0c353',
    });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('update: required and optional params', async () => {
    const response = await cloudflare.stream.liveInputs.update('66be4bf738797e01e1fca35a7bdecdcd', {
      account_id: '023e105f4ecef8ad9ca31a8372d0c353',
      defaultCreator: 'string',
      deleteRecordingAfterDays: 45,
      meta: { name: 'test stream 1' },
      recording: {
        allowedOrigins: ['example.com'],
        mode: 'off',
        requireSignedURLs: false,
        timeoutSeconds: 0,
      },
    });
  });

  test('list: only required params', async () => {
    const responsePromise = cloudflare.stream.liveInputs.list({
      account_id: '023e105f4ecef8ad9ca31a8372d0c353',
    });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('list: required and optional params', async () => {
    const response = await cloudflare.stream.liveInputs.list({
      account_id: '023e105f4ecef8ad9ca31a8372d0c353',
      include_counts: true,
    });
  });

  test('delete: only required params', async () => {
    const responsePromise = cloudflare.stream.liveInputs.delete('66be4bf738797e01e1fca35a7bdecdcd', {
      account_id: '023e105f4ecef8ad9ca31a8372d0c353',
      body: {},
    });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('delete: required and optional params', async () => {
    const response = await cloudflare.stream.liveInputs.delete('66be4bf738797e01e1fca35a7bdecdcd', {
      account_id: '023e105f4ecef8ad9ca31a8372d0c353',
      body: {},
    });
  });

  test('get: only required params', async () => {
    const responsePromise = cloudflare.stream.liveInputs.get('66be4bf738797e01e1fca35a7bdecdcd', {
      account_id: '023e105f4ecef8ad9ca31a8372d0c353',
    });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('get: required and optional params', async () => {
    const response = await cloudflare.stream.liveInputs.get('66be4bf738797e01e1fca35a7bdecdcd', {
      account_id: '023e105f4ecef8ad9ca31a8372d0c353',
    });
  });
});
