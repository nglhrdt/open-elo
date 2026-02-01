import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from "react-router";
import { AuthProvider } from './auth-provider';
import { Layout } from './layout';
import { LoadingSpinner } from './loading-spinner';
import { ThemeProvider } from './theme-provider';
import { ReleaseNotesDialog } from './release-notes-dialog';

// Lazy load page components
const HomeRedirect = lazy(() => import('@/pages/home-redirect').then(m => ({ default: m.HomeRedirect })));
const LeaguePage = lazy(() => import('@/pages/league-page').then(m => ({ default: m.LeaguePage })));
const LeaguesPage = lazy(() => import('@/pages/leagues-page').then(m => ({ default: m.LeaguesPage })));
const LoginPage = lazy(() => import('@/pages/login-page').then(m => ({ default: m.LoginPage })));
const PlayerPage = lazy(() => import('@/pages/player-page').then(m => ({ default: m.PlayerPage })));
const ProtectedRoute = lazy(() => import('@/pages/protected-route').then(m => ({ default: m.ProtectedRoute })));
const RegisterPage = lazy(() => import('@/pages/register-page').then(m => ({ default: m.RegisterPage })));
const TokensPage = lazy(() => import('@/pages/tokens-page').then(m => ({ default: m.TokensPage })));

const queryClient = new QueryClient()

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
                    <Route path="leagues/:leagueId" element={<LeaguePage />} />
                    <Route path="players/:userId" element={<PlayerPage />} />
                    <Route path="tokens" element={<TokensPage />} />
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
  )
}
