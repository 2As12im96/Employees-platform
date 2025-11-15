import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ArchiveItem } from '../../Types/type';
import { getAttendanceArchive } from '../../services/AttendanceService';


interface ArchiveListProps {
    role: 'admin' | 'employee';
}

const ArchiveList: React.FC<ArchiveListProps> = ({ role }) => {
    const [archive, setArchive] = useState<ArchiveItem[]>([]);
    const navigate = useNavigate();

    const monthNames: { [key: number]: string } = {
        1: 'January', 2: 'February', 3: 'March', 4: 'April',
        5: 'May', 6: 'June', 7: 'July', 8: 'August',
        9: 'September', 10: 'October', 11: 'November', 12: 'December'
    };

    useEffect(() => {
        const fetchArchive = async () => {
            try {
                const response = await getAttendanceArchive(role);
                setArchive(response.data.archive); 
                
            } catch (error) {
                console.error("Error fetching archive:", error);
            }
        };
        fetchArchive();
    }, [role]);

    const handleMonthClick = (year: number, month: number) => {
        if (role === 'admin') {
            navigate(`/admin-dashboard/attendence-report/${year}/${month}`);
        } else {
            navigate(`/employee-dashboard/attendence-report/${year}/${month}`); 
        }
    };

    if (archive.length === 0) {
        return <p className="text-gray-500">No previous attendance records are available.</p>;
    }

    return (
        <div className="flex flex-wrap gap-4">
            {archive.map((item, index) => (
                <button
                    key={index}
                    onClick={() => handleMonthClick(item.year, item.month)}
                    className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium py-2 px-4 rounded-lg transition duration-150 shadow-md"
                >
                    {monthNames[item.month]} {item.year}
                </button>
            ))}
        </div>
    );
};

export default ArchiveList;