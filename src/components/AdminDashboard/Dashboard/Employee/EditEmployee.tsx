import { useEffect, useState } from "react"
import type { DepartmentRow } from "../../../Types/type";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import styles from '../../../Authentication/Login/login.module.css';
import { Url } from "../../../../utils/Url";
import { fetchEmployees } from "../../../../utils/EmployeeHelper";


function EditEmployee() {
    const [employee  , setEmployee] = useState({
        name:'',
        maritalStatus:'',
        designation:'',
        salary:0,
        department:'',
        phoneNumber:''
    });
    const [departments  , setDepartments] = useState<DepartmentRow[] | null>(null);
    const [empLoading , setEmpLaoding] = useState<boolean>(false);
    const [error , setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const {id} = useParams();

    useEffect(()=>{
        const getDepartments = async () => {
            const departments = await fetchEmployees();
            setDepartments(departments);
        };
        getDepartments();
    },[]);

    useEffect(()=>{
        const fetchEmployee = async () => {
            setEmpLaoding(true);
            try{
                const res = await axios.get(`${Url}/employee/${id}` , {
                    headers:{
                      "Authorization": `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if(res.data.success && res.data.employee){
                    const employee = res.data.employee; 
                    setEmployee((prev)=> ({...prev , 
                        name: employee.userId.name ,
                        maritalStatus: employee.maritalStatus , 
                        designation: employee.designation ,
                        salary: employee.salary ,
                        department: employee.department,
                        phoneNumber: employee.phoneNumber
                    })); 
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
    },[]);

    const handleChange = (e:any)=> {
        const {name , value } = e.target;
        setEmployee((prevData)=>( {...prevData , [name] : value}))
    }

    const handleSubmit = async(e:any)=>{
        e.preventDefault();
        setEmpLaoding(true)
        try{
            const res = await axios.put(`${Url}/employee/${id}` , employee ,{
                headers:{
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if(res.data.success){
                navigate('/admin-dashboard/employees');
            }
        } catch(err: any) {
              setError('Server Error: ' + (err?.message ?? String(err)));
              setEmpLaoding(false);
        }
        finally{
            setEmpLaoding(false);
        }
    }
    return (
        <>
            {departments && employee ? (
            <div className='max-w-6xl mx-auto mt-10 bg-white p-8 rounded-md shadow'>
                <h2 className="text-2xl font-bold mb-6">Edit Employee</h2>
                <form onSubmit={handleSubmit}>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        {/* Name */}
                        <div>
                            <label htmlFor="Name" className="block text-sm font-medium text-gray-700 cursor-pointer">Name</label>
                            <input type="text" name='name' value={employee.name} placeholder='Insert Name' id='Name' className='mt-1 p-2 block w-full border border-gray-300 rounded-md' onChange={handleChange} required/>
                        </div>
                        {/* Phone Number */}
                        <div>
                            <label htmlFor="Phone" className="block text-sm font-medium text-gray-700 cursor-pointer">Phone Number</label>
                            <input type="phone" name='phoneNumber' value={employee.phoneNumber} placeholder='Insert Phone Number' id='Phone' className='mt-1 p-2 block w-full border border-gray-300 rounded-md' onChange={handleChange} required/>
                        </div>
                        {/* Martial Status */}
                        <div>
                            <label htmlFor="Martial" className='block text-sm font-medium text-gray-700 cursor-pointer'>Martial Status</label>
                            <select name="maritalStatus" id='Martial' className="mt-1p-2 block w-full border border-gray-300 rounded-md" value={employee.maritalStatus} onChange={handleChange} required>
                                <option value="">Select Status</option>
                                <option value="Single">Single</option>
                                <option value="Married">Married</option>
                            </select>
                        </div>
                        {/* Designation */}
                        <div>
                            <label htmlFor="Designation" className='block text-sm font-medium text-gray-700 cursor-pointer'>Designation</label>
                            <input type="text" name="designation" placeholder="Designation" id='Designation' className="mt-1 p-2 block w-full border border-gray-300 rounded-md" value={employee.designation} onChange={handleChange} required/>
                        </div>
                        {/* Salary */}
                        <div>
                            <label htmlFor="Salary" className='block text-sm font-medium text-gray-700 cursor-pointer'>Salary</label>
                            <input type="number" name="salary" placeholder="Salary" id='Salary' className="mt-1 p-2 block w-full border border-gray-300 rounded-md" 
                            value={employee.salary}
                            onChange={handleChange} required/>
                        </div>
                        {/* Department */}
                        <div className="col-span-2">
                            <label htmlFor="Department" className='block text-sm font-medium text-gray-700 cursor-pointer'>Department</label>
                            <select name="department" id='Department' className="mt-1p-2 block w-full border border-gray-300 rounded-md" onChange={handleChange} required>
                                <option value="">Select Department</option>
                                {departments.map(dep =>(
                                    <option key={dep._id} value={dep._id}>{dep.dep_name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <button type="submit" className='w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md'>
                        {empLoading ? <span className={styles.loader}></span> : <span>Edit Employee</span>}
                    </button>
                </form>
                {error && <p className="text-red font-bold p-4">{error}</p> || null}
            </div>
            ) : 
            <div className="fixed inset-0 bg-white/80 flex items-center justify-center z-50">
              <svg className="animate-spin h-10 w-10 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="ml-3 text-lg text-gray-700">Loading...</span>
          </div>}
        </>
    )
}

export default EditEmployee
