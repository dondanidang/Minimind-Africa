// This layout applies to all routes under /admin, including /admin/login
// For admin-protected routes, use the layout in (dashboard)/layout.tsx
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

