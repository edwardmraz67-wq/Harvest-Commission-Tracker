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

    const rules = await prisma.commissionRule.findMany({
      where: { userId: session.user.id },
      orderBy: [
        { isDefault: 'desc' },
        { name: 'asc' },
      ],
    })

    return NextResponse.json({ rules })
  } catch (error) {
    console.error('Rules API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch rules' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { name, percent } = body

    if (!name || percent === undefined) {
      return NextResponse.json(
        { error: 'Name and percent are required' },
        { status: 400 }
      )
    }

    const rule = await prisma.commissionRule.create({
      data: {
        userId: session.user.id,
        name,
        percent: parseFloat(percent),
        isDefault: false,
      },
    })

    return NextResponse.json({ rule })
  } catch (error) {
    console.error('Create rule error:', error)
    return NextResponse.json(
      { error: 'Failed to create rule' },
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
    const { id, name, percent } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Rule ID is required' },
        { status: 400 }
      )
    }

    const rule = await prisma.commissionRule.findFirst({
      where: { id, userId: session.user.id },
    })

    if (!rule) {
      return NextResponse.json(
        { error: 'Rule not found' },
        { status: 404 }
      )
    }

    if (rule.isDefault && name) {
      return NextResponse.json(
        { error: 'Cannot rename default rule' },
        { status: 400 }
      )
    }

    const updated = await prisma.commissionRule.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(percent !== undefined && { percent: parseFloat(percent) }),
      },
    })

    return NextResponse.json({ rule: updated })
  } catch (error) {
    console.error('Update rule error:', error)
    return NextResponse.json(
      { error: 'Failed to update rule' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Rule ID is required' },
        { status: 400 }
      )
    }

    const rule = await prisma.commissionRule.findFirst({
      where: { id, userId: session.user.id },
    })

    if (!rule) {
      return NextResponse.json(
        { error: 'Rule not found' },
        { status: 404 }
      )
    }

    if (rule.isDefault) {
      return NextResponse.json(
        { error: 'Cannot delete default rule' },
        { status: 400 }
      )
    }

    // Reassign projects using this rule to default
    const defaultRule = await prisma.commissionRule.findFirst({
      where: { userId: session.user.id, isDefault: true },
    })

    if (defaultRule) {
      await prisma.projectRuleAssignment.updateMany({
        where: { commissionRuleId: id },
        data: { commissionRuleId: defaultRule.id },
      })
    }

    await prisma.commissionRule.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete rule error:', error)
    return NextResponse.json(
      { error: 'Failed to delete rule' },
      { status: 500 }
    )
  }
}
