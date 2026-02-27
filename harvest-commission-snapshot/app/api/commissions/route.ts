import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'
import { prisma } from '@/lib/db/prisma'
import { 
  calculateCommission, 
  calculateCommissionSummary,
  filterInvoicesByDateRange,
  InvoiceWithCommission 
} from '@/lib/commissions/calculations'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Get default rule
    const defaultRule = await prisma.commissionRule.findFirst({
      where: { userId: session.user.id, isDefault: true },
    })

    if (!defaultRule) {
      return NextResponse.json(
        { error: 'No default commission rule found' },
        { status: 400 }
      )
    }

    // Get all project assignments with rules
    const assignments = await prisma.projectRuleAssignment.findMany({
      where: { userId: session.user.id },
      include: { commissionRule: true, project: true },
    })

    // Get all invoices with client data
    let invoicesData = await prisma.invoice.findMany({
      include: { client: true },
    })

    // Filter by date range if provided
    if (startDate && endDate) {
      invoicesData = filterInvoicesByDateRange(
        invoicesData,
        new Date(startDate),
        new Date(endDate)
      )
    }

    // Get all projects to map invoice -> project
    const projects = await prisma.project.findMany()
    const clientProjects = new Map(
      projects.map(p => [p.clientHarvestId, p])
    )

    // Calculate commissions for each invoice
    const invoicesWithCommission: InvoiceWithCommission[] = invoicesData.map(invoice => {
      const project = clientProjects.get(invoice.clientHarvestId)
      const assignment = assignments.find(
        a => a.projectHarvestId === project?.harvestId
      )
      
      const commissionPercent = assignment?.commissionRule.percent ?? defaultRule.percent
      const commissionAmount = calculateCommission(invoice, commissionPercent)

      return {
        id: invoice.id,
        harvestId: invoice.harvestId,
        clientHarvestId: invoice.clientHarvestId,
        number: invoice.number,
        issueDate: invoice.issueDate,
        dueDate: invoice.dueDate,
        status: invoice.status,
        amount: invoice.amount,
        amountPaid: invoice.amountPaid,
        paidAt: invoice.paidAt,
        commissionPercent,
        commissionAmount,
        clientName: invoice.client.name,
        projectName: project?.name,
      }
    })

    const summary = calculateCommissionSummary(invoicesWithCommission)

    return NextResponse.json({
      invoices: invoicesWithCommission,
      summary,
    })
  } catch (error) {
    console.error('Commissions API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch commissions' },
      { status: 500 }
    )
  }
}
