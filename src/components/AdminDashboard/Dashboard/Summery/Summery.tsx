import { useEffect, useState } from "react";
import SummeryCard from "./SummeryCard"
import { faBuilding, faCheckCircle, faFileAlt, faHourglassHalf, faMoneyBillWave, faTimesCircle, faUsers } from "@fortawesome/free-solid-svg-icons"
import axios from "axios";
import { Url } from "../../../../utils/Url";

interface SummaryDate {
    totalDepartments:number,
    totalEmployees:number,
    totalSalary:number,
    leaveSummary:{
        appliedFor:number,
        approved:number,
        pending:number,
        rejected:number,
    }
}
function Summery() {
    const [summary , setSummary] = useState<SummaryDate | null>();
    const [error , setError] = useState<Boolean>(false);
    const [Loading , setLoading] = useState<boolean>(false);

    useEffect(()=>{
        const fetchSummary = async()=>{
            setLoading(true);
            try{
                const res:any = await axios.get(`${Url}/dashboard/summary` , {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('token')}`
                    }
                })
                console.log(res.data);
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
        fetchSummary()
    },[]);
    return (
      <>
        {Loading ? 
          <div className="fixed inset-0 bg-white/80 flex items-center justify-center z-50">
              <svg className="animate-spin h-10 w-10 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="ml-3 text-lg text-gray-700">Loading...</span>
          </div> :        
          <div className="p-6">
            {!error ? 
            <div className="summary-data">
                <h1 className="text-2xl font-bold">Dashboard Overview</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    
                    <SummeryCard icon={faUsers} text={'Total Employee'} number={summary?.totalEmployees} color={'bg-teal-600'}/>

                    <SummeryCard icon={faBuilding} text={'Total Departments'} number={summary?.totalDepartments} color={'bg-yellow-600'}/>
                    
                    <SummeryCard icon={faMoneyBillWave} text={'Monthly Sallary'} 
                    number={'$ ' + summary?.totalSalary} color={'bg-red-600'}/>

                </div>
                <div className="mt-12">
                    <h4 className="text-start text-2xl font-bold">Leave Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        
                        <SummeryCard icon={faFileAlt} text={'Leave Applied'} number={summary?.leaveSummary.appliedFor} color={'bg-teal-600'}/>
                        
                        <SummeryCard icon={faCheckCircle} text={'Leave Approved'} number={summary?.leaveSummary.approved} color={'bg-green-600'}/>
                        
                        <SummeryCard icon={faHourglassHalf} text={'Leave Pending'} number={summary?.leaveSummary.pending} color={'bg-yellow-600'}/>
                        
                        <SummeryCard icon={faTimesCircle} text={'Leave Rejected'} number={summary?.leaveSummary.rejected} color={'bg-red-600'}/>

                    </div>
                </div>
            </div>
            :
            <div className="text-center">
                <p className="text-red-600">No record please try again</p>
            </div>
            }
          </div>
    } 
      </>
    )
}

export default Summery
