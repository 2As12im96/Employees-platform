import { useEffect } from "react"
import { Link } from "react-router-dom"
import type {EmployeeRow} from "../../../Types/type";
import DataTable from "react-data-table-component";
import LoadingPage from "../../../pages/Loading";
import useEmployee from "../../../Hooks/employee.logic";

function Employee() {
    const {emplaoding , filteredEmployee , memoizedColumns , fetchEmployee , handleFilter} = useEmployee();
    useEffect(() => {
        fetchEmployee();
    }, []);
    
    return (
      <>
        {emplaoding ? 
            <LoadingPage />
            :   
            <div className="p-5">
                <div className='text-center'>
                    <h1 className="text-2xl font-bold p-4">Manage Empolyee</h1>
                </div>
                <div className='flex justify-between item-center'>
                    <input type="text" placeholder="Search By Dep Name" className="w-100 px-4 py-0.5 border" onChange={handleFilter} />
                    <Link to='/admin-dashboard/add-employees' className='px-4 py-1 bg-teal-600 rounded text-white hover:bg-teal-700 transition'>Add New Empolyee</Link>
                </div>
                <div className="mt-4 overflow-x-auto">
                    <DataTable<EmployeeRow> columns={memoizedColumns} data={filteredEmployee} pagination/>
                </div>
            </div>
        }
      </>
    )
}

export default Employee
