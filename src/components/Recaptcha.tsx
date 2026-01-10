// @ts-nocheck
'use client';
import { useEffect, useRef } from 'react';

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '';

export function useRecaptcha() {
  const loadedRef = useRef(false);

  useEffect(() => {
    if (!SITE_KEY) {
      console.warn('RECAPTCHA site key not set (NEXT_PUBLIC_RECAPTCHA_SITE_KEY)');
      return;
    }
    if (typeof window === 'undefined') return;
    if ((window).grecaptcha && loadedRef.current) return;
    // inject script
    const id = 'recaptcha-v3';
    if (!document.getElementById(id)) {
      const s = document.createElement('script');
      s.id = id;
      s.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`;
      s.async = true;
      s.defer = true;
      document.head.appendChild(s);
    }
    const trySet = () => {
      if ((window).grecaptcha) loadedRef.current = true;
      else setTimeout(trySet, 200);
    };
    trySet();
  }, []);

  async function execute(action = 'submit'): Promise<string | null> {
    if (!SITE_KEY) return null;
    if (typeof window === 'undefined') return null;
    const grecaptcha = (window).grecaptcha;
    if (!grecaptcha) {
      console.warn('grecaptcha not ready');
      return null;
    }
    try {
      return await grecaptcha.execute(SITE_KEY, { action });
    } catch (err) {
      console.warn('recaptcha execute failed', err);
      return null;
    }
  }

  return { execute };
}