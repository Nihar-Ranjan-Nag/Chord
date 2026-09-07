import {Search} from 'lucide-react'
import {useState} from 'react'
import {Link} from 'react-router-dom'
import {Badge} from '@/components/ui/Badge'
import {ApiError,ApiLoading,EmptyState} from '@/components/common/ApiState'
import {PageHeading} from '@/components/common/PageHeading'
import {TableShell,Table,THead,TH,TD} from '@/components/common/DataTable'
import {useAsyncData} from '@/hooks/useAsyncData'
import {api} from '@/services/api'
import {mapUser} from '@/services/mappers'
export function StudentsPage(){
  const [search,setSearch]=useState('');const {data,loading,error}=useAsyncData(async()=>{const b:any=await api(`/admin/users${search?`?search=${encodeURIComponent(search)}`:''}`,{auth:true});return(b.data||[]).map(mapUser)},[search])
  return <><PageHeading eyebrow="USERS" title="User management" description="Manage normal user accounts, points and activity."/><div className="mb-5 flex max-w-md items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 focus-within:border-violet-400 focus-within:ring-4 focus-within:ring-violet-100"><Search size={17} className="text-slate-400"/><input className="h-11 min-w-0 flex-1 bg-transparent text-sm outline-none" placeholder="Search name, email or college…" value={search} onChange={e=>setSearch(e.target.value)}/></div>{loading&&<ApiLoading/>}{error&&<ApiError message={error}/>} {!loading&&!error&&(data||[]).length===0&&<EmptyState title="No users found" message="No matching user accounts exist."/>}{(data||[]).length>0&&<TableShell><Table><THead><tr><TH>User</TH><TH>College / Course</TH><TH>Points</TH><TH>Events</TH><TH>Rewards</TH><TH>Status</TH><TH>Action</TH></tr></THead><tbody>{(data||[]).map(s=><tr key={s.id}><TD><strong className="block text-slate-800">{s.name}</strong><small className="mt-1 block text-xs text-slate-400">{s.email}</small></TD><TD>{s.college||'—'}<small className="mt-1 block text-xs text-slate-400">{s.course||''}</small></TD><TD>{s.points}</TD><TD>{s.registrationsCount??0}</TD><TD>{s.redemptionsCount??0}</TD><TD><Badge tone={s.active?'green':'gray'}>{s.status||'INACTIVE'}</Badge></TD><TD><Link className="whitespace-nowrap text-xs font-bold text-violet-600" to={`/admin/users/${s.id}`}>Manage →</Link></TD></tr>)}</tbody></Table></TableShell>}</>
}
