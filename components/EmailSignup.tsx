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
            className="flex-1 px-5 py-3.5 bg-[#0f0f0f] border-2 border-[#272727] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3ea6ff] focus:border-[#3ea6ff] text-foreground placeholder-[#aaaaaa] transition-all"
            required
          />
          <button
            type="submit"
            className="px-8 py-3.5 bg-gradient-to-r from-[#3ea6ff] to-[#2d8fdd] text-white font-semibold rounded-lg hover:from-[#4eb5ff] hover:to-[#3ea6ff] transition-all duration-300 shadow-lg hover:shadow-[#3ea6ff]/30 whitespace-nowrap"
          >
            Subscribe
          </button>
        </form>
      )}
    </div>
  );
}
