import { decrypt } from '@/lib/auth/encryption'

export interface HarvestClient {
  id: number
  name: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface HarvestProject {
  id: number
  name: string
  client: {
    id: number
    name: string
  }
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface HarvestInvoice {
  id: number
  client: {
    id: number
    name: string
  }
  number: string
  issue_date: string
  due_date: string | null
  state: string // "draft", "open", "paid", "closed"
  amount: number
  paid_amount: number
  paid_date: string | null
  created_at: string
  updated_at: string
}

export interface HarvestPayment {
  id: number
  amount: number
  paid_at: string
  invoice_id: number
}

export class HarvestApiClient {
  private accountId: string
  private accessToken: string
  private baseUrl = 'https://api.harvestapp.com/v2'

  constructor(accountId: string, encryptedToken: string) {
    this.accountId = accountId
    this.accessToken = decrypt(encryptedToken)
  }

  private async fetch<T>(endpoint: string): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Harvest-Account-Id': this.accountId,
        'User-Agent': 'Harvest Commission Snapshot (support@example.com)',
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Harvest API error (${response.status}): ${error}`)
    }

    return response.json()
  }

  async testConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      await this.fetch('/users/me')
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  async getClients(): Promise<HarvestClient[]> {
    const response = await this.fetch<{ clients: HarvestClient[] }>('/clients?per_page=100')
    return response.clients
  }

  async getProjects(): Promise<HarvestProject[]> {
    const response = await this.fetch<{ projects: HarvestProject[] }>('/projects?per_page=100')
    return response.projects
  }

  async getInvoices(page = 1): Promise<{ invoices: HarvestInvoice[]; total_pages: number }> {
    const response = await this.fetch<{ 
      invoices: HarvestInvoice[]
      per_page: number
      total_pages: number
      total_entries: number
      page: number
    }>(`/invoices?per_page=100&page=${page}`)
    
    return {
      invoices: response.invoices,
      total_pages: response.total_pages,
    }
  }

  async getAllInvoices(): Promise<HarvestInvoice[]> {
    let allInvoices: HarvestInvoice[] = []
    let page = 1
    let totalPages = 1

    do {
      const result = await this.getInvoices(page)
      allInvoices = [...allInvoices, ...result.invoices]
      totalPages = result.total_pages
      page++
    } while (page <= totalPages)

    return allInvoices
  }
}

export async function createHarvestClient(accountId: string, encryptedToken: string) {
  return new HarvestApiClient(accountId, encryptedToken)
}
