import type {ReactNode} from 'react'
export function Badge({children,tone='gray'}:{children:ReactNode;tone?:'green'|'blue'|'amber'|'red'|'purple'|'gray'}){
  const t={green:'bg-emerald-50 text-emerald-700',blue:'bg-blue-50 text-blue-700',amber:'bg-amber-50 text-amber-700',red:'bg-red-50 text-red-700',purple:'bg-violet-50 text-violet-700',gray:'bg-slate-100 text-slate-600'}[tone]
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ${t}`}>{children}</span>
}
