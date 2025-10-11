import { signIn } from '@/lib/auth'

export default function LoginPage() {
  async function onSubmit(formData: FormData) {
    'use server'
    await signIn('credentials', {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      redirectTo: '/'
    })
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-2xl font-semibold mb-6">Login</h1>
      <form action={onSubmit} className="grid gap-4">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input name="email" type="email" required className="mt-1 w-full border rounded-md px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input name="password" type="password" required className="mt-1 w-full border rounded-md px-3 py-2" />
        </div>
        <button className="rounded-md bg-black text-white px-4 py-2">Sign in</button>
      </form>
    </div>
  )
}
