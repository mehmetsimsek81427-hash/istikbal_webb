import { withBasePath } from "@/lib/base-path";

export function apiUrl(path: string): string {
  return withBasePath(path);
}

export function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  return fetch(apiUrl(path), init);
}
