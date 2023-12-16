import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import { Auth0Provider } from '@auth0/auth0-react';

const domain = process.env.REACT_APP_AUTH0_DOMAIN;
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;

// const domain = 'dev-705d16ww6q8gxhn4.us.auth0.com';
// const clientId = 'm3R8sWmQIW9ytOj0kfVvd4yeK0IaFzDL';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Auth0Provider
    domain={domain}
    clientId={clientId}
    redirectUri={window.location.origin}
    audience="this is a unique identifier"
    scope="openid profile email"
  >
    <App />
  </Auth0Provider>
);
