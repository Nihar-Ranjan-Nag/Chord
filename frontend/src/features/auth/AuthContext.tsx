import {createContext,useContext,useEffect,useMemo,useState,type ReactNode} from 'react'
import {api,tokenStore} from '@/services/api'
import {mapUser} from '@/services/mappers'
import type {Role,User} from '@/types'

type UserRegisterInput={name:string;email:string;dateOfBirth:string;password:string;college?:string}
type OrganizerRegisterInput={organizationName:string;email:string;password:string}
type AuthContextValue={
  user:User|null
  loading:boolean
  login:(email:string,password:string)=>Promise<User>
  registerUser:(data:UserRegisterInput)=>Promise<User>
  registerOrganizer:(data:OrganizerRegisterInput)=>Promise<User>
  refreshUser:()=>Promise<User|null>
  logout:()=>Promise<void>
}

const AuthContext=createContext<AuthContextValue|undefined>(undefined)

export const roleHome=(role:Role)=>role==='admin'?'/admin':role==='organizer'?'/organizer':'/dashboard'

export function AuthProvider({children}:{children:ReactNode}){
  const [user,setUser]=useState<User|null>(null)
  const [loading,setLoading]=useState(true)

  async function refreshUser(){
    if(!tokenStore.getAccess()&&!tokenStore.getRefresh()){setUser(null);return null}
    try{
      const body:any=await api('/auth/me',{auth:true})
      const next=mapUser(body.data)
      setUser(next)
      return next
    }catch{
      tokenStore.clear()
      setUser(null)
      return null
    }
  }

  useEffect(()=>{refreshUser().finally(()=>setLoading(false))},[])

  async function login(email:string,password:string){
    const body:any=await api('/auth/login',{method:'POST',body:JSON.stringify({email,password})})
    tokenStore.set(body.data.accessToken,body.data.refreshToken)
    const next=mapUser(body.data.user)
    setUser(next)
    return next
  }

  async function registerUser(data:UserRegisterInput){
    await api('/auth/register/user',{method:'POST',body:JSON.stringify(data)})
    return login(data.email,data.password)
  }

  async function registerOrganizer(data:OrganizerRegisterInput){
    await api('/auth/register/organizer',{method:'POST',body:JSON.stringify(data)})
    return login(data.email,data.password)
  }

  async function logout(){
    const refreshToken=tokenStore.getRefresh()
    try{if(refreshToken)await api('/auth/logout',{method:'POST',body:JSON.stringify({refreshToken})})}
    finally{tokenStore.clear();setUser(null)}
  }

  const value=useMemo(()=>({user,loading,login,registerUser,registerOrganizer,refreshUser,logout}),[user,loading])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(){
  const context=useContext(AuthContext)
  if(!context)throw new Error('useAuth must be used inside AuthProvider')
  return context
}
