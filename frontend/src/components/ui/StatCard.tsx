import type {ReactNode} from 'react'
export function StatCard({label,value,icon}:{label:string;value:string|number;icon:ReactNode}){
  return <div className="flex min-h-28 items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-violet-50 text-violet-600">{icon}</div><div className="min-w-0"><p className="text-xs font-semibold text-slate-500">{label}</p><p className="mt-1 truncate text-2xl font-extrabold text-slate-900">{value}</p></div></div>
}
