[![Deploy Docker Image to ghcr.io](https://github.com/juandjara/freetunes/actions/workflows/ghcr.yml/badge.svg)](https://github.com/juandjara/freetunes/actions/workflows/ghcr.yml)

# FreeTunes

FreeTunes is an app to listen to background music from youtub and download it as mp3 build partly on top of [Invidious](https://invidious.io/)

## Requirements
To run this project on your environment you will need one thing
- A publicly accesible [Invidious](https://invidious.io/) instance. To provide this you can use the `VITE_INVIDIOUS_URL` env var. If this environment variable is not detected the app will refuse to start.

## Running from docker image

A docker image is published to ghcr.io with every commit of this repository. You can give this project a try with a `docker run --rm` command like this:
```sh
docker run --rm -e VITE_INVIDIOUS_URL=htps://your.invidious.instance.url.here -p 3000:3000 ghcr.io/juandjara/freetunes
```

You can now access the running service on https://localhost:300

## Running from docker compose

You can run this project with docker compose:
```yaml
version: '3.5'
services:
  freetunes:
    image: ghcr.io/juandjara/freetunes
    container_name: freetunes
    environment:
      - VITE_INVIDIOUS_URL=htps://your.invidious.instance.url.here # note this variable will be used by both frontend and backend, so it must publicly accesible
    ports:
      - '3000:3000'
```

## Running locally with node
You can also run this project locally from source using `node`. To do so, follow these steps:
1. Install dependencies with `npm install` or the package manager you use (yarn, pnpm, etc)
2. Copy the file `.env.example` to a new file called `.env` and fill in the `VITE_INVIDIOUS_URL` variable there.
3. Run the command `npm run dev`. This will bring up the dev server with HMR
4. Now you can access the app on http://localhost:3000

### Tech stack
- Vite SPA
  - React 18.2
  - Typescript
  - Tailwind CSS
  - React Router 6 (for data loading too)
  - Headless UI

- Node server
  - express
  - vite-node
  - FFmpeg
  
