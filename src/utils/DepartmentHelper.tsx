import type { TableColumn } from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import type { DepartmentButtonsProps, DepartmentRow } from "../components/Types/type";



export const columns: TableColumn<DepartmentRow>[] = [
    {
        name: 'S No',
        selector: (row) => row.sno
    },
    {
        name: 'Deparment Name',
        selector: (row) => row.dep_name,
        sortable:true
    },
    {
        name: 'Action',
        cell: (row) => row.action,
        ignoreRowClick: true, 
    }
];

export const DepartmentButtons = ({ DepId, DepName, onOpenModal }: DepartmentButtonsProps) => {
    const navigate = useNavigate();

    return (
        <div className="flex space-x-3">
            <button
                className="bg-blue-500 text-white px-5 py-1 rounded mr-2 hover:bg-blue-600 transition w-20 h-8"
                onClick={() => navigate(`/admin-dashboard/department/${DepId}`)}
            >
                Edit
            </button>
            <button
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                onClick={() => onOpenModal(DepId, DepName)}
            >
                Delete
            </button>
        </div>
    )
}