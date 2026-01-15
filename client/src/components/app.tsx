import { HomeRedirect } from '@/pages/home-redirect';
import { LeaguePage } from '@/pages/league-page';
import { LeaguesPage } from '@/pages/leagues-page';
import { LoginPage } from '@/pages/login-page';
import { PlayerPage } from '@/pages/player-page';
import { ProtectedRoute } from '@/pages/protected-route';
import { RegisterPage } from '@/pages/register-page';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter, Route, Routes } from "react-router";
import { AuthProvider } from './auth-provider';
import { Layout } from './layout';
import { ThemeProvider } from './theme-provider';

const queryClient = new QueryClient()

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route element={<ProtectedRoute />}>
                  <Route index element={<HomeRedirect />} />
                  <Route path="leagues" element={<LeaguesPage />} />
                  <Route path="leagues/:leagueId" element={<LeaguePage />} />
                  <Route path="players/:userId" element={<PlayerPage />} />
                </Route>
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
