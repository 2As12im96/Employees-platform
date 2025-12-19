import { useState } from 'react'
import type { SummaryDate } from '../Types/type';
import axios from 'axios';
import { Url } from '../../utils/Url';

function useSummeryLogic() {
    const [summary , setSummary] = useState<SummaryDate | null>();
    const [error , setError] = useState<Boolean>(false);
    const [Loading , setLoading] = useState<boolean>(false);

    const fetchSummary = async()=>{
        setLoading(true);
        try{
            const res:any = await axios.get(`${Url}/dashboard/summary` , {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            })
            setSummary(res.data)
            setLoading(false);
        }
        catch(err:any){
            if(err.res.data.error){
                setError(err)
            }
            setLoading(false);
            console.log(err.message);
        }
        finally{
            setLoading(false);
        }
    }
    return {
        summary , 
        setSummary , 
        error ,
        setError , 
        Loading , 
        setLoading , 
        fetchSummary 
    }
}

export default useSummeryLogic
