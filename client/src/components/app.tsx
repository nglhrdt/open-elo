import { HomePage } from '@/pages/home-page';
import { LoginPage } from '@/pages/login-page';
import { ProtectedRoute } from '@/pages/protected-route';
import { RegisterPage } from '@/pages/register';
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
                  <Route index element={<HomePage />} />
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
