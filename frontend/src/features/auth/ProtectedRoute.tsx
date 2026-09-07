import {Navigate,Outlet} from 'react-router-dom'
import {roleHome,useAuth} from './AuthContext'
import type {Role} from '@/types'

export function ProtectedRoute({role,roles}:{role?:Role;roles?:Role[]}){
  const {user,loading}=useAuth()
  if(loading)return <div className="grid min-h-screen place-items-center bg-slate-50"><div className="h-9 w-9 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600"/></div>
  if(!user)return <Navigate to="/login" replace/>
  const allowed=roles||[role!]
  if(!allowed.includes(user.role))return <Navigate to={roleHome(user.role)} replace/>
  return <Outlet/>
}
