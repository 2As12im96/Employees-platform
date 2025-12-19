import { useEffect } from "react"
import styles from '../../../Authentication/Login/login.module.css';
import LoadingPage from "../../../pages/Loading";
import useEmployee from "../../../Hooks/employee.logic";


function EditEmployee() {
    const { error , employee , departments , empLoading , getDepartments , fetchEmployeeData , handleEditChange , handleSubmit} = useEmployee();
    useEffect(()=>{
        getDepartments();
    },[]);

    useEffect(()=>{ 
        fetchEmployeeData();
    },[]);
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
                            <input type="text" name='name' value={employee.name} placeholder='Insert Name' id='Name' className='mt-1 p-2 block w-full border border-gray-300 rounded-md' onChange={handleEditChange} required/>
                        </div>
                        {/* Phone Number */}
                        <div>
                            <label htmlFor="Phone" className="block text-sm font-medium text-gray-700 cursor-pointer">Phone Number</label>
                            <input type="phone" name='phoneNumber' value={employee.phoneNumber} placeholder='Insert Phone Number' id='Phone' className='mt-1 p-2 block w-full border border-gray-300 rounded-md' onChange={handleEditChange} required/>
                        </div>
                        {/* Martial Status */}
                        <div>
                            <label htmlFor="Martial" className='block text-sm font-medium text-gray-700 cursor-pointer'>Martial Status</label>
                            <select name="maritalStatus" id='Martial' className="mt-1p-2 block w-full border border-gray-300 rounded-md" value={employee.maritalStatus} onChange={handleEditChange} required>
                                <option value="">Select Status</option>
                                <option value="Single">Single</option>
                                <option value="Married">Married</option>
                            </select>
                        </div>
                        {/* Designation */}
                        <div>
                            <label htmlFor="Designation" className='block text-sm font-medium text-gray-700 cursor-pointer'>Designation</label>
                            <input type="text" name="designation" placeholder="Designation" id='Designation' className="mt-1 p-2 block w-full border border-gray-300 rounded-md" value={employee.designation} onChange={handleEditChange} required/>
                        </div>
                        {/* Salary */}
                        <div>
                            <label htmlFor="Salary" className='block text-sm font-medium text-gray-700 cursor-pointer'>Salary</label>
                            <input type="number" name="salary" placeholder="Salary" id='Salary' className="mt-1 p-2 block w-full border border-gray-300 rounded-md" 
                            value={employee.salary}
                            onChange={handleEditChange} required/>
                        </div>
                        {/* Department */}
                        <div className="col-span-2">
                            <label htmlFor="Department" className='block text-sm font-medium text-gray-700 cursor-pointer'>Department</label>
                            <select name="department" id='Department' className="mt-1p-2 block w-full border border-gray-300 rounded-md" onChange={handleEditChange} required>
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
            <LoadingPage />
            }
        </>
    )
}

export default EditEmployee
