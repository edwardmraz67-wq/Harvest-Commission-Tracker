'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function HarvestOnboardingPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [accountId, setAccountId] = useState('')
  const [accessToken, setAccessToken] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (status === 'unauthenticated') {
    router.push('/login')
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/harvest/connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId, accessToken }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to connect to Harvest')
        setLoading(false)
        return
      }

      if (data.warning) {
        alert(data.warning)
      }

      router.push('/dashboard')
    } catch (err) {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 px-4">
      <div className="max-w-2xl w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Connect to Harvest
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We'll import your clients, projects, and invoices to calculate commissions
          </p>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">How to get your Harvest credentials:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
            <li>Log in to your Harvest account</li>
            <li>Go to Settings → Authorized Apps → Personal Access Tokens</li>
            <li>Click "Create New Personal Access Token"</li>
            <li>Give it a name (e.g., "Commission Snapshot")</li>
            <li>Copy your Account ID and Personal Access Token</li>
          </ol>
          <p className="mt-3 text-xs text-blue-700">
            Your credentials are encrypted and stored securely. We only need read-only access.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="accountId" className="block text-sm font-medium text-gray-700">
                Harvest Account ID
              </label>
              <input
                id="accountId"
                type="text"
                required
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="123456"
              />
            </div>
            
            <div>
              <label htmlFor="accessToken" className="block text-sm font-medium text-gray-700">
                Personal Access Token
              </label>
              <input
                id="accessToken"
                type="password"
                required
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="your-access-token"
              />
              <p className="mt-1 text-xs text-gray-500">
                This will be encrypted before being stored
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Connecting to Harvest...' : 'Connect & Sync Data'}
          </button>

          <p className="text-center text-xs text-gray-500">
            This may take a minute while we import your Harvest data
          </p>
        </form>
      </div>
    </div>
  )
}
