import { cookies } from 'next/headers';
import React from 'react';
import DashboardProvider from '@/context/DashboardContext';
import DashboardLayout from '@/layouts/Dashboard';
import { accessTokenKey } from '@/lib/constants';

// middleware handles login page redirect
async function Page() {
  const appCookies = await cookies();
  const accessToken = appCookies.get(accessTokenKey);
  return (
    <DashboardProvider cookies={{ accessToken }}>
      <DashboardLayout />
    </DashboardProvider>
  );
}

export default Page;
