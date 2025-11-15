import { useNavigate, useParams } from "react-router-dom"
import axios from "axios";
import type { EmployeeRow } from "../../../Types/type";
import { useEffect, useState } from "react";
import { Url } from "../../../../utils/Url";

interface ViewProps {
    userRole: string;
}

function View({ userRole }: ViewProps) {
    const {id} = useParams<{id?: string}>();
    const [employee , setEmployee] = useState<EmployeeRow | null>(null);
    const [ empLoading , setEmpLaoding] = useState<boolean>(false);
    
    const isAdmin = userRole === 'admin'; 

    useEffect(()=> {
        const fetchEmployee = async () => {
            setEmpLaoding(true);
            try{
                const res = await axios.get(`${Url}/employee/${id}` , {
                    headers:{
                        "Authorization": `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if(res.data.success && res.data.employee){ 
                    setEmployee(res.data.employee); 
                }
            }
            catch(err: any){
                if(err.res && err.res.data.success){
                    alert(err.res.data.message);
                }
            }
            finally{
                setEmpLaoding(false);
            }
        }
        fetchEmployee();
    },[id]);
    
    const navigate = useNavigate();
    const handleViewReport = () => {
        if (isAdmin && employee?.employeeId) {
            const currentYear = new Date().getFullYear();
            const currentMonth = new Date().getMonth() + 1;
            navigate(`/admin-dashboard/attendence-report/employee/${employee._id}/${currentYear}/${currentMonth}`); 
        }
    };
    
    return (
        <>
            {empLoading ? 
                <div className="fixed inset-0 bg-white/80 flex items-center justify-center z-50">
                    <svg className="animate-spin h-10 w-10 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="ml-3 text-lg text-gray-700">Loading...</span>
                </div>  :
                <>
                    <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
                        <h2 className="text-2xl font-bold mb-8 text-center">Employee Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <img src={`http://localhost:5000/${employee?.userId?.profileImage}`} className="rounded-full border w-72 h-72 object-cover" alt="Employee Profile" />
                            <div className="p-4">
                                <div className="flex space-x-3 mb-5">
                                    <p className="text-lg font-bold">Employee ID:</p>
                                    <p className="font-medium">{employee?.employeeId}</p>
                                </div>
                                <div className="flex space-x-3 mb-5">
                                    <p className="text-lg font-bold">Name:</p>
                                    <p className="font-medium">{employee?.userId.name}</p>
                                </div>
                                <div className="flex space-x-3 mb-5">
                                    <p className="text-lg font-bold">Phone Number:</p>
                                    <p className="font-medium">
                                        {employee?.phoneNumber}
                                    </p>
                                </div>
                                <div className="flex space-x-3 mb-5">
                                    <p className="text-lg font-bold">Email:</p>
                                    <p className="font-medium">
                                        {employee?.userId.email}
                                    </p>
                                </div>
                                <div className="flex space-x-3 mb-5">
                                    <p className="text-lg font-bold">Date of Birth:</p>
                                    <p className="font-medium">{new Date(employee?.dob ?? '').toLocaleDateString()}</p>
                                </div>
                                <div className="flex space-x-3 mb-5">
                                    <p className="text-lg font-bold">Gender:</p>
                                    <p className="font-medium">{employee?.gender}</p>
                                </div>
                                <div className="flex space-x-3 mb-5">
                                    <p className="text-lg font-bold">Department:</p>
                                    <p className="font-medium">{employee?.department?.dep_name}</p>
                                </div>
                                <div className="flex space-x-3 mb-5">
                                    <p className="text-lg font-bold">Designation:</p>
                                    <p className="font-medium text-blue-600">{employee?.designation}</p>
                                </div>
                                <div className="flex space-x-3 mb-5">
                                    <p className="text-lg font-bold">Salary:</p>
                                    <p className="font-medium text-blue-600">{employee?.salary}</p>
                                </div>
                                <div className="flex space-x-3 mb-5">
                                    <p className="text-lg font-bold">Marital Status:</p>
                                    <p className="font-medium">{employee?.maritalStatus}</p>
                                </div>
                                {isAdmin && (
                                    <div className="mt-8">
                                        <button 
                                            onClick={handleViewReport}
                                            className="w-full py-3 bg-teal-600 text-white font-semibold rounded-md hover:bg-teal-700 transition duration-150 shadow-md"
                                            disabled={!employee} 
                                        >
                                            Attendance Report
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            }
        </>
    )
}

export default View