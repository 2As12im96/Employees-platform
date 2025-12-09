import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Url } from "../../../../utils/Url";
import React from "react";

interface AdminUser {
    _id: string;
    name: string;
    email: string;
    role: string;
    profileImage: string;
    createdAt: string;
}

const AdminDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>(); 
    const [admin, setAdmin] = useState<AdminUser | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
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
        if (id) {
            fetchAdminDetails();
        }
    }, [id]);

    if (loading) {
        return <div className="p-5 text-center">Loading Admin Details...</div>;
    }

    if (!admin) {
        return <div className="p-5 text-center text-red-600">Admin Not Found.</div>;
    }

    return (
        <div className="p-5 max-w-4xl mx-auto bg-white shadow-lg rounded-lg mt-10">
            <h2 className="text-3xl font-bold mb-6 text-teal-600 border-b pb-2">Admin Profile: {admin.name}</h2>
            <div className="flex flex-col md:flex-row items-start gap-8">
                <div className="md:w-1/3">
                    <img 
                        src={admin.profileImage || 'default-avatar.png'} 
                        alt={admin.name} 
                        className="w-full h-auto rounded-lg shadow-md object-cover"
                    />
                </div>
                <div className="md:w-2/3 space-y-4">
                    <p className="text-lg">
                        <span className="font-semibold text-gray-700">Name:</span> {admin.name}
                    </p>
                    <p className="text-lg">
                        <span className="font-semibold text-gray-700">Email:</span> {admin.email}
                    </p>
                    <p className="text-lg">
                        <span className="font-semibold text-gray-700">Role:</span> <span className="text-red-500 font-bold uppercase">{admin.role}</span>
                    </p>
                    <p className="text-lg">
                        <span className="font-semibold text-gray-700">Account Created:</span> {new Date(admin.createdAt).toLocaleDateString()}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default AdminDetails;