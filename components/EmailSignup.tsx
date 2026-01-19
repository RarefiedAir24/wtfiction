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
        className="flex-1"
        required
      />
      <button
        type="submit"
        className="btn-primary whitespace-nowrap"
      >
        Subscribe
      </button>
    </form>
  );
}
