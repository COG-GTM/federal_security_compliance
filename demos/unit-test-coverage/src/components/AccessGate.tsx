import { useEffect, useState } from 'react';
import { Lock } from 'lucide-react';

const ACCESS_CODE = (import.meta.env.VITE_ACCESS_CODE as string) || '1234';

export default function AccessGate({ children }: { children: React.ReactNode }) {
  const [granted, setGranted] = useState(false);
  const [code, setCode] = useState('');
  const [err, setErr] = useState('');

  useEffect(() => {
    if (sessionStorage.getItem('access-ok') === '1') {
      setGranted(true);
      return;
    }
    const url = new URL(window.location.href);
    const qp = url.searchParams.get('code');
    if (qp && qp === ACCESS_CODE) {
      sessionStorage.setItem('access-ok', '1');
      setGranted(true);
    }
  }, []);

  if (granted) return <>{children}</>;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim() === ACCESS_CODE) {
      sessionStorage.setItem('access-ok', '1');
      setGranted(true);
      setErr('');
    } else {
      setErr('Incorrect code. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#0a0a0f' }}>
      <div className="p-8 w-full max-w-md rounded-xl border" style={{ background: '#18181b', borderColor: '#27272a' }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-lg" style={{ background: 'rgba(57,105,202,0.15)' }}>
            <Lock className="w-6 h-6" style={{ color: '#3969CA' }} />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white">Pilot Demo Access</h1>
            <p className="text-sm" style={{ color: '#71717a' }}>Enter your 4-digit access code</p>
          </div>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              className="w-full rounded-lg px-4 py-3 text-center text-2xl tracking-widest focus:outline-none focus:ring-2 text-white"
              style={{ background: '#0a0a0f', borderColor: '#27272a', border: '1px solid #27272a' }}
              placeholder="••••"
              value={code}
              onChange={(e) => { setCode(e.target.value); setErr(''); }}
              autoFocus
            />
          </div>
          {err && (
            <div className="p-3 rounded-lg" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
              <p className="text-sm text-red-400">{err}</p>
            </div>
          )}
          <button
            type="submit"
            className="w-full py-3 rounded-lg font-medium text-white transition-opacity disabled:opacity-40"
            style={{ background: '#3969CA' }}
            disabled={code.length !== 4}
          >
            Continue to Demo
          </button>
        </form>
        <div className="mt-6 pt-6" style={{ borderTop: '1px solid #27272a' }}>
          <p className="text-xs text-center" style={{ color: '#71717a' }}>
            This is a password-protected pilot demonstration.
            <br />
            Contact your Cognition AI representative for access.
          </p>
        </div>
      </div>
    </div>
  );
}
