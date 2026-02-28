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
  label: string;
  sub: string;
  color: string;
  bg: string;
  border: string;
}[] = [
  { value: 'critical', label: 'P0 — Critical',       sub: 'System down',      color: '#dc2626', bg: 'rgba(220,38,38,0.07)',  border: 'rgba(220,38,38,0.3)'  },
  { value: 'high',     label: 'P1 — High',            sub: 'Feature broken',   color: '#ea580c', bg: 'rgba(234,88,12,0.07)',  border: 'rgba(234,88,12,0.3)'  },
  { value: 'medium',   label: 'P2 — Normal',          sub: 'Minor issue',      color: '#d97706', bg: 'rgba(217,119,6,0.07)',  border: 'rgba(217,119,6,0.3)'  },
  { value: 'feature',  label: 'Feature Request',      sub: 'Enhancement idea', color: '#0d9488', bg: 'rgba(13,148,136,0.07)', border: 'rgba(13,148,136,0.3)' },
];

const MAX_BUFFER = 30;

function formatBuffer(events: RecordedEvent[]): string {
  return events.map((e, i) => `${i + 1}. [${e.t}] ${e.desc}`).join('\n');
}

// ─── Component ────────────────────────────────────────────────────────────────

export function BugReporterWidget({ apiUrl = '', repoId }: BugReporterWidgetProps = {}) {
  const pathname = usePathname();
  const bufferRef = useRef<RecordedEvent[]>([]);
  const fetchPatched = useRef(false);

  // Auth visibility — only show for A3 registered users
  const [authorized, setAuthorized] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [open, setOpen] = useState(false);

  // On mount: check if the user has an active A3 session.
  // The A3 session cookie is SameSite=None so it's sent cross-origin.
  // Widget renders only for users logged into A3.
  useEffect(() => {
    fetch(`${apiUrl}/api/widget/ping`, { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => { if (data.ok) setAuthorized(true); })
      .catch(() => {});
  }, [apiUrl]);

  // Form state
  const [selection, setSelection] = useState<SelectionType>('high');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [steps, setSteps] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [runId, setRunId] = useState('');

  // ── Event recorder ──────────────────────────────────────────────────────────

  const push = useCallback((desc: string) => {
    const t = new Date().toTimeString().slice(0, 8);
    bufferRef.current = [...bufferRef.current.slice(-(MAX_BUFFER - 1)), { t, desc }];
  }, []);

  // Track navigation
  useEffect(() => {
    push(`Navigated to: ${pathname}`);
  }, [pathname, push]);

  // Track clicks (skip widget's own elements)
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest('[data-bug-reporter]')) return;
      const label =
        el.getAttribute('aria-label') ||
        el.textContent?.trim().slice(0, 80) ||
        el.tagName.toLowerCase();
      push(`Clicked: ${label}`);
    };
    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [push]);

  // Intercept fetch — detect HTTP errors from API calls
  useEffect(() => {
    if (fetchPatched.current) return;
    fetchPatched.current = true;
    const origFetch = window.fetch.bind(window);
    window.fetch = async function (...args: Parameters<typeof fetch>) {
      const url = typeof args[0] === 'string' ? args[0] : (args[0] as Request).url || '';
      // Don't intercept our own widget submission
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
    return () => {
      window.fetch = origFetch;
      fetchPatched.current = false;
    };
  }, [push]);

  // Intercept console.error
  useEffect(() => {
    const orig = console.error.bind(console);
    console.error = (...args: unknown[]) => {
      const msg = String(args[0] ?? '').slice(0, 120);
      if (msg && !msg.startsWith('Warning:')) {
        push(`console.error: ${msg}`);
        setHasError(true);
      }
      orig(...args);
    };
    return () => { console.error = orig; };
  }, [push]);

  // Catch unhandled JS errors
  useEffect(() => {
    const handleError = (e: ErrorEvent) => {
      push(`JS Error: ${e.message} (${e.filename?.split('/').pop() ?? ''}:${e.lineno})`);
      setHasError(true);
    };
    const handleUnhandledRejection = (e: PromiseRejectionEvent) => {
      push(`Unhandled rejection: ${String(e.reason).slice(0, 100)}`);
      setHasError(true);
    };
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [push]);

  // ── Modal open ──────────────────────────────────────────────────────────────

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
      ? {
          type: 'feature',
          title: title.trim(),
          description: combinedDescription,
          ...(repoId && { repoId }),
        }
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
      if (!res.ok) {
        setFormError(data.error || 'Submission failed. Please try again.');
        setSubmitting(false);
        return;
      }
      setRunId(data.runId);
      if (!isFeature) setHasError(false); // clear alert after successful bug report
    } catch {
      setFormError('Network error. Please try again.');
      setSubmitting(false);
    }
  };

  // ── Styles ──────────────────────────────────────────────────────────────────

  const selectedType = TYPES.find((t) => t.value === selection)!;

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '9px 12px',
    border: '1px solid var(--color-border, #e2e0dc)',
    borderRadius: '6px',
    fontSize: '14px',
    background: 'var(--color-bg, #faf9f7)',
    color: 'var(--color-text, #2d2a26)',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    resize: 'vertical',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--color-text, #2d2a26)',
    marginBottom: '5px',
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  // Not authorized — render nothing (widget invisible to non-A3 users)
  if (!authorized) return null;

  return (
    <>
      {/* ── Floating trigger ── */}
      <button
        data-bug-reporter="trigger"
        onClick={openModal}
        title={hasError ? 'An error was detected — click to report' : 'Send feedback or report a bug'}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9998,
          background: hasError ? '#dc2626' : '#6b7280',
          color: '#fff',
          border: 'none',
          borderRadius: '999px',
          padding: hasError ? '11px 18px' : '10px 16px',
          fontSize: hasError ? '14px' : '13px',
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: hasError
            ? '0 0 0 3px rgba(220,38,38,0.25), 0 4px 16px rgba(220,38,38,0.35)'
            : '0 2px 10px rgba(0,0,0,0.18)',
          display: 'flex',
          alignItems: 'center',
          gap: '7px',
          lineHeight: 1,
          transition: 'background 0.2s, box-shadow 0.2s',
        }}
      >
        {hasError ? (
          <>
            <span style={{ fontSize: '15px' }}>🔴</span> Report Bug
          </>
        ) : (
          <>
            <span style={{ fontSize: '15px' }}>🐛</span>
          </>
        )}
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
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            data-bug-reporter="modal"
            style={{
              background: 'var(--color-bg-elevated, #fff)',
              borderRadius: '12px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
              width: '100%',
              maxWidth: '580px',
              maxHeight: '92vh',
              overflowY: 'auto',
              padding: '28px',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>
                  {hasError ? '🔴 Error Detected' : '🐛 Send Feedback'}
                </h2>
                {hasError && (
                  <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#dc2626' }}>
                    An error was recorded. Your steps have been auto-attached.
                  </p>
                )}
              </div>
              <button
                onClick={closeModal}
                style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: 'var(--color-text-muted, #6b6660)', lineHeight: 1, padding: '2px 6px' }}
                aria-label="Close"
              >×</button>
            </div>

            {runId ? (
              /* Success */
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div style={{ fontSize: '42px', marginBottom: '12px' }}>✅</div>
                <p style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>Submitted!</p>
                <p style={{ fontSize: '14px', color: 'var(--color-text-muted, #6b6660)', marginBottom: '22px' }}>
                  Your {selection === 'feature' ? 'feature request' : 'bug report'} is being processed by A³.
                </p>
                <a
                  href={`/runs/${runId}`}
                  style={{ display: 'inline-block', background: 'var(--color-primary, #0d9488)', color: '#fff', textDecoration: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: 600, fontSize: '14px', marginRight: '10px' }}
                >
                  View run →
                </a>
                <button
                  onClick={closeModal}
                  style={{ background: 'none', border: '1px solid var(--color-border, #e2e0dc)', borderRadius: '6px', padding: '10px 16px', cursor: 'pointer', fontSize: '14px', color: 'var(--color-text-muted, #6b6660)' }}
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

                {/* Type selector */}
                <div>
                  <label style={labelStyle}>Type</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {TYPES.map((t) => (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() => setSelection(t.value)}
                        style={{
                          padding: '10px 12px',
                          border: `1.5px solid ${selection === t.value ? t.border : 'var(--color-border, #e2e0dc)'}`,
                          borderRadius: '8px',
                          background: selection === t.value ? t.bg : 'transparent',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'border 0.15s, background 0.15s',
                        }}
                      >
                        <div style={{ fontSize: '13px', fontWeight: 700, color: selection === t.value ? t.color : 'var(--color-text, #2d2a26)' }}>
                          {t.label}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--color-text-muted, #6b6660)', marginTop: '2px' }}>
                          {t.sub}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label style={labelStyle}>
                    Title <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={200}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={selection === 'feature' ? 'What would you like improved?' : 'Brief description of the issue'}
                    style={{ ...inputStyle, resize: undefined }}
                  />
                </div>

                {/* Description */}
                <div>
                  <label style={labelStyle}>
                    {selection === 'feature' ? 'What should happen?' : 'What went wrong?'}
                    <span style={{ color: '#ef4444' }}> *</span>
                  </label>
                  <textarea
                    required
                    maxLength={2000}
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={
                      selection === 'feature'
                        ? 'Describe the behavior or capability you would like to see…'
                        : 'Describe what happened, what you saw, or what failed…'
                    }
                    style={inputStyle}
                  />
                </div>

                {/* Recorded steps */}
                <div>
                  <label style={labelStyle}>
                    Recorded steps
                    <span style={{
                      marginLeft: '8px', fontSize: '11px', fontWeight: 400,
                      color: 'var(--color-text-muted, #6b6660)',
                      background: 'var(--color-bg-muted, #f0efed)',
                      padding: '2px 6px', borderRadius: '4px',
                    }}>
                      auto-captured · editable
                    </span>
                  </label>
                  <textarea
                    rows={6}
                    maxLength={5000}
                    value={steps}
                    onChange={(e) => setSteps(e.target.value)}
                    style={{ ...inputStyle, fontFamily: 'monospace', fontSize: '12px' }}
                  />
                  <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--color-text-muted, #6b6660)' }}>
                    {selection === 'feature'
                      ? `Your last ${MAX_BUFFER} interactions are attached to help A³ understand the workflow context and spec the feature accurately.`
                      : `Your last ${MAX_BUFFER} interactions (clicks, navigations, errors, API calls) were captured automatically. Current page URL is prepended.`}
                  </p>
                </div>

                {/* Additional info */}
                <div>
                  <label style={labelStyle}>
                    Additional info
                    <span style={{ fontSize: '12px', fontWeight: 400, color: 'var(--color-text-muted, #6b6660)', marginLeft: '6px' }}>optional</span>
                  </label>
                  <textarea
                    rows={2}
                    maxLength={5000}
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    placeholder="Console output, URLs, user IDs, or anything else that might help…"
                    style={inputStyle}
                  />
                </div>

                {formError && (
                  <p style={{ margin: 0, padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '6px', color: '#dc2626', fontSize: '13px' }}>
                    {formError}
                  </p>
                )}

                {/* Submit row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{
                    fontSize: '12px',
                    padding: '4px 10px', borderRadius: '6px',
                    background: selectedType.bg,
                    color: selectedType.color,
                    fontWeight: 600,
                  }}>
                    {selectedType.label}
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={closeModal}
                      style={{ background: 'none', border: '1px solid var(--color-border, #e2e0dc)', borderRadius: '6px', padding: '9px 16px', cursor: 'pointer', fontSize: '14px', color: 'var(--color-text-muted, #6b6660)' }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      style={{
                        background: submitting ? '#94a3b8' : (selection === 'feature' ? 'var(--color-primary, #0d9488)' : selectedType.color),
                        color: '#fff', border: 'none', borderRadius: '6px',
                        padding: '9px 20px', fontSize: '14px', fontWeight: 600,
                        cursor: submitting ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {submitting ? 'Submitting…' : selection === 'feature' ? 'Submit Request' : 'Submit Bug Report'}
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
