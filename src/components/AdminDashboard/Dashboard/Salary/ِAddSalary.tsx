import { useEffect } from "react"
import styles from '../../../Authentication/Login/login.module.css';
import useSalary from "../../../Hooks/salary.logic";
import LoadingPage from "../../../pages/Loading";

function Salary() {
    const { employees , departments , empLoading , error , getDepartments , handleDepartment , handleChange , handleSubmit} = useSalary();

    useEffect(()=>{
        getDepartments();
    },[]);
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
            <LoadingPage />
            }
        </>
    )
}

export default Salary
