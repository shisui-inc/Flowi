export const dynamic = 'force-dynamic'

import DashboardLayoutClient from './layout-client'

export default function DashboardLayout({ children }) {
  return <DashboardLayoutClient>{children}</DashboardLayoutClient>
}

