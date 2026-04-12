import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import { AuthProvider } from './components/auth-provider';
import { Layout } from './components/layout';
import { LoadingSpinner } from './components/loading-spinner';
import { ReleaseNotesDialog } from './components/release-notes-dialog';
import { ThemeProvider } from './components/theme-provider';

// Lazy load page components
const HomeRedirect = lazy(() =>
  import('@/pages/home-redirect').then((m) => ({ default: m.HomeRedirect })),
);
const LeaguePage = lazy(() =>
  import('@/pages/league-page').then((m) => ({ default: m.LeaguePage })),
);
const LeaguesPage = lazy(() =>
  import('@/pages/leagues-page').then((m) => ({ default: m.LeaguesPage })),
);
const LoginPage = lazy(() =>
  import('@/pages/login-page').then((m) => ({ default: m.LoginPage })),
);
const PlayerPage = lazy(() =>
  import('@/pages/player-page').then((m) => ({ default: m.PlayerPage })),
);
const ProtectedRoute = lazy(() =>
  import('@/pages/protected-route').then((m) => ({
    default: m.ProtectedRoute,
  })),
);
const RegisterPage = lazy(() =>
  import('@/pages/register-page').then((m) => ({ default: m.RegisterPage })),
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 5 * 60 * 1000 },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <ReleaseNotesDialog />
          <BrowserRouter>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route element={<Layout />}>
                  <Route element={<ProtectedRoute />}>
                    <Route index element={<HomeRedirect />} />
                    <Route path="leagues" element={<LeaguesPage />} />
                    <Route
                      path="leagues/:leagueId/seasons/:seasonId/players/:playerId"
                      element={<PlayerPage />}
                    />
                    <Route
                      path="leagues/:leagueId/seasons/:seasonId"
                      element={<LeaguePage />}
                    />
                  </Route>
                  <Route path="login" element={<LoginPage />} />
                  <Route path="register" element={<RegisterPage />} />
                </Route>
              </Routes>
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
