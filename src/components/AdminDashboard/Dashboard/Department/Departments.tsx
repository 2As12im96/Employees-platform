import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { useEffect } from "react";
import ConfirmationModal from "./ConfirmationModel";
import useDepartment from "../../../Hooks/department.logic";
import LoadingPage from "../../../pages/Loading";

function Departments() {
    const { departments , deplaoding , deleteItem , filteredDepartment , closeDeleteModal , handleConfirmDelete , memoizedColumns , fetchDepartments , filterDepartments} = useDepartment();
    
    useEffect(() => {
        fetchDepartments();
    }, []);

    console.log(filteredDepartment);
    return (
        <>
            {deplaoding ?
                <LoadingPage />
                :
                <>
                    {deleteItem && ( 
                      <ConfirmationModal
                          onClose={closeDeleteModal}
                          onConfirm={handleConfirmDelete}
                          message={`Are you sure you want to delete department Name: ${deleteItem.name}?`}
                      />
                    )}

                    <div className="p-5">
                        <div className='text-center'>
                            <h1 className="text-2xl font-bold p-4">Manage Departments</h1>
                        </div>
                        <div className='flex justify-between item-center'>
                            <input type="text" placeholder="Search By Dep Name" className="w-100 px-4 py-0.5 border" onChange={filterDepartments} />
                            <Link to='/admin-dashboard/add-department' className='px-4 py-1 bg-teal-600 rounded text-white hover:bg-teal-700 transition'>Add New Department</Link>
                        </div>
                        <div className="mt-4">
                            <DataTable columns={memoizedColumns} data={departments} pagination/>
                        </div>
                    </div>
                </>
            }
        </>
    )
}

export default Departments