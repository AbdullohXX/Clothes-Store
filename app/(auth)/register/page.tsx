export default function RegisterPage() {
  async function action(formData: FormData) {
    'use server'
    const email = String(formData.get('email'))
    const password = String(formData.get('password'))
    const name = String(formData.get('name'))
    await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name })
    })
    // redirect to login
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-2xl font-semibold mb-6">Create account</h1>
      <form action={action} className="grid gap-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input name="name" required className="mt-1 w-full border rounded-md px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input name="email" type="email" required className="mt-1 w-full border rounded-md px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input name="password" type="password" required className="mt-1 w-full border rounded-md px-3 py-2" />
        </div>
        <button className="rounded-md bg-black text-white px-4 py-2">Sign up</button>
      </form>
    </div>
  )
}
