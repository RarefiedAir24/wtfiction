'use client';

import { trackEmailSignup } from '@/lib/analytics';

export default function EmailSignup() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    
    if (email) {
      trackEmailSignup(email);
      // TODO: Connect to email service (Mailchimp, ConvertKit, etc.)
      console.log('Email signup submitted:', email);
      // Reset form
      e.currentTarget.reset();
    }
  };

  return (
    <form className="flex flex-col sm:flex-row gap-3 max-w-md" onSubmit={handleSubmit}>
      <input
        type="email"
        name="email"
        placeholder="your@email.com"
        className="flex-1 px-4 py-2.5 bg-[#272727] border border-[#272727] text-foreground placeholder:text-muted focus:outline-none focus:border-[#3f3f3f] transition-colors text-sm rounded-sm"
        required
      />
      <button
        type="submit"
        className="px-6 py-2.5 bg-foreground text-background font-medium hover:opacity-90 transition-opacity text-sm rounded-sm whitespace-nowrap"
      >
        Subscribe
      </button>
    </form>
  );
}
