const BASE = process.env.EXPO_PUBLIC_BACKEND_URL;

const api = (path: string) => `${BASE}/api${path}`;

export async function fetchWorld() {
  const r = await fetch(api('/world'));
  if (!r.ok) throw new Error('world');
  return r.json();
}

export async function fetchClasses() {
  const r = await fetch(api('/classes'));
  if (!r.ok) throw new Error('classes');
  return r.json();
}

export async function verifyQuests(password: string) {
  const r = await fetch(api('/quests/verify'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  if (r.status === 401) throw new Error('bad_password');
  if (!r.ok) throw new Error('quests');
  return r.json();
}

export async function fetchJournal() {
  const r = await fetch(api('/journal'));
  if (!r.ok) throw new Error('journal');
  return r.json();
}

export async function fetchPassport() {
  const r = await fetch(api('/passport'));
  if (!r.ok) throw new Error('passport');
  return r.json();
}
