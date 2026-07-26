/** Uygulamanın kök yolu — next.config.ts ile senkron tutulur. */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Dahili rotalar ve API istekleri için basePath önekini ekler. */
export function withBasePath(path: string): string {
  if (!path.startsWith("/")) {
    path = `/${path}`;
  }

  if (!BASE_PATH) {
    return path;
  }

  if (path === BASE_PATH || path.startsWith(`${BASE_PATH}/`)) {
    return path;
  }

  return `${BASE_PATH}${path === "/" ? "" : path}`;
}

/** Oturum çerezlerinin kapsam yolu. */
export function getCookiePath(): string {
  return BASE_PATH || "/";
}
