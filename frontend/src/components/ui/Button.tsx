import type {ButtonHTMLAttributes,ReactNode} from 'react'
type Props=ButtonHTMLAttributes<HTMLButtonElement>&{children:ReactNode;variant?:'primary'|'secondary'|'danger'|'ghost'}
export function Button({children,className='',variant='primary',...props}:Props){
  const v={primary:'bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-lg shadow-violet-200/60 hover:-translate-y-0.5 hover:shadow-xl',secondary:'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50',danger:'border border-red-200 bg-red-50 text-red-700 hover:bg-red-100',ghost:'bg-transparent text-slate-600 hover:bg-slate-100'}[variant]
  return <button className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${v} ${className}`} {...props}>{children}</button>
}
