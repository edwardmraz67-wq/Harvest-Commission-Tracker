import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'

// Force this route to be dynamic (not static)
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
