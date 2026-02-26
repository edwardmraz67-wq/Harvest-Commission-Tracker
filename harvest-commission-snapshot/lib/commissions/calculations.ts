import { Invoice, CommissionRule, Project, ProjectRuleAssignment } from '@prisma/client'

export interface InvoiceWithCommission {
  id: string
  harvestId: string
  clientHarvestId: string
  number: string
  issueDate: Date
  dueDate: Date | null
  status: string
  amount: number
  amountPaid: number
  paidAt: Date | null
  commissionPercent: number
  commissionAmount: number
  projectName?: string
  clientName?: string
}

export function calculateCommission(
  invoice: Invoice,
  commissionPercent: number
): number {
  // For paid invoices, calculate based on amount paid
  if (invoice.status === 'paid' && invoice.amountPaid > 0) {
    return (invoice.amountPaid * commissionPercent) / 100
  }
  
  // For open invoices, calculate potential commission based on total amount
  if (invoice.status === 'open') {
    return (invoice.amount * commissionPercent) / 100
  }
  
  return 0
}

export function getCommissionForProject(
  projectHarvestId: string,
  assignments: ProjectRuleAssignment[],
  defaultRule: CommissionRule
): number {
  const assignment = assignments.find(a => a.projectHarvestId === projectHarvestId)
  
  if (assignment && assignment.commissionRule) {
    return (assignment.commissionRule as any).percent
  }
  
  return defaultRule.percent
}

export interface CommissionSummary {
  openCommission: number // Potential commission on unpaid invoices
  earnedCommission: number // Commission on paid invoices
  totalInvoicesOpen: number
  totalInvoicesPaid: number
}

export function calculateCommissionSummary(
  invoicesWithCommission: InvoiceWithCommission[]
): CommissionSummary {
  return invoicesWithCommission.reduce(
    (acc, invoice) => {
      if (invoice.status === 'open') {
        acc.openCommission += invoice.commissionAmount
        acc.totalInvoicesOpen++
      } else if (invoice.status === 'paid') {
        acc.earnedCommission += invoice.commissionAmount
        acc.totalInvoicesPaid++
      }
      return acc
    },
    {
      openCommission: 0,
      earnedCommission: 0,
      totalInvoicesOpen: 0,
      totalInvoicesPaid: 0,
    }
  )
}

export function filterInvoicesByDateRange(
  invoices: Invoice[],
  startDate: Date,
  endDate: Date
): Invoice[] {
  return invoices.filter(invoice => {
    // For paid invoices, use paid date
    if (invoice.status === 'paid' && invoice.paidAt) {
      return invoice.paidAt >= startDate && invoice.paidAt <= endDate
    }
    
    // For open invoices, use issue date
    if (invoice.status === 'open') {
      return invoice.issueDate >= startDate && invoice.issueDate <= endDate
    }
    
    return false
  })
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function formatPercent(percent: number): string {
  return `${percent}%`
}
