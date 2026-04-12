import { login, type User } from '@/api/api';
import { AuthContext } from '@/components/AuthContext';
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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router';

export function LoginCard() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: () => login({ email, password }),
    onSuccess: (data: { token: string; user: User }) => {
      sessionStorage.setItem('auth_token', data.token);
      auth.setToken(data.token);
      auth.setUser(data.user);
      queryClient.setQueryData(['current-user'], data.user);
      navigate('/');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate();
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
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="Email"
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
            <Button disabled={loginMutation.isPending}>
              {loginMutation.isPending ? 'Logging in...' : 'Login'}
            </Button>
          </div>
          {loginMutation.isError && (
            <div className="text-red-300 text-sm">
              {(loginMutation.error as Error).message}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
