import { cookies } from 'next/headers';
import { getAndSetAccessToken } from '@/lib/spotify';

export async function GET(request: Request) {
  const params = new URLSearchParams(request.url.split('?')[1]);
  console.log(params);
  if (params.get('error')) {
    // throw error
  }
  const state = params.get('state');
  const code = params.get('code');
  const cookieStore = await cookies();
  const cookieState: string | undefined = cookieStore.get('AUTH_STATE');
  if (!state || state !== cookieState) {
    // error
  }

  await getAndSetAccessToken({ code });
}
