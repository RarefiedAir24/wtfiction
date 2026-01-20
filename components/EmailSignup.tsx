'use client';

import { useState } from 'react';
import { trackEmailSignup } from '@/lib/analytics';

export default function EmailSignup() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    
    if (email) {
      trackEmailSignup(email);
      // TODO: Connect to email service (Mailchimp, ConvertKit, etc.)
      console.log('Email signup submitted:', email);
      setIsSubmitted(true);
      // Reset form
      e.currentTarget.reset();
      
      // Reset success message after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    }
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-3xl md:text-4xl font-light mb-4 text-foreground">
        Stay Updated
      </h2>
      <p className="text-lg md:text-xl text-muted leading-relaxed mb-6 font-light">
        Get notified when new scenarios are published. No spam. Only new scenarios.
      </p>
      
      {isSubmitted ? (
        <div className="p-4 bg-[#3ea6ff]/10 border border-[#3ea6ff]/30 rounded-lg text-[#3ea6ff]">
          <p className="text-sm font-medium">✓ You're subscribed. Check your email to confirm.</p>
        </div>
      ) : (
        <form className="flex flex-col sm:flex-row gap-3 max-w-md" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="your@email.com"
            className="flex-1 px-4 py-3 bg-[#0f0f0f] border border-[#272727] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3ea6ff] focus:border-transparent text-foreground placeholder-[#aaaaaa]"
            required
          />
          <button
            type="submit"
            className="btn-primary whitespace-nowrap px-6 py-3"
          >
            Subscribe
          </button>
        </form>
      )}
    </div>
  );
}
