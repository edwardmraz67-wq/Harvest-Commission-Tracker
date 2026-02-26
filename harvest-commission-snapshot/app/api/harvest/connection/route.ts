import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'
import { prisma } from '@/lib/db/prisma'
import { encrypt } from '@/lib/auth/encryption'
import { createHarvestClient } from '@/lib/harvest/client'
import { syncHarvestData } from '@/lib/harvest/sync'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { accountId, accessToken } = body

    if (!accountId || !accessToken) {
      return NextResponse.json(
        { error: 'Account ID and Access Token are required' },
        { status: 400 }
      )
    }

    // Test the connection first
    const encryptedToken = encrypt(accessToken)
    const harvestClient = await createHarvestClient(accountId, encryptedToken)
    const testResult = await harvestClient.testConnection()

    if (!testResult.success) {
      return NextResponse.json(
        { error: `Harvest connection failed: ${testResult.error}` },
        { status: 400 }
      )
    }

    // Save the connection
    const connection = await prisma.harvestConnection.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        accountId,
        accessTokenEncrypted: encryptedToken,
      },
      update: {
        accountId,
        accessTokenEncrypted: encryptedToken,
      },
    })

    // Create default commission rule if it doesn't exist
    const defaultRule = await prisma.commissionRule.findFirst({
      where: {
        userId: session.user.id,
        isDefault: true,
      },
    })

    if (!defaultRule) {
      await prisma.commissionRule.create({
        data: {
          userId: session.user.id,
          name: 'Default Rule',
          percent: 10,
          isDefault: true,
        },
      })
    }

    // Perform initial sync
    const syncResult = await syncHarvestData(session.user.id)

    if (!syncResult.success) {
      // Connection saved but sync failed - still return success with warning
      return NextResponse.json({
        success: true,
        warning: 'Connection saved but initial sync failed. Please try syncing again.',
        syncError: syncResult.error,
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Harvest connected and synced successfully',
      stats: syncResult.stats,
    })
  } catch (error) {
    console.error('Harvest connection error:', error)
    return NextResponse.json(
      { error: 'Failed to connect to Harvest' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const connection = await prisma.harvestConnection.findUnique({
      where: { userId: session.user.id },
      select: {
        accountId: true,
        lastSyncAt: true,
        createdAt: true,
      },
    })

    return NextResponse.json({ connection })
  } catch (error) {
    console.error('Get connection error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch connection' },
      { status: 500 }
    )
  }
}
