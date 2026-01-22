'use client';

import { useState } from 'react';
import { trackEmailSignup } from '@/lib/analytics';

export default function EmailSignup() {
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
    }
  };

  return (
    <div className="w-full max-w-md">
      {isSubmitted ? (
        <div className="p-4 bg-gradient-to-r from-[#3ea6ff]/10 to-[#2d8fdd]/10 border border-[#3ea6ff]/30 rounded-lg text-[#3ea6ff] text-center">
          <p className="text-sm font-medium">✓ You're subscribed. Check your email to confirm.</p>
        </div>
      ) : (
        <form className="flex flex-col sm:flex-row gap-3" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="your@email.com"
            className="flex-1 px-5 py-3.5 bg-[#0f0f0f] border-2 border-[#272727] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3ea6ff] focus:border-[#3ea6ff] text-foreground placeholder-[#aaaaaa] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            required
            disabled={isSubmitting}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3.5 bg-gradient-to-r from-[#3ea6ff] to-[#2d8fdd] text-white font-semibold rounded-lg hover:from-[#4eb5ff] hover:to-[#3ea6ff] transition-all duration-300 shadow-lg hover:shadow-[#3ea6ff]/30 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-[#3ea6ff] disabled:hover:to-[#2d8fdd]"
          >
            {isSubmitting ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
      )}
      {error && (
        <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm text-center">
          {error}
        </div>
      )}
    </div>
  );
}
