'use client'

import { useEffect, useState } from 'react'
import AuthenticatedLayout from '@/components/AuthenticatedLayout'

interface Project {
  id: string
  harvestId: string
  name: string
  isActive: boolean
  client: {
    name: string
  }
  ruleAssignments: {
    commissionRule: {
      id: string
      name: string
      percent: number
    }
  }[]
}

interface Rule {
  id: string
  name: string
  percent: number
  isDefault: boolean
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [rules, setRules] = useState<Rule[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [projectsRes, rulesRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/rules'),
      ])

      if (projectsRes.ok && rulesRes.ok) {
        const [projectsData, rulesData] = await Promise.all([
          projectsRes.json(),
          rulesRes.json(),
        ])
        setProjects(projectsData.projects)
        setRules(rulesData.rules)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRuleChange = async (projectHarvestId: string, commissionRuleId: string) => {
    try {
      const res = await fetch('/api/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectHarvestId, commissionRuleId }),
      })

      if (res.ok) {
        fetchData()
      } else {
        alert('Failed to update project rule')
      }
    } catch (error) {
      alert('Failed to update project rule')
    }
  }

  const getCurrentRule = (project: Project) => {
    return project.ruleAssignments?.[0]?.commissionRule || rules.find(r => r.isDefault)
  }

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-600">Loading projects...</div>
          </div>
        ) : projects.length > 0 ? (
          <div className="bg-white shadow overflow-hidden rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Project
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Commission Rule
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {projects.map((project) => {
                    const currentRule = getCurrentRule(project)
                    return (
                      <tr key={project.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {project.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {project.client.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            project.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {project.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <select
                            value={currentRule?.id || ''}
                            onChange={(e) => handleRuleChange(project.harvestId, e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-green-500 focus:border-green-500"
                          >
                            {rules.map((rule) => (
                              <option key={rule.id} value={rule.id}>
                                {rule.name} ({rule.percent}%)
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-600">No projects found. Try syncing your Harvest data.</p>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  )
}
