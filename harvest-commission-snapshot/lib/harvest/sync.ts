import { prisma } from '@/lib/db/prisma'
import { createHarvestClient } from '@/lib/harvest/client'

export async function syncHarvestData(userId: string): Promise<{
  success: boolean
  error?: string
  stats?: {
    clientsCreated: number
    projectsCreated: number
    invoicesCreated: number
    invoicesUpdated: number
  }
}> {
  try {
    // Get user's Harvest connection
    const connection = await prisma.harvestConnection.findUnique({
      where: { userId },
    })

    if (!connection) {
      return { success: false, error: 'No Harvest connection found' }
    }

    // Create Harvest API client
    const harvestClient = await createHarvestClient(
      connection.accountId,
      connection.accessTokenEncrypted
    )

    // Test connection first
    const test = await harvestClient.testConnection()
    if (!test.success) {
      return { success: false, error: test.error }
    }

    const stats = {
      clientsCreated: 0,
      projectsCreated: 0,
      invoicesCreated: 0,
      invoicesUpdated: 0,
    }

    // Sync Clients
    const clients = await harvestClient.getClients()
    for (const client of clients) {
      const existing = await prisma.client.findUnique({
        where: { harvestId: String(client.id) },
      })

      if (!existing) {
        await prisma.client.create({
          data: {
            harvestId: String(client.id),
            name: client.name,
          },
        })
        stats.clientsCreated++
      } else {
        await prisma.client.update({
          where: { harvestId: String(client.id) },
          data: { name: client.name },
        })
      }
    }

    // Sync Projects
    const projects = await harvestClient.getProjects()
    for (const project of projects) {
      const existing = await prisma.project.findUnique({
        where: { harvestId: String(project.id) },
      })

      if (!existing) {
        await prisma.project.create({
          data: {
            harvestId: String(project.id),
            clientHarvestId: String(project.client.id),
            name: project.name,
            isActive: project.is_active,
          },
        })
        stats.projectsCreated++

        // Auto-assign to default rule
        const defaultRule = await prisma.commissionRule.findFirst({
          where: { userId, isDefault: true },
        })

        if (defaultRule) {
          await prisma.projectRuleAssignment.upsert({
            where: {
              userId_projectHarvestId: {
                userId,
                projectHarvestId: String(project.id),
              },
            },
            create: {
              userId,
              projectHarvestId: String(project.id),
              commissionRuleId: defaultRule.id,
            },
            update: {},
          })
        }
      } else {
        await prisma.project.update({
          where: { harvestId: String(project.id) },
          data: {
            name: project.name,
            isActive: project.is_active,
          },
        })
      }
    }

    // Sync Invoices
    const invoices = await harvestClient.getAllInvoices()
    for (const invoice of invoices) {
      const existing = await prisma.invoice.findUnique({
        where: { harvestId: String(invoice.id) },
      })

      const invoiceData = {
        harvestId: String(invoice.id),
        clientHarvestId: String(invoice.client.id),
        number: invoice.number,
        issueDate: new Date(invoice.issue_date),
        dueDate: invoice.due_date ? new Date(invoice.due_date) : null,
        status: invoice.state,
        amount: invoice.amount,
        amountPaid: invoice.paid_amount,
        paidAt: invoice.paid_date ? new Date(invoice.paid_date) : null,
      }

      if (!existing) {
        await prisma.invoice.create({ data: invoiceData })
        stats.invoicesCreated++
      } else {
        await prisma.invoice.update({
          where: { harvestId: String(invoice.id) },
          data: invoiceData,
        })
        stats.invoicesUpdated++
      }
    }

    // Update lastSyncAt
    await prisma.harvestConnection.update({
      where: { userId },
      data: { lastSyncAt: new Date() },
    })

    return { success: true, stats }
  } catch (error) {
    console.error('Sync error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown sync error',
    }
  }
}
