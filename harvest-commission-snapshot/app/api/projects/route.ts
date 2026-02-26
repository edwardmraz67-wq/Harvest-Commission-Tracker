import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'
import { prisma } from '@/lib/db/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const projects = await prisma.project.findMany({
      include: {
        client: true,
        ruleAssignments: {
          where: { userId: session.user.id },
          include: { commissionRule: true },
        },
      },
      orderBy: [
        { isActive: 'desc' },
        { name: 'asc' },
      ],
    })

    return NextResponse.json({ projects })
  } catch (error) {
    console.error('Projects API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { projectHarvestId, commissionRuleId } = body

    if (!projectHarvestId || !commissionRuleId) {
      return NextResponse.json(
        { error: 'Project ID and Rule ID are required' },
        { status: 400 }
      )
    }

    // Verify the rule belongs to the user
    const rule = await prisma.commissionRule.findFirst({
      where: { id: commissionRuleId, userId: session.user.id },
    })

    if (!rule) {
      return NextResponse.json(
        { error: 'Rule not found' },
        { status: 404 }
      )
    }

    const assignment = await prisma.projectRuleAssignment.upsert({
      where: {
        userId_projectHarvestId: {
          userId: session.user.id,
          projectHarvestId,
        },
      },
      create: {
        userId: session.user.id,
        projectHarvestId,
        commissionRuleId,
      },
      update: {
        commissionRuleId,
      },
      include: {
        commissionRule: true,
        project: true,
      },
    })

    return NextResponse.json({ assignment })
  } catch (error) {
    console.error('Update project assignment error:', error)
    return NextResponse.json(
      { error: 'Failed to update project assignment' },
      { status: 500 }
    )
  }
}
