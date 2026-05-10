// src/app/auth/layout.tsx

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A]">
      {children}
    </div>
  )
}
