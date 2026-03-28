import { useEffect } from 'react';
import { useNavigate, type NavigateOptions, type To } from 'react-router';

export default function NavigationListener() {
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for navigation events from outside React Router
    const handleNavigationEvent = (event: Event) => {
      const customEvent = event as CustomEvent<{ to: To; options?: NavigateOptions }>;
      const { to, options } = customEvent.detail;
      navigate(to, options);
    };

    window.addEventListener('reactRouterNavigate', handleNavigationEvent);

    return () => {
      window.removeEventListener('reactRouterNavigate', handleNavigationEvent);
    };
  }, [navigate]);

  return null;
}
