import { useLogin } from '@/api/hooks/use-login';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { AuthContext } from './AuthContext';
import type { LoginResponse } from '@open-elo/shared';

export function LoginCard() {
  const { setToken, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const login = useLogin();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate(
      { email, password },
      {
        onSuccess: (data: LoginResponse) => {
          sessionStorage.setItem('auth_token', data.token);
          setToken(data.token);
          setUser(data.user);
          navigate('/');
        },
      },
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardAction>
          <Button variant="link">
            <Link to={'/register'}>Register</Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor="email">Username / Email</Label>
            <Input
              id="email"
              placeholder="Username or Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              placeholder="Password"
              type="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="pt-4 flex justify-end">
            <Button disabled={login.isPending}>
              {login.isPending ? 'Logging in...' : 'Login'}
            </Button>
          </div>
          {login.isError && (
            <div className="text-red-300 text-sm">
              {(login.error as Error).message}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
