# UnaHur Anti-Social Net

Frontend de una red social hecha para el TP de *Construcción de Interfaces de Usuario* (UNAHUR). Se puede registrarse e iniciar sesión, ver el feed de publicaciones, entrar al detalle de cada una y comentar, crear publicaciones con etiquetas e imágenes, y ver el perfil propio.

Está hecho con:
- React 19
- TypeScript
- Vite
- React Router
- Bootstrap 5 y React-Bootstrap
- Context API de React (manejo de la sesión) y `localStorage`
- `fetch` para consumir la API REST de la cátedra

## Cómo correrlo en local

**1. Levantar la API de la cátedra** (carpeta `backend-api`):

```bash
npm install (instala las dependencias, necesita Node)
node seed.js
npm start
```

Queda corriendo en `http://localhost:3001`.

**2. Levantar el frontend** (en la carpeta de nuestro TP):

```bash
git clone https://github.com/jm-palacios/trabajo-practico-Anti-Social-Net-en-react-grupo7.git
cd trabajo-practico-Anti-Social-Net-en-react-grupo7
npm install
npm run dev
```

La app se abre en `http://localhost:5173`.

## URL de la API

`http://localhost:3001` (se configura en `src/services/api.ts`).

## Para probarlo

Al correr `node seed.js` se crean los usuarios `luna` y `sol`. Para entrar se usa el nickName y la contraseña `123456`. También se puede crear un usuario nuevo desde `/register`.

## Integrantes

- Franco Nebuloni
- Victor Marquina
- Juan Manuel Palacios
- Miguel Ignacio Sanchez
- Mariana Alpern