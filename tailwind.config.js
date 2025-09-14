// Tailwind CDN config
if (typeof window !== 'undefined') {
  window.tailwind = window.tailwind || {};
  window.tailwind.config = {
    theme: {
      extend: {
        colors: {
          primary: '#ff6b9d',
          secondary: '#c44569',
          accent: '#f8b500',
          luxury: '#667eea'
        },
        animation: {
          'spin-slow': 'spin 3s linear infinite',
          'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        }
      }
    }
  };
}
