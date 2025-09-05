import { login, type User } from '@/api/api'
import { AuthContext } from '@/components/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useMutation } from '@tanstack/react-query'
import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router'

export function LoginCard() {
  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')
  const auth = useContext(AuthContext)
  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: () => login({ user, password }),
    onSuccess: (data: { token: string, user: User }) => {
      auth.setToken(data.token)
      auth.setUser(data.user)
      navigate('/')
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardAction>
          <Button variant='link'>
            <Link to={"/register"}>Register</Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            mutation.mutate()
          }}
          className='flex flex-col gap-4'
        >
          <div className='flex flex-col gap-1'>
            <Label htmlFor='username'>Username</Label>
            <Input
              id='username'
              placeholder="Username"
              value={user}
              onChange={e => setUser(e.target.value)}
            />
          </div>
          <div className='flex flex-col gap-1'>
            <Label htmlFor='password'>Password</Label>
            <Input
              id='password'
              placeholder="password"
              type="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <div className='pt-4 flex justify-end'>
            <Button disabled={mutation.isPending}>
              {mutation.isPending ? 'Logging in...' : 'Login'}
            </Button>
          </div>
          {mutation.isError && (
            <div className="text-red-300 text-sm">
              {(mutation.error as Error).message}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
