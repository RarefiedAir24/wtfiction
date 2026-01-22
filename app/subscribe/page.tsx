'use client';

import { useState } from 'react';
import { trackEmailSignup } from '@/lib/analytics';

export default function SubscribePage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    
    if (email) {
      trackEmailSignup(email);
      
      try {
        const response = await fetch('/api/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to subscribe');
        }

        setIsSubmitted(true);
        e.currentTarget.reset();
        
        // Reset success message after 5 seconds
        setTimeout(() => setIsSubmitted(false), 5000);
      } catch (err: any) {
        console.error('Subscription error:', err);
        setError(err.message || 'Failed to subscribe. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 md:py-12">
        <h1 className="text-2xl md:text-3xl font-medium mb-8 text-foreground">
          Subscribe
        </h1>

        <div className="space-y-8">
          {/* Email Signup */}
          <section>
            <h2 className="text-lg md:text-xl font-medium mb-4 text-foreground">
              Email Updates
            </h2>
            <p className="text-sm md:text-base text-muted leading-normal mb-4">
              Get notified when new scenarios are released. No spam. No daily emails. Only new scenarios.
            </p>
            {isSubmitted ? (
              <div className="p-4 bg-[#3ea6ff]/10 border border-[#3ea6ff]/30 rounded-lg text-[#3ea6ff] max-w-md">
                <p className="text-sm font-medium">✓ You're subscribed. Check your email to confirm.</p>
              </div>
            ) : (
              <form className="flex flex-col sm:flex-row gap-3 max-w-md" onSubmit={handleSubmit}>
                <input
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  className="flex-1 px-4 py-2.5 bg-[#272727] border border-[#272727] text-foreground placeholder:text-muted focus:outline-none focus:border-[#3ea6ff] focus:ring-2 focus:ring-[#3ea6ff]/20 transition-all text-sm rounded-lg"
                  required
                  disabled={isSubmitting}
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#3ea6ff] to-[#2d8fdd] text-white font-semibold hover:shadow-lg hover:shadow-[#3ea6ff]/30 transition-all duration-300 ease-out transform hover:scale-105 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>
            )}
            {error && (
              <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm text-center max-w-md">
                {error}
              </div>
            )}
            <p className="text-xs text-muted mt-3 italic">
              Email signup is active. This is permission-based, not growth-at-all-costs.
            </p>
          </section>

          {/* YouTube Link */}
          <section className="pt-6 border-t border-[#272727]">
            <h2 className="text-lg md:text-xl font-medium mb-4 text-foreground">
              YouTube Channel
            </h2>
            <p className="text-sm md:text-base text-muted leading-normal mb-4">
              Subscribe on YouTube to never miss a new scenario.
            </p>
            <a
              href="https://www.youtube.com/@WTFictionTV"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#3ea6ff] to-[#2d8fdd] text-white font-semibold hover:shadow-lg hover:shadow-[#3ea6ff]/30 transition-all duration-300 ease-out transform hover:scale-105 hover:-translate-y-0.5 text-sm group relative overflow-hidden"
            >
              <span className="relative z-10">Subscribe on YouTube</span>
              <svg 
                className="relative z-10 w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              {/* Shine effect on hover */}
              <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out pointer-events-none"></span>
            </a>
          </section>
        </div>
      </div>
    </main>
  );
}
