import DashboardClientLayout from "./DashboardClientLayout"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Le layout server ne redirige plus - c'est le client qui gère l'auth
  return <DashboardClientLayout>{children}</DashboardClientLayout>
}
