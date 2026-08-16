'use server';

import crypto from 'node:crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import {
  accessTokenKey,
  clientId,
  key,
  redirectUri,
  refreshTokenKey,
  scope,
  token,
  tokenEndpoint,
} from './constants';

const generateRandomString = (length: number) => {
  return crypto.randomBytes(60).toString('hex').slice(0, length);
};

export async function authenticate() {
  const cookieStore = await cookies();

  const state = generateRandomString(16);
  cookieStore.set(key, state);

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    scope: scope,
    redirect_uri: redirectUri,
    state: state,
  }).toString();

  redirect(`https://accounts.spotify.com/authorize?${params}`);
}

export const getAndSetAccessToken = async ({ code }: { code: string }) => {
  const resp = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${token}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `grant_type=authorization_code&code=${code}&redirect_uri=${redirectUri}`,
  });

  if (!resp.ok) {
    // handle error
  }
  const response = (await resp.json()) as {
    access_token: string;
    refresh_token: string;
    expires_in: string;
  };

  const { access_token, refresh_token, expires_in: _expires_in } = response;

  const cookieStore = await cookies();
  cookieStore.set(accessTokenKey, access_token, {
    httpOnly: true,
    domain: process.env.URI,
  });
  cookieStore.set(refreshTokenKey, refresh_token, {
    httpOnly: true,
    domain: process.env.URI,
  });

  redirect('/');
};

export const logout = async () => {
  const cookieStore = await cookies();
  cookieStore.delete(refreshTokenKey);
  cookieStore.delete(accessTokenKey);
  redirect('/');
};
