import { AuthContext } from '@/components/AuthContext';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';

export function HomeRedirect() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.favoriteLeague) {
      navigate(
        `/leagues/${user.favoriteLeague.id}/seasons/${user.favoriteLeague.season.id}`,
        { replace: true },
      );
    } else {
      navigate('/leagues', { replace: true });
    }
  }, [user, navigate]);

  return null;
}
