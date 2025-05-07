import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/admin-sidebar"
import NavbarLogin from "@/components/NavbarLogin"


export default async function ProtectedLayout({ children}: { children: React.ReactNode}) {
  const session = await auth()
  
  if (!session) {
    redirect('/login')
  }

  //t

  return (
    <>
    <SidebarProvider>
        <AdminSidebar />
        <SidebarInset>

            <header className="bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <div className="flex flex-1 items-center justify-between">
                  <h1 className="text-lg font-semibold">Dashboard</h1>
                  <NavbarLogin />
                </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4">
                {children}
            </div>

        </SidebarInset>
    </SidebarProvider>
    </>
  )
}