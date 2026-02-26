'use client'

import { useEffect, useState } from 'react'
import AuthenticatedLayout from '@/components/AuthenticatedLayout'

interface Rule {
  id: string
  name: string
  percent: number
  isDefault: boolean
}

export default function RulesPage() {
  const [rules, setRules] = useState<Rule[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newRuleName, setNewRuleName] = useState('')
  const [newRulePercent, setNewRulePercent] = useState('10')
  const [editingRule, setEditingRule] = useState<string | null>(null)
  const [editPercent, setEditPercent] = useState('')

  useEffect(() => {
    fetchRules()
  }, [])

  const fetchRules = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/rules')
      
      if (res.ok) {
        const data = await res.json()
        setRules(data.rules)
      }
    } catch (error) {
      console.error('Error fetching rules:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newRuleName,
          percent: parseFloat(newRulePercent),
        }),
      })

      if (res.ok) {
        setNewRuleName('')
        setNewRulePercent('10')
        setShowCreateForm(false)
        fetchRules()
      } else {
        alert('Failed to create rule')
      }
    } catch (error) {
      alert('Failed to create rule')
    }
  }

  const handleUpdate = async (id: string) => {
    try {
      const res = await fetch('/api/rules', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          percent: parseFloat(editPercent),
        }),
      })

      if (res.ok) {
        setEditingRule(null)
        fetchRules()
      } else {
        alert('Failed to update rule')
      }
    } catch (error) {
      alert('Failed to update rule')
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the rule "${name}"? Projects using this rule will be reassigned to the default rule.`)) {
      return
    }

    try {
      const res = await fetch(`/api/rules?id=${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        fetchRules()
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to delete rule')
      }
    } catch (error) {
      alert('Failed to delete rule')
    }
  }

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Commission Rules</h1>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            {showCreateForm ? 'Cancel' : 'Create Rule'}
          </button>
        </div>

        {showCreateForm && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New Rule</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rule Name
                </label>
                <input
                  type="text"
                  required
                  value={newRuleName}
                  onChange={(e) => setNewRuleName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="e.g., VIP Clients"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Commission Percentage
                </label>
                <input
                  type="number"
                  required
                  step="0.1"
                  min="0"
                  max="100"
                  value={newRulePercent}
                  onChange={(e) => setNewRulePercent(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="10"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Create Rule
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-600">Loading rules...</div>
          </div>
        ) : rules.length > 0 ? (
          <div className="bg-white shadow overflow-hidden rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rule Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commission Percentage
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rules.map((rule) => (
                  <tr key={rule.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {rule.name}
                      {rule.isDefault && (
                        <span className="ml-2 px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded">
                          Default
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {editingRule === rule.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="100"
                            value={editPercent}
                            onChange={(e) => setEditPercent(e.target.value)}
                            className="w-24 px-2 py-1 border border-gray-300 rounded"
                          />
                          <button
                            onClick={() => handleUpdate(rule.id)}
                            className="text-green-600 hover:text-green-800"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingRule(null)}
                            className="text-gray-600 hover:text-gray-800"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        `${rule.percent}%`
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      {editingRule !== rule.id && (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingRule(rule.id)
                              setEditPercent(rule.percent.toString())
                            }}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Edit
                          </button>
                          {!rule.isDefault && (
                            <button
                              onClick={() => handleDelete(rule.id, rule.name)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-600">No rules found.</p>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  )
}
