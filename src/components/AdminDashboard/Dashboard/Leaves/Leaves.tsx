import { useEffect } from "react"
import { columns } from "../../../../utils/LeaveHelper";
import DataTable from "react-data-table-component";
import type { LeavesRow } from "../../../Types/type";
import LoadingPage from "../../../pages/Loading";
import useLeave from "../../../Hooks/leave.logic";


function Leaves() {
    const { filteredLeave , loading , error , fetchLeaves , filterByInput , filterByButton} = useLeave();
    useEffect(()=>{
      fetchLeaves();
    },[]);

    return (
      <>
          {loading ? 
            (
                <LoadingPage />
            ):
            (
                <div className="p-6">
                    <div className="text-center">
                        <h3 className="text-2xl font-bold">Manage Leaves</h3>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-6 gap-4 ">
                        <input type="text" placeholder="Search By Emp Id" className="px-4 py-0.5 border w-full md:w-auto" onChange={filterByInput}/>
                        <div className="flex space-x-3 w-full md:w-auto justify-between md:justify-end ">

                            <button className="px-2 py-1 bg-gray-500 text-white hover:bg-gray-600 rounded rounded-md" 
                            onClick={()=> filterByButton('All')}>All</button>

                            <button className="px-2 py-1 bg-teal-600 text-white hover:bg-teal-700 rounded rounded-md" 
                            onClick={()=> filterByButton('Pending')}>Pending</button>

                            <button className="px-2 py-1 bg-teal-600 text-white hover:bg-teal-700 rounded rounded-md" 
                            onClick={()=> filterByButton('Approved')}>Approved</button>

                            <button className="px-2 py-1 bg-teal-600 text-white hover:bg-teal-700 rounded rounded-md" 
                            onClick={()=> filterByButton('Rejected')}>Rejected</button>
                        </div>
                    </div>
                    <div className="mt-3 overflow-x-auto"> 
                        <DataTable<LeavesRow> columns={columns} data={filteredLeave} pagination/>
                   </div>
                    {error && 
                      <div className="text-center">
                        <p className="font-medium text-black-600">No record</p>
                      </div>
                    }
                </div>
            )
          }
      </>
    )
}

export default Leaves
