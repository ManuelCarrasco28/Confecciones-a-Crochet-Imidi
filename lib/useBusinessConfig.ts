'use client';

import { useEffect, useState } from 'react';
import { DEFAULT_BUSINESS_CONFIG, fetchBusinessConfig } from './storeSettings';

export function useBusinessConfig() {
  const [config, setConfig] = useState(DEFAULT_BUSINESS_CONFIG);

  useEffect(() => {
    let cancelled = false;
    fetchBusinessConfig()
      .then((value) => {
        if (!cancelled) setConfig(value);
      })
      .catch(() => {
        // Mantener la configuración pública predeterminada como respaldo.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return config;
}
