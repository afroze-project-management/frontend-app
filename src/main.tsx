import { Auth0Provider } from '@auth0/auth0-react';
import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import * as React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import theme from './theme';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Auth0Provider
      domain="afrozeprojectmanagement.us.auth0.com"
      clientId="mIUsoezCpUuf9zcm7py5syzgtVvNQTvD"
      authorizationParams={{
        redirect_uri: window.location.origin,
        scope: 'openid read:project write:project update:project delete:project read:company write:company update:company delete:company ',
        audience: 'company',
      }}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </Auth0Provider>
  </React.StrictMode>,
);
