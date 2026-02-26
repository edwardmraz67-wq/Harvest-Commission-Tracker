'use client'

import AuthenticatedLayout from '@/components/AuthenticatedLayout'

export default function PayoutsPage() {
  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Payout Periods</h1>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <h3 className="font-semibold text-blue-900 mb-2">Coming Soon</h3>
          <p className="text-sm text-blue-800">
            Payout period tracking will allow you to mark commissions as paid out and track your payment history.
            This feature will be available in a future update.
          </p>
          <p className="text-sm text-blue-800 mt-2">
            For now, you can export your commission data as CSV from the Commissions page and track payouts manually.
          </p>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
