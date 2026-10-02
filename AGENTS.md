# Tutenramen Brand Guidelines

React + Vite + Tailwind CSS brand guide with Modern Egyptian and Chibi Anime art styles.

## Project structure

- `src/main.tsx`: application entrypoint.
- `src/App.tsx`: brand guide sections and art-style switch.
- `src/ScrollMural.tsx`: scroll-driven mural animation.
- `src/index.css`: typography, colors, layout, and responsive styles.
- `public/media/`: local photography and artwork.
- `index.html`: document metadata and application shell.
- `vite.config.ts`: build settings and source alias.
- `.github/workflows/deploy.yml`: deployment.

## Development

Use `pnpm dev` for development, `pnpm build` for a production build, and `pnpm preview` to inspect it. The development port defaults to 8443 and can be set with `PORT`. `PUBLIC_BASE_PATH` sets the deployment subdirectory.

## Styling and quality

Use Tailwind utilities and global styles in `src/index.css`. Keep imports first. Preserve each art style's assets and the supplied media. Ensure JSX tags and braces are balanced, and use double quotes for strings containing apostrophes.
