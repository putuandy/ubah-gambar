import { createFileRoute } from '@tanstack/react-router'
import { useTheme } from '@/components/theme-provider'
import { Upload, MousePointerClick, ArrowRight, Download } from 'lucide-react'

export const Route = createFileRoute('/how-to-use/')({
  component: HowToUse,
})

function HowToUse() {
  const { theme } = useTheme()

  const steps = [
    {
      icon: Upload,
      title: '1. Upload Your Images',
      description:
        'Drag and drop your image files (PNG, JPG, WEBP, etc.) onto the upload area, or click the "Browse" button to select them from your computer.',
    },
    {
      icon: MousePointerClick,
      title: '2. Select Output Format',
      description:
        'Choose your desired output format from the dropdown menu. You can set a format for all images globally or select a different format for each image individually.',
    },
    {
      icon: ArrowRight,
      title: '3. Convert Your Images',
      description:
        'Click the "Convert" button to start the conversion process. The app will quickly process your images in the browser.',
    },
    {
      icon: Download,
      title: '4. Download Your Images',
      description:
        'Once converted, you can download each image individually or download all of them at once in a convenient ZIP file.',
    },
  ]

  return (
    <main className="flex-1 container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-2">How to Use Ubah Gambar</h1>
        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          A simple guide to converting your images with ease.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`p-6 rounded-lg ${
                theme === 'dark' ? 'bg-[#1a2234]' : 'bg-card'
              }`}
            >
              <div className="flex items-center mb-4">
                <div
                  className={`p-3 rounded-full mr-4 ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                  }`}
                >
                  <step.icon className="w-6 h-6 text-blue-500" />
                </div>
                <h2 className="text-2xl font-semibold">{step.title}</h2>
              </div>
              <p
                className={`${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
