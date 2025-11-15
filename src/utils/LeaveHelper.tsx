import type { TableColumn } from "react-data-table-component";
import { useNavigate } from "react-router-dom"
import type { LeavesRow } from "../components/Types/type";




export const columns: TableColumn<LeavesRow>[] = [
    {
        name: 'S No',
        selector: (row) => row.sno, 
        width:"40px"
    },
    {
        name: 'Emp ID',
        selector: (row) => row.employeeId,
        width:"120px"
    },
    {
        name: 'Name',
        selector: (row) => row.name, 
        width:"140px",
        sortable: true
    },
    {
        name: 'Leave Type',
        selector: (row) => row.leaveType,
        width:"140px",
    },
    {
        name: 'Department',
        selector: (row) => row.department, 
        width:"170px"
    },
    {
        name: 'Days',
        selector: (row) => row.days,
        width:'80px',
    },
    {
        name: 'Status',
        selector: (row) => row.status,
        width:'120px',
    },
    {
        name: 'Action',
        cell: (row) => row.action,
    }
];

export const LeaveButtons = ({Id}:any)=> {
    const navigate = useNavigate();
    
    const handleView = (id:any)=>{
        navigate(`/admin-dashboard/leaves/${id}`)
    };
    return(
        <button className="px-4 py-1 bg-teal-500 rounded text-white hover:bg-teal-600" onClick={()=> handleView(Id)}>View</button>
    )
}