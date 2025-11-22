import { useNavigate, useParams } from "react-router-dom"
import axios from "axios";
import type { LeaveDetailsRow } from "../../../Types/type";
import { useEffect, useState } from "react";
import { Url } from "../../../../utils/Url";

function LeaveDetails() {
    const { id } = useParams<{ id?: string }>();

    const [leave, setLeave] = useState<LeaveDetailsRow | null>(null);
    const [loading, setLaoding] = useState<boolean>(false);
    const [error, setError] = useState<boolean | string>(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLeave = async () => {
            if (!id) return;
            setLaoding(true);
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
                setLaoding(false);
            }
        }
        fetchLeave();
    }, [id]);
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
    return (
        <>
            {loading ? 
                <div className="fixed inset-0 bg-white/80 flex items-center justify-center z-50">
                    <svg className="animate-spin h-10 w-10 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="ml-3 text-lg text-gray-700">Loading...</span>
                </div>  :
                <>
                    <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
                        <h2 className="text-2xl font-bold mb-8 text-center">Leave Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <img src={`${leave?.employeeId.userId.profileImage}`} className="rounded-full border w-72 h-72 object-cover mt-1" alt="" />
                            <div className="p-4">
                                <div className="flex space-x-3 mb-5">
                                    <p className="text-lg font-bold">Name:</p>
                                    <p className="font-medium mt-1">{leave?.employeeId.userId.name}</p>
                                </div>
                                <div className="flex space-x-3 mb-5">
                                    <p className="text-lg font-bold">Employee ID:</p>
                                    <p className="font-medium mt-1">{leave?.employeeId.employeeId}</p>
                                </div>
                                <div className="flex space-x-3 mb-5">
                                    <p className="text-lg font-bold">Leave Type:</p>
                                    <p className="font-medium mt-1">{leave?.leaveType}</p>
                                </div>
                                <div className="flex space-x-3 mb-5">
                                    <p className="text-lg font-bold">Department:</p>
                                    <p className="font-medium mt-1">{leave?.employeeId.department.dep_name}</p>
                                </div>
                                <div className="flex space-x-3 mb-5">
                                    <p className="text-lg font-bold">Start Date:</p>
                                    <p className="font-medium text-blue-600 mt-1">{new Date(leave?.startDate ?? '').toLocaleDateString()}</p>
                                </div>
                                <div className="flex space-x-3 mb-5">
                                    <p className="text-lg font-bold">End Date:</p>
                                    <p className="font-medium text-blue-600 mt-1">{new Date(leave?.endDate ?? '').toLocaleDateString()}</p>
                                </div>
                                <div className="flex space-x-3 mb-5">
                                    <p className="text-lg font-bold">
                                        {leave?.status === 'Pending' ? 'Action:' : 'Status:'}
                                    </p>
                                    {leave?.status === 'Pending' ?
                                        (
                                            <div className="flex space-x-2">
                                                <button className="rounded rounded-md px-2 py-0.5 bg-teal-300 hover:bg-teal-400 text-white" onClick={() => changeStatus(leave._id, 'Approved')}>Approve</button>
                                                <button className="rounded rounded-md px-2 py-0.5 bg-red-300 hover:bg-red-400 text-white" onClick={() => changeStatus(leave._id, 'Rejected')}>Reject</button>
                                            </div>
                                        ) :
                                        (
                                            <p className="font-medium mt-1">{leave?.status}</p>
                                        )
                                    }
                                    
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                            <div className="flex space-x-3 mb-5">
                                <p className="text-lg font-bold">Reason:</p>
                                <p className="font-medium mt-1">{leave?.reason}</p>
                            </div>
                        </div>

                        {error && 
                            <div className="text-center">
                                <p className="font-medium text-black-600">No record</p>
                            </div>
                        }
                    </div>
                </>
            }  
        </>
    )
}

export default LeaveDetails
