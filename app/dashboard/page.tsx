import { Metadata } from 'next'
import Header from '@/components/header'
import Footer from '@/components/footer'
import DashboardContent from '@/components/dashboard-content'

export const metadata: Metadata = {
  title: 'Dashboard - TAJAM',
  description: 'Author dashboard for managing content',
  robots: {
    index: false,
    follow: false,
  },
}

export default function DashboardPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <DashboardContent />
      </main>
      <Footer />
    </>
  )
}
