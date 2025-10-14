'use client';

import { useState } from 'react';

export default function NewsletterForm() {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    // Basic validation
    if (!formData.name || !formData.email) {
      setStatus('error');
      setMessage('Please fill in all fields');
      return;
    }

    if (!formData.email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email');
      return;
    }

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('success');
        setMessage('Successfully subscribed! You\'ll receive concert updates.');
        setFormData({ name: '', email: '' });

        // Clear success message after 5 seconds
        setTimeout(() => {
          setStatus('idle');
          setMessage('');
        }, 5000);
      } else {
        setStatus('error');
        setMessage(data.error || 'Subscription failed. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error. Please try again.');
      console.error('Newsletter subscription error:', error);
    }
  };

  return (
    <div className="newsletter-form">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 items-center">
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          disabled={status === 'loading'}
          className="px-4 py-2 bg-[#0a0a0a] border border-[#333333] text-[#e8e8e8] rounded focus:outline-none focus:border-[#60a5fa] w-full sm:w-auto"
        />

        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          disabled={status === 'loading'}
          className="px-4 py-2 bg-[#0a0a0a] border border-[#333333] text-[#e8e8e8] rounded focus:outline-none focus:border-[#60a5fa] w-full sm:w-auto"
        />

        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-6 py-2 bg-[#60a5fa] text-[#121212] font-bold tracking-wide rounded hover:bg-[#4a90e2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
        >
          {status === 'loading' ? 'SUBSCRIBING...' : 'SUBSCRIBE'}
        </button>
      </form>

      {message && (
        <p className={`mt-2 text-sm ${status === 'success' ? 'text-[#16a34a]' : 'text-[#fdba74]'}`}>
          {message}
        </p>
      )}
    </div>
  );
}
