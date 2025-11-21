import { Metadata } from 'next'
import Header from '@/components/header'
import Footer from '@/components/footer'
import LoginForm from '@/components/login-form'

export const metadata: Metadata = {
  title: 'Login - TAJAM',
  description: 'Author login for TAJAM editorial platform',
}

export default function LoginPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-full max-w-md px-6 py-24">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-2">Welcome back</h1>
            <p className="text-muted">Sign in to your author account</p>
          </div>

          <LoginForm />

          <p className="text-sm text-muted text-center mt-6">
            Don&apos;t have an account? Contact the editor.
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
