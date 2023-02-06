import React from 'react';
import { Outlet } from 'react-router-dom';

import ResponsiveAppBar from './ResponsiveAppBar';

export function AppLayout() {
  return (
    <>
      <ResponsiveAppBar />
      <Outlet />
    </>
  );
}
