import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { AdminRow, AdminUser } from "../Types/type";
import axios from "axios";
import { Url } from "../../utils/Url";

function useAdminLogic(){
    const { id } = useParams<{ id: string }>(); 
    const [admin, setAdmin] = useState<AdminUser | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [admins, setAdmins] = useState<AdminRow[]>([]);
    const [filteredAdmins, setFilteredAdmins] = useState<AdminRow[]>([]);

    const fetchAdminDetails = async () => {
        setLoading(true);
        try {
            const res = await axios.get<{ success: boolean; admin: AdminUser }>(`${Url}/admins/${id}`, { 
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (res.data.success) {
                setAdmin(res.data.admin);
            }
        } catch (err: any) {
            alert(err.response?.data?.message || "Error fetching admin details");
        } finally {
            setLoading(false);
        }
    };

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


    const handleFilter = (e: React.ChangeEvent<HTMLInputElement>)=>{
        const searchTerm = e.target.value.toLowerCase();
        const records = admins.filter((admin) => {
            return admin.name.toLowerCase().includes(searchTerm) || admin.email.toLowerCase().includes(searchTerm);
        });
        setFilteredAdmins(records);
    };

    return { id , admin , setAdmin , loading , setLoading , fetchAdminDetails , fetchAdmins , handleFilter , filteredAdmins}
}
export default useAdminLogic