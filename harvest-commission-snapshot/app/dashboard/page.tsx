'use client'

import { useEffect, useState } from 'react'
import AuthenticatedLayout from '@/components/AuthenticatedLayout'
import { formatCurrency } from '@/lib/commissions/calculations'
import { startOfQuarter, endOfQuarter, format } from 'date-fns'

interface CommissionSummary {
  openCommission: number
  earnedCommission: number
  totalInvoicesOpen: number
  totalInvoicesPaid: number
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<CommissionSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [lastSync, setLastSync] = useState<string | null>(null)
  const [startDate, setStartDate] = useState(format(startOfQuarter(new Date()), 'yyyy-MM-dd'))
  const [endDate, setEndDate] = useState(format(endOfQuarter(new Date()), 'yyyy-MM-dd'))

  const fetchData = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({ startDate, endDate })
      const res = await fetch(`/api/commissions?${params}`)
      
      if (!res.ok) {
        throw new Error('Failed to fetch commissions')
      }

      const data = await res.json()
      setSummary(data.summary)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchConnection = async () => {
    try {
      const res = await fetch('/api/harvest/connection')
      if (res.ok) {
        const data = await res.json()
        if (data.connection?.lastSyncAt) {
          setLastSync(new Date(data.connection.lastSyncAt).toLocaleString())
        }
      }
    } catch (error) {
      console.error('Error fetching connection:', error)
    }
  }

  useEffect(() => {
    fetchData()
    fetchConnection()
  }, [startDate, endDate])

  const handleSync = async () => {
    setSyncing(true)
    try {
      const res = await fetch('/api/sync/harvest', { method: 'POST' })
      const data = await res.json()
      
      if (res.ok) {
        alert(`Sync successful! Updated ${data.stats?.invoicesUpdated || 0} invoices, created ${data.stats?.invoicesCreated || 0} new invoices.`)
        fetchData()
        fetchConnection()
      } else {
        alert(`Sync failed: ${data.error}`)
      }
    } catch (error) {
      alert('Sync failed. Please try again.')
    } finally {
      setSyncing(false)
    }
  }

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Commission Dashboard</h1>
          <button
            onClick={handleSync}
            disabled={syncing}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {syncing ? 'Syncing...' : 'Sync Now'}
          </button>
        </div>

        {lastSync && (
          <p className="text-sm text-gray-600">Last synced: {lastSync}</p>
        )}

        <div className="bg-white p-4 rounded-lg shadow space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Date Range</h2>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <button
              onClick={() => {
                setStartDate(format(startOfQuarter(new Date()), 'yyyy-MM-dd'))
                setEndDate(format(endOfQuarter(new Date()), 'yyyy-MM-dd'))
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              This Quarter
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-600">Loading commission data...</div>
          </div>
        ) : summary ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Open Commission</p>
                  <p className="text-xs text-gray-500 mt-1">Potential from unpaid invoices</p>
                </div>
                <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 text-xl">⏳</span>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 mt-4">
                {formatCurrency(summary.openCommission)}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {summary.totalInvoicesOpen} open invoices
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Earned Commission</p>
                  <p className="text-xs text-gray-500 mt-1">From paid invoices</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-xl">✓</span>
                </div>
              </div>
              <p className="text-3xl font-bold text-green-600 mt-4">
                {formatCurrency(summary.earnedCommission)}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {summary.totalInvoicesPaid} paid invoices
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No commission data available for this period.</p>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Next Steps</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• Review your <a href="/projects" className="underline">Projects</a> and assign custom commission rules</li>
            <li>• Check the detailed <a href="/commissions" className="underline">Commissions</a> table for invoice-level breakdown</li>
            <li>• Create <a href="/payouts" className="underline">Payout Periods</a> to track what you've been paid</li>
          </ul>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
