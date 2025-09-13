'use client'

import { useState } from 'react'
import Link from 'next/link'

const tabs = [
  { id: 'ai-apps', label: 'AI Apps', description: 'Get started using our pre-built templates. Easily stream long-running LLM responses for a better user experience with zero-config infrastructure that\'s always globally performant.' },
  { id: 'web-apps', label: 'Web Apps', description: 'Ship features faster with automated CI/CD, built-in observability, and backend infrastructure that scales automatically with your traffic.' },
  { id: 'ecommerce', label: 'Ecommerce', description: 'Create high-performance storefronts that delight your customers and drive conversions with our composable commerce infrastructure.' },
  { id: 'marketing', label: 'Marketing', description: 'Launch campaigns faster and iterate in real-time. Preview changes before going live and rollback instantly if needed.' },
  { id: 'platforms', label: 'Platforms', description: 'Build multi-tenant SaaS platforms with infrastructure that scales. Manage hundreds of projects from a single dashboard.' }
]

const logos = [
  { name: 'runway', text: 'build times went from 7m to 40s.' },
  { name: 'leonardo-ai', text: 'saw a 95% reduction in page load times.' },
  { name: 'zapier', text: 'saw 24x faster builds.' }
]

export default function Features() {
  const [activeTab, setActiveTab] = useState('ai-apps')
  const activeTabData = tabs.find(tab => tab.id === activeTab)

  return (
    <section className="py-24 bg-white">
      <div className="container-max">
        {/* Logo展示 */}
        <div className="flex flex-wrap items-center justify-center gap-8 mb-16 text-sm text-gray-600">
          {logos.map((logo, index) => (
            <div key={index} className="flex items-center space-x-2">
              <span className="font-semibold text-black">{logo.name}</span>
              <span>{logo.text}</span>
            </div>
          ))}
        </div>

        {/* 标签页 */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-gray-100 rounded-full p-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-black shadow-sm'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 内容区域 */}
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-lg text-gray-600 mb-8">
            {activeTabData?.description}
          </p>
          
          <Link 
            href={`/solutions/${activeTab}`}
            className="inline-flex items-center text-black hover:text-gray-600 transition-colors"
          >
            <span>Deploy {activeTabData?.label} in seconds</span>
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}