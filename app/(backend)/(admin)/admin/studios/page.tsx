"use client"
import { useSession } from "next-auth/react"

const AdminStudioManagementPage = () => {
  const { data: session } = useSession()

  console.log("session", session)
  return (
    <div>Admin StudioManagement Page.
        
    </div>
  )
}

export default AdminStudioManagementPage