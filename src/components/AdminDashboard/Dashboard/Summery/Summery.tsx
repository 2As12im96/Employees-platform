import { useEffect } from "react";
import SummeryCard from "./SummeryCard"
import { faBuilding, faCheckCircle, faFileAlt, faHourglassHalf, faMoneyBillWave, faTimesCircle, faUsers } from "@fortawesome/free-solid-svg-icons"
import useSummeryLogic from "../../../Hooks/summery.logic";
import LoadingPage from "../../../pages/Loading";


function Summery() {
    const { summary , error , Loading , fetchSummary } = useSummeryLogic();
    useEffect(()=>{
        fetchSummary()
    },[]);
    return (
      <>
        {Loading ? 
          <LoadingPage />
          :        
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
