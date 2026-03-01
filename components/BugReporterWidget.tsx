'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';

// ─── Types ────────────────────────────────────────────────────────────────────

type RecordedEvent = { t: string; desc: string };
type SelectionType = 'critical' | 'high' | 'medium' | 'feature';

interface BugReporterWidgetProps {
  /** Base URL of the A3 instance, e.g. "https://a3.montebay.io". Defaults to same-origin. */
  apiUrl?: string;
  /** Repository ID to file bugs against, e.g. "org/repo". */
  repoId?: string;
}

// ─── Priority config ──────────────────────────────────────────────────────────

const TYPES: {
  value: SelectionType;
  icon: string;
  label: string;
  sub: string;
  color: string;
  bg: string;
  border: string;
}[] = [
  { value: 'critical', icon: '⚡', label: 'P0 — Critical',  sub: 'System down',      color: '#dc2626', bg: 'rgba(220,38,38,0.07)',  border: '#dc2626' },
  { value: 'high',     icon: '🔥', label: 'P1 — High',      sub: 'Feature broken',   color: '#ea580c', bg: 'rgba(234,88,12,0.07)',  border: '#ea580c' },
  { value: 'medium',   icon: '🔧', label: 'P2 — Normal',    sub: 'Minor issue',      color: '#d97706', bg: 'rgba(217,119,6,0.07)',  border: '#d97706' },
  { value: 'feature',  icon: '✨', label: 'Feature Request', sub: 'Enhancement idea', color: '#0d9488', bg: 'rgba(13,148,136,0.07)', border: '#0d9488' },
];

const MAX_BUFFER = 30;

function formatBuffer(events: RecordedEvent[]): string {
  return events.map((e, i) => `${i + 1}. [${e.t}] ${e.desc}`).join('\n');
}

// ─── SVG icons ────────────────────────────────────────────────────────────────

function IconChat() {
  return (
    <svg width="21" height="21" viewBox="0 0 21 21" fill="none" aria-hidden="true">
      <path d="M19 2H2C1.45 2 1 2.45 1 3v13l3.5-3.5H19c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1z"
        stroke="white" strokeWidth="1.6" strokeLinejoin="round"/>
      <circle cx="6.5" cy="9.5" r="1.1" fill="white"/>
      <circle cx="10.5" cy="9.5" r="1.1" fill="white"/>
      <circle cx="14.5" cy="9.5" r="1.1" fill="white"/>
    </svg>
  );
}

function IconAlert() {
  return (
    <svg width="21" height="21" viewBox="0 0 21 21" fill="none" aria-hidden="true">
      <path d="M10.5 2.5L1.5 18h18L10.5 2.5z" stroke="white" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round"/>
      <line x1="10.5" y1="9" x2="10.5" y2="13" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
      <circle cx="10.5" cy="15.5" r="0.9" fill="white"/>
    </svg>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function BugReporterWidget({ apiUrl = '', repoId }: BugReporterWidgetProps = {}) {
  const pathname = usePathname();
  const bufferRef = useRef<RecordedEvent[]>([]);
  const fetchPatched = useRef(false);

  const [authorized, setAuthorized] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [open, setOpen] = useState(false);
  const [stepsExpanded, setStepsExpanded] = useState(false);

  // On mount: check URL param (one-time token from A3) then localStorage.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('a3token');
    if (urlToken) {
      localStorage.setItem('a3-widget-token', urlToken);
      params.delete('a3token');
      const newUrl = window.location.pathname +
        (params.toString() ? '?' + params.toString() : '') +
        window.location.hash;
      window.history.replaceState({}, '', newUrl);
      setAuthorized(true);
      return;
    }
    if (localStorage.getItem('a3-widget-token')) setAuthorized(true);
  }, []);

  // Form state
  const [selection, setSelection] = useState<SelectionType>('high');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [steps, setSteps] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [runId, setRunId] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // ── Event recorder ──────────────────────────────────────────────────────────

  const push = useCallback((desc: string) => {
    const t = new Date().toTimeString().slice(0, 8);
    bufferRef.current = [...bufferRef.current.slice(-(MAX_BUFFER - 1)), { t, desc }];
  }, []);

  useEffect(() => { push(`Navigated to: ${pathname}`); }, [pathname, push]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest('[data-bug-reporter]')) return;
      const label = el.getAttribute('aria-label') || el.textContent?.trim().slice(0, 80) || el.tagName.toLowerCase();
      push(`Clicked: ${label}`);
    };
    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [push]);

  useEffect(() => {
    if (fetchPatched.current) return;
    fetchPatched.current = true;
    const origFetch = window.fetch.bind(window);
    window.fetch = async function (...args: Parameters<typeof fetch>) {
      const url = typeof args[0] === 'string' ? args[0] : (args[0] as Request).url || '';
      if (url.endsWith('/api/runs')) return origFetch(...args);
      try {
        const res = await origFetch(...args);
        if (!res.ok) {
          const short = url.split('?')[0].replace(window.location.origin, '');
          push(`HTTP ${res.status} ${short}`);
          if (res.status >= 400) setHasError(true);
        }
        return res;
      } catch (err) {
        const short = url.split('?')[0].replace(window.location.origin, '');
        push(`Network error: ${short}`);
        setHasError(true);
        throw err;
      }
    };
    return () => { window.fetch = origFetch; fetchPatched.current = false; };
  }, [push]);

  useEffect(() => {
    const orig = console.error.bind(console);
    console.error = (...args: unknown[]) => {
      const msg = String(args[0] ?? '').slice(0, 120);
      if (msg && !msg.startsWith('Warning:')) { push(`console.error: ${msg}`); setHasError(true); }
      orig(...args);
    };
    return () => { console.error = orig; };
  }, [push]);

  useEffect(() => {
    const handleError = (e: ErrorEvent) => {
      push(`JS Error: ${e.message} (${e.filename?.split('/').pop() ?? ''}:${e.lineno})`);
      setHasError(true);
    };
    const handleRejection = (e: PromiseRejectionEvent) => {
      push(`Unhandled rejection: ${String(e.reason).slice(0, 100)}`);
      setHasError(true);
    };
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);
    return () => { window.removeEventListener('error', handleError); window.removeEventListener('unhandledrejection', handleRejection); };
  }, [push]);

  // ── Modal open / close ───────────────────────────────────────────────────────

  const openModal = () => {
    setSelection(hasError ? 'high' : 'feature');
    setTitle('');
    setDescription('');
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const header = url ? `Reported from: ${url}\n\n` : '';
    const recorded = formatBuffer(bufferRef.current);
    setSteps(recorded ? `${header}${recorded}` : `${header}No steps recorded yet.`);
    setAdditionalInfo('');
    setFormError('');
    setRunId('');
    setSubmitting(false);
    setStepsExpanded(false);
    setOpen(true);
  };

  const closeModal = () => { setOpen(false); setRunId(''); };

  // ── Submit ──────────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { setFormError('Title is required.'); return; }
    if (!description.trim()) { setFormError('Description is required.'); return; }
    setSubmitting(true);
    setFormError('');

    const isFeature = selection === 'feature';
    const combinedDescription = [
      description.trim(),
      steps.trim() ? `\n\nRecorded steps:\n${steps.trim()}` : '',
      additionalInfo.trim() ? `\n\nAdditional notes:\n${additionalInfo.trim()}` : '',
    ].join('');

    const body = isFeature
      ? { type: 'feature', title: title.trim(), description: combinedDescription, ...(repoId && { repoId }) }
      : {
          type: 'bug',
          title: title.trim(),
          actual: description.trim(),
          expected: 'The feature should work as expected without errors.',
          stepsToRepro: steps.trim() || 'See description.',
          uatVerification: 'Developer to verify the reported behavior is resolved.',
          priority: selection,
          logs: additionalInfo.trim() || undefined,
          ...(repoId && { repoId }),
        };

    try {
      const res = await fetch(`${apiUrl}/api/runs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) { setFormError(data.error || 'Submission failed. Please try again.'); setSubmitting(false); return; }
      setRunId(data.runId);
      if (!isFeature) setHasError(false);
    } catch {
      setFormError('Network error. Please try again.');
      setSubmitting(false);
    }
  };

  // ── Shared input styles ──────────────────────────────────────────────────────

  const selectedType = TYPES.find((t) => t.value === selection)!;

  const inputBase: React.CSSProperties = {
    width: '100%',
    padding: '10px 13px',
    border: '1.5px solid',
    borderRadius: '8px',
    fontSize: '14px',
    lineHeight: '1.5',
    background: '#fff',
    color: '#0f172a',
    boxSizing: 'border-box',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
    resize: 'vertical',
    outline: 'none',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  };

  const getInputStyle = (fieldName: string): React.CSSProperties => ({
    ...inputBase,
    borderColor: focusedField === fieldName ? '#0d9488' : '#e2e8f0',
    boxShadow: focusedField === fieldName ? '0 0 0 3px rgba(13,148,136,0.12)' : 'none',
  });

  // ── Render ──────────────────────────────────────────────────────────────────

  if (!authorized) return null;

  return (
    <>
      {/* ── Animations ── */}
      <style>{`
        @keyframes a3-pulse-ring {
          0%,100% { box-shadow: 0 0 0 0 rgba(220,38,38,0.45), 0 4px 14px rgba(220,38,38,0.35); }
          55% { box-shadow: 0 0 0 9px rgba(220,38,38,0), 0 4px 14px rgba(220,38,38,0.35); }
        }
        @keyframes a3-modal-in {
          from { opacity: 0; transform: scale(0.96) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes a3-backdrop-in {
          from { opacity: 0; } to { opacity: 1; }
        }
        @keyframes a3-success-in {
          from { opacity: 0; transform: scale(0.9); }
          to   { opacity: 1; transform: scale(1); }
        }
        [data-a3-fab]:hover { transform: scale(1.07) !important; }
        [data-a3-fab] { transition: transform 0.18s ease, background 0.18s ease !important; }
      `}</style>

      {/* ── Floating Action Button ── */}
      <button
        data-bug-reporter="trigger"
        data-a3-fab
        onClick={openModal}
        title={hasError ? 'Error detected — click to report' : 'Report a bug or request a feature'}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9998,
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          background: hasError ? '#dc2626' : '#1e293b',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: hasError ? 'a3-pulse-ring 1.6s ease-in-out infinite' : undefined,
          boxShadow: hasError ? undefined : '0 4px 14px rgba(0,0,0,0.28)',
        }}
        aria-label={hasError ? 'Error detected — report bug' : 'Open feedback widget'}
      >
        {hasError ? <IconAlert /> : <IconChat />}
      </button>

      {/* ── Modal ── */}
      {open && (
        <div
          data-bug-reporter="backdrop"
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(15,23,42,0.62)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            animation: 'a3-backdrop-in 0.18s ease',
          }}
        >
          <div
            data-bug-reporter="modal"
            style={{
              background: '#fff',
              borderRadius: '16px',
              boxShadow: '0 24px 64px rgba(0,0,0,0.28), 0 0 0 1px rgba(0,0,0,0.04)',
              width: '100%',
              maxWidth: '540px',
              maxHeight: '90vh',
              overflowY: 'auto',
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
              animation: 'a3-modal-in 0.2s cubic-bezier(0.16,1,0.3,1)',
            }}
          >
            {/* ── Header ── */}
            <div style={{
              padding: '22px 24px 20px',
              borderBottom: '1px solid #f1f5f9',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '12px',
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                  <span style={{
                    fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em',
                    textTransform: 'uppercase', color: '#0d9488',
                    background: 'rgba(13,148,136,0.1)', padding: '2px 8px',
                    borderRadius: '4px',
                  }}>A³</span>
                  {hasError && (
                    <span style={{ fontSize: '12px', color: '#dc2626', fontWeight: 600 }}>
                      · Error detected
                    </span>
                  )}
                </div>
                <h2 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: '#0f172a', lineHeight: 1.3 }}>
                  {hasError ? 'Report a bug' : 'Report a bug or request a feature'}
                </h2>
                {hasError && (
                  <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#64748b', lineHeight: 1.4 }}>
                    An error was recorded. Your interaction steps have been attached automatically.
                  </p>
                )}
              </div>
              <button
                onClick={closeModal}
                aria-label="Close"
                style={{
                  flexShrink: 0,
                  width: '32px', height: '32px',
                  background: '#f1f5f9', border: 'none', borderRadius: '8px',
                  cursor: 'pointer', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', color: '#64748b',
                  fontSize: '18px', fontWeight: 400, lineHeight: 1,
                }}
              >×</button>
            </div>

            {runId ? (
              /* ── Success state ── */
              <div style={{ padding: '40px 24px', textAlign: 'center', animation: 'a3-success-in 0.25s ease' }}>
                <div style={{
                  width: '60px', height: '60px', borderRadius: '50%',
                  background: 'rgba(13,148,136,0.1)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px',
                }}>
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <path d="M5 14l6 6L23 8" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p style={{ margin: '0 0 6px', fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>
                  {selection === 'feature' ? 'Feature request submitted!' : 'Bug report submitted!'}
                </p>
                <p style={{ margin: '0 0 28px', fontSize: '14px', color: '#64748b', lineHeight: 1.5 }}>
                  A³ is processing your {selection === 'feature' ? 'request' : 'report'} and will generate a fix.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                  <a
                    href={`${apiUrl}/runs/${runId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      background: '#0d9488', color: '#fff', textDecoration: 'none',
                      padding: '10px 20px', borderRadius: '8px', fontWeight: 600,
                      fontSize: '14px',
                    }}
                  >
                    View in A³ →
                  </a>
                  <button
                    onClick={closeModal}
                    style={{
                      background: 'none', border: '1.5px solid #e2e8f0', borderRadius: '8px',
                      padding: '10px 18px', cursor: 'pointer', fontSize: '14px', color: '#64748b',
                      fontFamily: 'inherit',
                    }}
                  >Done</button>
                </div>
              </div>
            ) : (
              /* ── Form ── */
              <form onSubmit={handleSubmit}>
                <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>

                  {/* Type selector */}
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '10px' }}>
                      Type
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      {TYPES.filter((t) => !(hasError && t.value === 'feature')).map((t) => {
                        const active = selection === t.value;
                        return (
                          <button
                            key={t.value}
                            type="button"
                            onClick={() => setSelection(t.value)}
                            style={{
                              padding: '11px 13px',
                              border: `1.5px solid ${active ? t.border : '#e2e8f0'}`,
                              borderRadius: '10px',
                              background: active ? t.bg : '#fafafa',
                              cursor: 'pointer',
                              textAlign: 'left',
                              boxShadow: active ? `0 0 0 3px ${t.bg}` : 'none',
                              transition: 'all 0.15s',
                              fontFamily: 'inherit',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '2px' }}>
                              <span style={{ fontSize: '14px', lineHeight: 1 }}>{t.icon}</span>
                              <span style={{ fontSize: '12px', fontWeight: 700, color: active ? t.color : '#334155' }}>
                                {t.label}
                              </span>
                            </div>
                            <div style={{ fontSize: '12px', fontWeight: 500, color: active ? t.color : '#64748b', marginLeft: '21px', opacity: active ? 0.85 : 1 }}>
                              {t.sub}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '7px' }}>
                      Title <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={200}
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      onFocus={() => setFocusedField('title')}
                      onBlur={() => setFocusedField(null)}
                      placeholder={selection === 'feature' ? 'What would you like improved?' : 'Brief description of the issue'}
                      style={{ ...getInputStyle('title'), resize: undefined }}
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '7px' }}>
                      {selection === 'feature' ? 'What should happen?' : 'What went wrong?'}{' '}
                      <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <textarea
                      required
                      maxLength={2000}
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      onFocus={() => setFocusedField('description')}
                      onBlur={() => setFocusedField(null)}
                      placeholder={
                        selection === 'feature'
                          ? 'Describe the behavior or capability you would like to see…'
                          : 'Describe what happened, what you saw, or what failed…'
                      }
                      style={getInputStyle('description')}
                    />
                  </div>

                  {/* Recorded steps — collapsible */}
                  <div style={{ border: '1.5px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
                    <button
                      type="button"
                      onClick={() => setStepsExpanded(!stepsExpanded)}
                      style={{
                        width: '100%', padding: '11px 14px',
                        background: '#f8fafc', border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        fontFamily: 'inherit',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '13px' }}>📋</span>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>Recorded steps</span>
                        <span style={{
                          fontSize: '11px', fontWeight: 600,
                          background: 'rgba(13,148,136,0.1)', color: '#0d9488',
                          padding: '1px 7px', borderRadius: '999px',
                        }}>
                          {bufferRef.current.length} events
                        </span>
                      </div>
                      <svg
                        width="14" height="14" viewBox="0 0 14 14" fill="none"
                        style={{ transform: stepsExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}
                      >
                        <path d="M2 4.5l5 5 5-5" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    {stepsExpanded && (
                      <div style={{ padding: '12px 14px', borderTop: '1px solid #f1f5f9' }}>
                        <textarea
                          rows={6}
                          maxLength={5000}
                          value={steps}
                          onChange={(e) => setSteps(e.target.value)}
                          onFocus={() => setFocusedField('steps')}
                          onBlur={() => setFocusedField(null)}
                          style={{ ...getInputStyle('steps'), fontFamily: '"SF Mono", "Fira Code", monospace', fontSize: '12px', color: '#475569', lineHeight: 1.6 }}
                        />
                        <p style={{ margin: '6px 0 0', fontSize: '11px', color: '#94a3b8', lineHeight: 1.4 }}>
                          {selection === 'feature'
                            ? `Last ${MAX_BUFFER} interactions attached — helps A³ understand workflow context when building the feature.`
                            : `Last ${MAX_BUFFER} interactions (clicks, navigation, errors, API calls) captured automatically. Editable.`}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Additional info */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '7px' }}>
                      Additional info{' '}
                      <span style={{ fontSize: '11px', fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: '#94a3b8' }}>optional</span>
                    </label>
                    <textarea
                      rows={2}
                      maxLength={5000}
                      value={additionalInfo}
                      onChange={(e) => setAdditionalInfo(e.target.value)}
                      onFocus={() => setFocusedField('additional')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Console output, URLs, user IDs, or anything else helpful…"
                      style={getInputStyle('additional')}
                    />
                  </div>

                  {formError && (
                    <div style={{
                      padding: '11px 14px',
                      background: 'rgba(239,68,68,0.06)',
                      border: '1px solid rgba(239,68,68,0.2)',
                      borderRadius: '8px',
                      color: '#dc2626',
                      fontSize: '13px',
                      lineHeight: 1.4,
                    }}>
                      {formError}
                    </div>
                  )}
                </div>

                {/* ── Footer ── */}
                <div style={{
                  padding: '14px 24px 20px',
                  borderTop: '1px solid #f1f5f9',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '10px',
                }}>
                  <span style={{
                    fontSize: '12px', fontWeight: 700,
                    color: selectedType.color,
                    background: selectedType.bg,
                    padding: '4px 10px', borderRadius: '6px',
                    whiteSpace: 'nowrap',
                  }}>
                    {selectedType.icon} {selectedType.label}
                  </span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={closeModal}
                      style={{
                        background: 'none', border: '1.5px solid #e2e8f0', borderRadius: '8px',
                        padding: '9px 16px', cursor: 'pointer', fontSize: '14px',
                        color: '#64748b', fontFamily: 'inherit',
                      }}
                    >Cancel</button>
                    <button
                      type="submit"
                      disabled={submitting}
                      style={{
                        background: submitting ? '#94a3b8' : selectedType.color,
                        color: '#fff', border: 'none', borderRadius: '8px',
                        padding: '9px 20px', fontSize: '14px', fontWeight: 600,
                        cursor: submitting ? 'not-allowed' : 'pointer',
                        fontFamily: 'inherit',
                        display: 'flex', alignItems: 'center', gap: '6px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {submitting ? (
                        <>
                          <svg width="14" height="14" viewBox="0 0 14 14" style={{ animation: 'spin 0.8s linear infinite' }}>
                            <circle cx="7" cy="7" r="5.5" stroke="rgba(255,255,255,0.35)" strokeWidth="2" fill="none"/>
                            <path d="M7 1.5A5.5 5.5 0 0 1 12.5 7" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
                          </svg>
                          Submitting…
                        </>
                      ) : (
                        selection === 'feature' ? 'Submit Request' : 'Submit Report'
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
