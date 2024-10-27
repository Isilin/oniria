'use client';

import { useEffect, useState } from 'react';

const getAnchor = () =>
  typeof window !== 'undefined'
    ? Number(decodeURIComponent(window.location.hash.replace('#', '')))
    : 0;

const useAnchor = () => {
  const [anchor, setAnchor] = useState(getAnchor());

  useEffect(() => {
    const handleAnchorChange = () => {
      setAnchor(getAnchor());
    };

    window.addEventListener('hashchange', handleAnchorChange);

    return () => window.removeEventListener('hashchange', handleAnchorChange);
  }, []);

  return anchor;
};

export default useAnchor;
