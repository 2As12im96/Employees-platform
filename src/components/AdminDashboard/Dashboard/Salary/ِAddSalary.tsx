import { useEffect, useState } from "react"
import type { DepartmentRow, EmployeeRow } from "../../../Types/type";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from '../../../Authentication/Login/login.module.css';
import { fetchEmployees, getEmployees } from "../../../../utils/EmployeeHelper";
import { Url } from "../../../../utils/Url";



function Salary() {
    const [salary  , setSalary] = useState({
        employeeId:null,
        basicSalary:0,
        allowances:0,
        deductions:0,
        salary:0,
        payDate:null
    });
    const [employees  , setEmployees] = useState<EmployeeRow[]>([]);
    const [departments  , setDepartments] = useState<DepartmentRow[] | null>(null);
    const [empLoading , setEmpLaoding] = useState<boolean>(false);
    const [error , setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(()=>{
        const getDepartments = async () => {
            const departments = await fetchEmployees();
            setDepartments(departments);
        };
        getDepartments();
    },[]);

 
    const handleDepartment = async(e: React.ChangeEvent<HTMLSelectElement>)=>{ 
      const emps = await getEmployees(e.target.value); 
      setEmployees(emps)
    }

    const handleChange = (e:any)=> {
        const {name , value } = e.target;
        setSalary((prevData)=>( {...prevData , [name] : value}))
    }


    const handleSubmit = async(e:any)=>{
        e.preventDefault();
        setEmpLaoding(true)
        try{
            const res = await axios.post(`${Url}/salary/add` , salary ,{
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
            {departments ? (
            <div className='max-w-6xl mx-auto mt-10 bg-white p-8 rounded-md shadow'>
                <h2 className="text-2xl font-bold mb-6">Add Sallary</h2>
                <form onSubmit={handleSubmit}>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        {/* Department */}
                        <div>
                            <label htmlFor="Department" className='block text-sm font-medium text-gray-700 cursor-pointer'>Department</label>
                            <select 
                            name="department" 
                            id='Department' 
                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md" 
                            onChange={handleDepartment} 
                            required>
                                <option value="">Select Department</option>
                                {departments.map(dep =>(
                                    <option key={dep._id} value={dep._id}>{dep.dep_name}</option>
                                ))}
                            </select>
                        </div>
                        {/* Employee */}
                        <div>
                            <label htmlFor="Employee" className='block text-sm font-medium text-gray-700 cursor-pointer'>Employee</label>
                            <select 
                            name="employeeId" 
                            id='Employee' 
                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md" 
                            onChange={handleChange} 
                            required>
                                <option value="">Select Employee</option>
                                {employees && employees.map(emp =>(
                                    <option key={emp._id} value={emp._id}>{emp.employeeId}</option>
                                ))}
                            </select>
                        </div>
                        {/* Salary */}
                        <div>
                            <label htmlFor="Designation" className='block text-sm font-medium text-gray-700 cursor-pointer'>Basic Salary</label>
                            <input 
                            type="number" 
                            name="basicSalary" 
                            placeholder="Basic Salary" 
                            id='Designation' 
                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"  
                            onChange={handleChange} 
                            required/>
                        </div>
                        {/* Allowences */}
                        <div>
                            <label htmlFor="Allowences" className='block text-sm font-medium text-gray-700 cursor-pointer'>Allowences</label>
                            <input 
                            type="number" 
                            name="allowances" 
                            placeholder="Allowences" 
                            id='Allowences' 
                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md" 
                            onChange={handleChange} 
                            required/>
                        </div>
                        {/* Deductions */}
                        <div>
                            <label htmlFor="Deductions" className='block text-sm font-medium text-gray-700 cursor-pointer'>Deductions</label>
                            <input 
                            type="number"
                            name="deductions" 
                            placeholder="Deductions" 
                            id='Deductions' 
                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md" 
                            onChange={handleChange} 
                            required/>
                        </div>
                        {/* Pay Date */}
                        <div>
                            <label htmlFor="PayDate" className='block text-sm font-medium text-gray-700 cursor-pointer'>Pay Date</label>
                            <input 
                            type="date" 
                            name="payDate" 
                            id='PayDate' 
                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md" 
                            onChange={handleChange} 
                            required/>
                        </div>
                    </div>
                    <button type="submit" className='w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md'>
                        {empLoading ? <span className={styles.loader}></span> : <span>Add Salary</span>}
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

export default Salary
