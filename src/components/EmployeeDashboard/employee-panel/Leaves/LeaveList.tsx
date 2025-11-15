import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"
import type { Leave } from "../../../Types/type";
import { Url } from "../../../../utils/Url";
import { useAuth } from "../../../Context/Context";



function LeaveList() {
    const [leaves , setLeaves] = useState<Leave[] | null>(null);
    let sno = 1;
    const [loading , setLoading] = useState<boolean>(false);
    const {id} = useParams();
    const {user} = useAuth();

    const fetchLeaves = async()=>{
        const employeeUserId = user?._id;
        if (!employeeUserId) {
            setLoading(false);
            console.error("User ID not available for fetching leaves.");
            return;
        }
        try{
            const res = await axios.get(`${Url}/leave/${id}` , {
                headers:{
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                }
            })
            if(res.data.success){
                setLeaves(res.data.leaves);
            }
        }catch(err:any){
            if(err.res && !err.res.data.success){
                console.error(err.message);
            }
        }
        finally{
            setLoading(false);
        }
    }
    useEffect(()=>{
        fetchLeaves();
    },[user?._id]);
    return (
        <>
        {loading ? 
            (
                <div className="fixed inset-0 bg-white/80 flex items-center justify-center z-50">
                    <svg className="animate-spin h-10 w-10 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="ml-3 text-lg text-gray-700">Loading...</span>
                </div>
            ) :
            (
                <div className="overflow-x-auto p-6 ">
                    <div className="text-center">
                        <h3 className="text-2xl font-bold">Manage Leaves</h3>
                    </div>
                    <div className="flex justify-between items-center mt-6">
                        <input type="text" placeholder="Search By Dep Name" className="px-4 py-0.5 border w-100"/>
                        {user?.role === 'employee' && (
                            <Link to='/employee-dashboard/add-leaves' className="px-4 py-1 bg-teal-600 rounded text-white">Add New Leave</Link>
                        )}
                        
                    </div>
                    <table className="w-full text-sm text-left text-gray-500 mt-6">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border border-gray-200">
                            <tr>
                                <th className="px-6 py-3 font-bold">SNO</th>
                                <th className="px-6 py-3 font-bold">Leave Type</th>
                                <th className="px-6 py-3 font-bold">From</th>
                                <th className="px-6 py-3 font-bold">TO</th>
                                <th className="px-6 py-3 font-bold">Description</th>
                                <th className="px-6 py-3 font-bold">Applied Date</th>
                                <th className="px-6 py-3 font-bold">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaves?.map((leave)=> (
                                <tr key={leave._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <th className="px-6 py-3">{sno++}</th>
                                    <th className="px-6 py-3">{leave.leaveType}</th>
                                    <th className="px-6 py-3">{new Date(leave.startDate).toLocaleDateString()}</th>
                                    <th className="px-6 py-3">{new Date(leave.endDate).toLocaleDateString()}</th>
                                    <th className="px-6 py-3 max-w-xs truncate">{leave.reason}</th>
                                    
                                    <th className="px-6 py-3">{new Date(leave.appliedAt).toLocaleDateString()}</th>
                                    <th className="px-6 py-3">{leave.status}</th>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )
        }
        </>
    )
}

export default LeaveList
