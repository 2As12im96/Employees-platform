import { useState } from 'react';
import AdminSideBar from '../components/AdminDashboard/Dashboard/SideBar/AdminSideBar';
import Navbar from '../components/AdminDashboard/Dashboard/Navbar/Navbar';


function AdminDashboardLayout() {
    
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <AdminSideBar 
                isOpen={isSidebarOpen} 
                toggleSidebar={toggleSidebar} 
            />
            <div className={`
                flex flex-col flex-1 overflow-y-auto 
                
                // 🚨 التعديل الرئيسي هنا: 
                // إزاحة المحتوى (بما في ذلك الـ Navbar) بمقدار w-64 فقط في الشاشات الكبيرة.
                lg:ml-64 
            `}>
                <Navbar 
                    toggleSidebar={toggleSidebar} 
                />
                <main className="p-4">
                    محتوى لوحة التحكم
                </main>
            </div>
        </div>
    );
}

export default AdminDashboardLayout;