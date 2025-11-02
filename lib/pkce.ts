export async function sha256(input: string) {
  const data = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return new Uint8Array(hash);
}

export function b64url(bytes: Uint8Array) {
  let s = Buffer.from(bytes).toString("base64");
  return s.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export function randomString(len = 64) {
  const bytes = crypto.getRandomValues(new Uint8Array(len));
  return b64url(bytes);
}

export async function createPkce() {
  const code_verifier = randomString(64);
  const hash = await sha256(code_verifier);
  const code_challenge = b64url(hash);
  return { code_verifier, code_challenge };
}
