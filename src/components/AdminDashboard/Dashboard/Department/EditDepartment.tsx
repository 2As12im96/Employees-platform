import { useEffect } from "react";
import useDepartment from "../../../Hooks/department.logic";
import LoadingPage from "../../../pages/Loading";


function EditDepartment() {
    const { deplaoding , editDepartment ,  fetchDepartment , handleEditChange , handleEditSubmit } = useDepartment();
    useEffect(()=> {
        fetchDepartment();
    },[]);
    
    return (
        <>
            {deplaoding ? 
            <LoadingPage />
            :
            <div className="max-w-3xl mx-auto mt-30 bg-white p-8 rounded-md shadow-md w-150">
                <div>
                    <h2 className="text-2xl font-bold mb-6">Edit Department</h2>
                    <form onSubmit={handleEditSubmit}>
                        <div>
                            <label htmlFor='dep_name' className="text-sm font-medium text-gray-700">Department Name</label>
                            <input id='dep_name' name='dep_name' type="text" placeholder="Enter Dep Name" className="mt-1 w-full p-2 border border-gray-300 rounded-md" onChange={handleEditChange} value={editDepartment.dep_name} required/>
                        </div>
                        <div className="mt-3">
                            <label htmlFor='description' className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea id='description' name='description' placeholder="Enter Description" className="mt-1 p-2 block w-full border border-gray-300 rounded-md" onChange={handleEditChange} value={editDepartment.description}></textarea>
                        </div>
                        <button type="submit" className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded">Edit Department</button>
                    </form>
                </div>
            </div>
            }
        </>
    )
}

export default EditDepartment
