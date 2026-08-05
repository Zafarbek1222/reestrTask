# Reestr Task frontend

The frontend is connected to the real microservice API. It has no mock data and
never calls the broken `GET /api/user/profile` endpoint.

## Local launch

1. Start the backend stack from the repository root:

   ```powershell
   docker compose up --build
   ```

   The API gateway must be available at `http://localhost:8082`.

2. In this directory install and run the frontend:

   ```powershell
   npm.cmd install
   npm.cmd run dev
   ```

3. Open `http://localhost:5173`.

Vite proxies all `/api/*` calls to the gateway, so local development does not
need cross-origin browser configuration. Authentication uses HttpOnly cookies;
the frontend always sends `credentials: 'include'` and does not store tokens.

## Deployment configuration

When the frontend is not served through the Vite proxy, set the public gateway
URL before building:

```env
VITE_API_BASE_URL=https://api.example.uz
```

The gateway must allow the deployed frontend origin with CORS and credentials.

## Backend login

The backend seeds this development account on first startup:

- Email: `admin@reestr.uz`
- Password: `admin123`

Change or remove these credentials before production use.
