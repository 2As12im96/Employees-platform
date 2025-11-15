import { useState, useEffect } from 'react';
import ArchiveList from './ArchiveList';
import { checkIn, checkOut, getEmployeeTodayStatus } from '../../services/AttendanceService'; 

const EmployeeAttendancePortal = () => {
    const [isCheckedIn, setIsCheckedIn] = useState<boolean | null>(null); 
    const [isLoading, setIsLoading] = useState(false);
    const [statusError, setStatusError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const response = await getEmployeeTodayStatus(); 
                setIsCheckedIn(response.data.isCheckedIn);
            } catch (error) {
                console.error("Error fetching attendance status:", error);
                setIsCheckedIn(false); 
                setStatusError("Attendance verification failed. Please check your server connection.");
            }
        };

        fetchStatus();
    }, []);

    const handleCheckIn = async () => {
        setIsLoading(true);
        setStatusError(null);
        try {
            await checkIn();
            setIsCheckedIn(true);
        } catch (error: any) {
            console.error("Check-in error:", error);
            setStatusError(error.response?.data?.message || "Login failed. You may have already checked in today.");
        } finally {
            setIsLoading(false);
        }
    };
    const handleCheckOut = async () => {
        setIsLoading(true);
        setStatusError(null);
        try {
            await checkOut(); 
            setIsCheckedIn(false);
        } catch (error: any) {
            console.error("Check-out error:", error);
            setStatusError(error.response?.data?.message || "The login failed. Please ensure you have checked in first.");
        } finally {
            setIsLoading(false);
        }
    };
    const isLoadingStatus = isCheckedIn === null;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Attendance and Departure Portal</h1>
            
            {statusError && (
                <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
                    ⚠️ {statusError}
                </div>
            )}

            <div className="bg-white shadow-lg rounded-xl p-8 flex justify-center space-x-8 rtl:space-x-reverse mb-10">
                
                {isLoadingStatus ? (
                    <div className="py-5 text-indigo-600 font-semibold">Your status is being checked...</div>
                ) : (
                    <>
                        <button
                            onClick={handleCheckIn}
                            disabled={isCheckedIn === true || isLoading}
                            className={`px-12 py-5 text-lg font-semibold rounded-full transition duration-300 ${
                                (isCheckedIn === true || isLoading) ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'
                            }`}
                        >
                            {isLoading && !isCheckedIn ? 'Registration in progress...' : 'Check-in'}
                        </button>
                        
                        <button
                            onClick={handleCheckOut}
                            disabled={isCheckedIn !== true || isLoading} 
                            className={`px-12 py-5 text-lg font-semibold rounded-full transition duration-300 ${
                                (isCheckedIn !== true || isLoading) ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 text-white'
                            }`}
                        >
                            {isLoading && isCheckedIn ? 'Registration in progress...' : 'Check-out'}
                        </button>
                    </>
                )}
            </div>
            
            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4 border-b pb-2">Personal Archive</h2>
                <ArchiveList role="employee" /> 
            </div>
        </div>
    );
};

export default EmployeeAttendancePortal;