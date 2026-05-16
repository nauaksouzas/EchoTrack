import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

let initialized = false;

function initOnce() {
  if (initialized) return;
  initialized = true;

  const saPath = path.join(process.cwd(), 'server', 'firebase-service-account.json');
  if (fs.existsSync(saPath)) {
    const sa = JSON.parse(fs.readFileSync(saPath, 'utf-8'));
    admin.initializeApp({ credential: admin.credential.cert(sa) });
  } else {
    // Fallback: rely on GOOGLE_APPLICATION_CREDENTIALS env if present,
    // otherwise initialize without credentials (verifyIdToken will still
    // contact Google's public certs over the network — works for token
    // verification even without a service account).
    admin.initializeApp({ projectId: 'gen-lang-client-0430377903' });
  }
}

export async function verifyIdToken(idToken: string) {
  initOnce();
  const decoded = await admin.auth().verifyIdToken(idToken);
  return {
    uid: decoded.uid,
    email: decoded.email ?? null,
    name: decoded.name ?? null,
    picture: decoded.picture ?? null,
    provider: decoded.firebase?.sign_in_provider ?? 'unknown',
  };
}
