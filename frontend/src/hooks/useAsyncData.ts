import {useCallback,useEffect,useState} from 'react'
export function useAsyncData<T>(loader:()=>Promise<T>,deps:unknown[]=[]){
  const [data,setData]=useState<T|null>(null),[loading,setLoading]=useState(true),[error,setError]=useState('')
  const refresh=useCallback(async()=>{setLoading(true);setError('');try{setData(await loader())}catch(err){setError(err instanceof Error?err.message:'Unable to load data')}finally{setLoading(false)}},deps)
  useEffect(()=>{refresh()},[refresh]);return{data,setData,loading,error,refresh}
}
