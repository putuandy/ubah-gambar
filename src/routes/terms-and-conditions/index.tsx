import { createFileRoute } from '@tanstack/react-router'
import { useTheme } from '@/components/theme-provider'

export const Route = createFileRoute('/terms-and-conditions/')({
  component: TermsAndConditions,
})

function TermsAndConditions() {
  const { theme } = useTheme()

  return (
    <main className="flex-1 container mx-auto px-4 py-12 pb-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-2">Terms & Conditions</h1>
        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Last updated: June 26, 2025
        </p>
      </div>

      <div className={`max-w-4xl mx-auto p-6 rounded-lg ${theme === 'dark' ? 'bg-[#1a2234]' : 'bg-card'}`}>
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Welcome to Ubah Gambar ("we", "our", or "us"). These Terms & Conditions govern your use of our website and services. By accessing or using our service, you agree to be bound by these terms. If you disagree with any part of the terms, you may not access the service.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">2. Data Privacy and Security</h2>
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              We take your privacy seriously. Our service is designed to respect your privacy by processing all image conversions directly on your computer. This means that any files you upload or download never leave your device and are not sent to our servers. We do not collect, store, or have access to any of your personal data or the content you convert.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">3. User Responsibilities</h2>
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              You are solely responsible for the content you convert using our platform. You agree not to use our service for any unlawful purpose or to convert any content that infringes on the rights of others, including intellectual property rights.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">4. Disclaimer of Warranties</h2>
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Our service is provided "as is" and "as available" without any warranties of any kind, either express or implied. We do not warrant that the service will be uninterrupted, error-free, or completely secure. We are not responsible for any loss or damage to your data that may occur during the conversion process.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">5. Limitation of Liability</h2>
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              In no event shall Ubah Gambar, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">6. Changes to Terms</h2>
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. You are advised to review these Terms periodically for any changes. Changes to these Terms are effective when they are posted on this page.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
