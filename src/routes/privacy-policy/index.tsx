import { createFileRoute } from '@tanstack/react-router'
import { useTheme } from '@/components/theme-provider'

export const Route = createFileRoute('/privacy-policy/')({
  component: PrivacyPolicy,
})

function PrivacyPolicy() {
  const { theme } = useTheme()

  return (
    <main className="flex-1 container mx-auto px-4 py-12 pb-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Last updated: June 26, 2025
        </p>
      </div>

      <div className={`max-w-4xl mx-auto p-6 rounded-lg ${theme === 'dark' ? 'bg-[#1a2234]' : 'bg-card'}`}>
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">1. No Data Collection</h2>
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              We do not collect, store, or transmit any of your personal data or files. All processing and conversion of your images is done locally on your own computer. Your files are never sent to our servers or any third-party service.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">2. Information We Don't Collect</h2>
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              We do not collect any personally identifiable information from our users. All image processing and conversion happens directly in your browser. Your files are never uploaded to our servers.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">3. Links to Other Websites</h2>
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Our Service may contain links to other websites that are not operated by Us. If You click on a third party link, You will be directed to that third party's site. We strongly advise You to review the Privacy Policy of every site You visit. We have no control over and assume no responsibility for the content, privacy policies or practices of any third party sites or services.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">4. Changes to this Privacy Policy</h2>
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              We may update Our Privacy Policy from time to time. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
