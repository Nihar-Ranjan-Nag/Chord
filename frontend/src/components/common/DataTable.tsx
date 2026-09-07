import type {ReactNode} from 'react'
export const TableShell=({children}:{children:ReactNode})=><div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="overflow-x-auto">{children}</div></div>
export const Table=({children}:{children:ReactNode})=><table className="w-full min-w-[760px] border-collapse text-left text-sm">{children}</table>
export const THead=({children}:{children:ReactNode})=><thead className="bg-slate-50 text-[10px] uppercase tracking-[0.08em] text-slate-500">{children}</thead>
export const TH=({children}:{children:ReactNode})=><th className="whitespace-nowrap px-5 py-3.5 font-extrabold">{children}</th>
export const TD=({children}:{children:ReactNode})=><td className="border-t border-slate-100 px-5 py-4 align-middle text-slate-600">{children}</td>
