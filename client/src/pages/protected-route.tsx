import { useGetMe } from '@/api/hooks/use-me';
import { AuthContext } from '@/components/AuthContext';
import { useContext, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';

export function ProtectedRoute() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const { isPending, data: user } = useGetMe();

  // Sync fetched user into auth context (avoid setState during render)
  useEffect(() => {
    if (!isPending && user) {
      if (!auth.user || auth.user.id !== user.id) {
        auth.setUser(user);
      }
    }
  }, [isPending, user, auth]);

  // Redirect if not authenticated once loading finishes
  useEffect(() => {
    if (!isPending && !user) {
      navigate('/login', { replace: true });
    }
  }, [isPending, user, navigate]);

  if (isPending) return <div>Loading...</div>;
  if (!user) return null; // Redirect effect will run

  return <Outlet />;
}
