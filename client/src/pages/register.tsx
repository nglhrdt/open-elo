import { register } from '@/api/api'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useMutation } from '@tanstack/react-query'
import * as React from 'react'
import { Link, useNavigate } from 'react-router'

export function RegisterPage() {
  const navigate = useNavigate()
  const [username, setUsername] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const mutation = useMutation({
    mutationFn: () => register({ username, email, password }),
    onSuccess: () => {
      navigate('/login')
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardAction>
          <Button variant='link'>
            <Link to={"/login"}>Login</Link>
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
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </div>
          <div className='flex flex-col gap-1'>
            <Label htmlFor='email'>Email</Label>
            <Input
              id='email'
              placeholder="Email"
              type='email'
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className='flex flex-col gap-1'>
            <Label htmlFor='password'>Password</Label>
            <Input
              id='password'
              placeholder="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <div className='pt-4 flex justify-end'>
            <Button disabled={mutation.isPending} type='submit'>
              {mutation.isPending ? 'Registering...' : 'Register'}
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
