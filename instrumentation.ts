// Next.js instrumentation hook: runs once when the server process starts,
// before any request is handled. This is the recommended place to run
// startup side effects like database initialization.
// https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { getDb } = await import('./lib/db');
    getDb();
  }
}
