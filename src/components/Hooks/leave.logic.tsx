import { useState } from "react";
import type { LeaveDetailsRow, LeavesRow } from "../Types/type";
import axios from "axios";
import { Url } from "../../utils/Url";
import { LeaveButtons } from "../../utils/LeaveHelper";
import { useNavigate, useParams } from "react-router-dom";


function useLeave() {
    const [leaves , setLeaves] = useState<LeavesRow[]>([]);
    const [filteredLeave , setFilteredLeave] = useState<LeavesRow[]>([]);
    const [loading , setLoading] = useState<boolean>(false);
    const [error , setError] = useState<string | boolean>(false);
    const { id } = useParams<{ id?: string }>();
    const [leave, setLeave] = useState<LeaveDetailsRow | null>(null);
    const navigate = useNavigate();


    const fetchLeaves = async()=>{
        setLoading(true);
        try{
            const res = await axios.get(`${Url}/leave` , {
              headers:{
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            })
            if(res.data.success){
              let sno = 1;
              const data = await res.data.leaves.map((leave:any)=> ({
                  _id: leave._id,
                  sno: sno++,
                  employeeId: leave.employeeId.employeeId,
                  name: leave.employeeId.userId.name,
                  leaveType: leave.leaveType,
                  department: leave.employeeId.department.dep_name,
                  days: new Date(leave.endDate).getDate() - new Date(leave.startDate).getDate(),
                  status:leave.status,
                    action: (<LeaveButtons Id={leave._id}/>),
              }));
              setLeaves(data);
              setFilteredLeave(data);
              setLoading(false);
            }
        }catch(err:any){
            if(err.res && !err.res.data.success){
                setLoading(false);
                setError(true);
            }
        }
        finally{
          setLoading(false);
        }
    }

    const filterByInput = (e: React.ChangeEvent<HTMLInputElement>)=>{
        const searchTerm = e.target.value.toLowerCase();
        const data = leaves.filter(leave => 
          leave.employeeId.toLowerCase().includes(searchTerm)
        );
        setFilteredLeave(data);
    }

    const filterByButton = (status: string) => {
        if (status === 'All') {
            setFilteredLeave(leaves);
            return;
        }
        const data = leaves.filter(leave => 
          leave.status.toLowerCase() === status.toLowerCase()
        );
        setFilteredLeave(data);
    }

    const fetchLeave = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const res = await axios.get(`${Url}/leave/detail/${id}`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (res.data.success && res.data.leave) {
                setLeave(res.data.leave);
            } else {
                setError('No leave record found.');
            }
        }
        catch (err: any) {
            if (err.response && err.response.data) {
                setError(err.response.data.err || 'Failed to fetch leave details.');
            } else {
                setError('Failed to fetch data due to a network error.');
            }
        }
        finally {
            setLoading(false);
        }
    }

    const changeStatus = async (leaveId: string, status: 'Approved' | 'Rejected') => {
        try {
            const res = await axios.put(`${Url}/leave/${leaveId}`, { status }, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (res.data.success) {
                navigate('/admin-dashboard/leaves');
            }
        }
        catch (err: any) {
            if (err.response && err.response.data) {
                 setError(err.response.data.message || 'Failed to update status.');
            } else {
                 setError('Network error or unknown failure.');
            }
        }
    }
    return { filteredLeave , loading , error , fetchLeaves , filterByInput , filterByButton , id , leave , setLeave , fetchLeave , changeStatus}
}

export default useLeave
