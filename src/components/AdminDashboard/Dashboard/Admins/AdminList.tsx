import React from "react";
import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import DataTable, { type TableColumn } from "react-data-table-component";
import { Url } from "../../../../utils/Url";
import type { AdminRow } from "../../../Types/type";




const adminColumns: TableColumn<AdminRow>[] = [
    { name: '#', selector: (row: AdminRow) => row.sno, sortable: true, width: '60px' },
    { 
        name: 'Image', 
        cell: (row: AdminRow) => (
            <img src={row.profileImage || 'default-image.png'} alt={row.name} className="h-10 w-10 rounded-full object-cover" />
        ), 
        width: '80px' 
    },
    { name: 'Name', selector: (row: AdminRow) => row.name, sortable: true },
    { name: 'Email', selector: (row: AdminRow) => row.email, sortable: true },
    { 
        name: 'Actions', 
        cell: (row: AdminRow) => row.action, 
        ignoreRowClick: true, 
        allowOverflow: true, 
        button: true, 
        width: '120px' 
    }
];

const AdminList: React.FC = () => {
    const [admins, setAdmins] = useState<AdminRow[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [filteredAdmins, setFilteredAdmins] = useState<AdminRow[]>([]);

    const fetchAdmins = async () => {
        setLoading(true);
        try {
            const res = await axios.get<{ success: boolean; admins: any[] }>(`${Url}/admins`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (res.data.success) {
                let sno = 1;
                const data: AdminRow[] = res.data.admins.map((admin: any) => ({
                    _id: admin._id,
                    sno: sno++,
                    name: admin.name,
                    email: admin.email,
                    profileImage: admin.profileImage,
                    action: (
                        <Link to={`/admin-dashboard/admin-details/${admin._id}`} className='w-20 bg-green-500 text-white text-center px-5 py-1 rounded mr-2 hover:bg-green-700 transition w-20 h-8'>
                            View
                        </Link>
                    )
                }));
                setAdmins(data);
                setFilteredAdmins(data);
            }
        } catch (err: any) {
            alert(err.response?.data?.message || "Error fetching admin data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    const memoizedColumns = useMemo(() => adminColumns, []);

    const handleFilter = (e: React.ChangeEvent<HTMLInputElement>)=>{
        const searchTerm = e.target.value.toLowerCase();
        const records = admins.filter((admin) => {
            return admin.name.toLowerCase().includes(searchTerm) || admin.email.toLowerCase().includes(searchTerm);
        });
        setFilteredAdmins(records);
    };

    return (
        <>
            {loading ? 
                <div className="fixed inset-0 bg-white/80 flex items-center justify-center z-50">
                    <svg className="animate-spin h-10 w-10 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="ml-3 text-lg text-gray-700">Loading...</span>
                </div> 
                :
                <div className="p-5">
                    <div className='text-center'>
                        <h1 className="text-2xl font-bold p-4">Manage Admins</h1>
                    </div>
                    <div className='flex justify-between items-center'>
                        <input 
                            type="text" 
                            placeholder="Search By Name or Email" 
                            className="w-100 px-4 py-0.5 border" 
                            onChange={handleFilter} 
                        />
                        <Link to='/admin-dashboard/add-employees' className='px-4 py-1 bg-teal-600 rounded text-white hover:bg-teal-700 transition'>Add New Admin</Link>
                    </div>
                    <div className="mt-4 overflow-x-auto">
                        <DataTable<AdminRow> 
                            columns={memoizedColumns} 
                            data={filteredAdmins} 
                            pagination
                        />
                    </div>
                </div>
            }
        </>
    );
}

export default AdminList;