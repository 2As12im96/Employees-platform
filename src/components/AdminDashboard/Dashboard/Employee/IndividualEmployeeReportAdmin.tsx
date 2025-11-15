import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAttendanceArchive, getIndividualEmployeeReportForAdmin } from "../../../services/AttendanceService";
import type { ArchiveItem, MonthlyReport } from "../../../Types/type";
import { format } from 'date-fns';

const IndividualEmployeeReportAdmin: React.FC = () => {
    const { employeeId, year, month } = useParams<{ employeeId: string, year: string, month: string }>();
    const navigate = useNavigate();
    
    const [report, setReport] = useState<MonthlyReport | null>(null);
    const [archive, setArchive] = useState<ArchiveItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const currentYear = parseInt(year || new Date().getFullYear().toString());
    const currentMonth = parseInt(month || (new Date().getMonth() + 1).toString());

    useEffect(() => {
        if (!employeeId) return;
        const fetchArchive = async () => {
             try {
                const res = await getAttendanceArchive('admin'); 
                setArchive(res.data.archive);
            } catch (err: any) {
                console.error("Failed to retrieve the archive :", err);
            }
        };

        const fetchReport = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await getIndividualEmployeeReportForAdmin(employeeId, currentYear, currentMonth);
                setReport(res.data.report);
            } catch (err: any) {
                setError(`Failed to bring the report for the month ${currentMonth}/${currentYear}: ` + (err.response?.data?.message || err.message));
                setReport(null);
            } finally {
                setLoading(false);
            }
        };

        fetchArchive();
        fetchReport();
    }, [employeeId, currentYear, currentMonth]);

    const handleArchiveNavigation = (newYear: number, newMonth: number) => {
        navigate(`/admin-dashboard/attendence-report/employee/${employeeId}/${newYear}/${newMonth}`);
    };

    const getMonthName = (m: number) => {
        const date = new Date(2000, m - 1, 1);
        return format(date, 'MMMM');
    };

    if (loading) return <p className="text-center mt-10 text-lg">Loading employee report...</p>;
    if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;

    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold mb-6 text-blue-700">Attendance report for : {report?.name || 'N/A'}</h2>
            <h3 className="text-xl font-semibold mb-4">
                Month: {getMonthName(currentMonth)} {currentYear}
            </h3>

            <div className="mb-8">
                <p className="text-lg font-medium mb-2">Archives:</p>
                <div className="flex flex-wrap gap-2">
                    {archive.map(item => (
                        <button 
                            key={`${item.year}-${item.month}`} 
                            onClick={() => handleArchiveNavigation(item.year, item.month)}
                            className={`px-4 py-1 text-sm rounded-full transition duration-150 ${
                                currentYear === item.year && currentMonth === item.month
                                    ? 'bg-blue-600 text-white shadow' 
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            {getMonthName(item.month)} {item.year}
                        </button>
                    ))}
                </div>
            </div>
            
            <hr className="my-6" />

            {report && (
                <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 text-center bg-gray-100 p-4 rounded-lg shadow-inner">
                    <div className="p-3 border rounded">
                        <p className="text-2xl font-bold text-green-600">{report.presentDays}</p>
                        <p className="text-sm text-gray-500">Days of attendance</p>
                    </div>
                    
                    <div className="p-3 border rounded">
                        <p className="text-2xl font-bold text-blue-600">{report.totalLeaveDays}</p>
                        <p className="text-sm text-gray-500">Approved Leaves</p>
                    </div>
                    
                    <div className="p-3 border rounded">
                        <p className="text-2xl font-bold text-red-600">{report.absenceDays}</p>
                        <p className="text-sm text-gray-500">Actual absence</p>
                    </div>
                    
                    <div className="p-3 border rounded">
                        <p className="text-2xl font-bold text-purple-600">{report.totalWorkDurationHours}</p>
                        <p className="text-sm text-gray-500">Total working hours (hours)</p>
                    </div>
                </div>
                </>
            )}
            
            <h3 className="text-2xl font-semibold mt-8 mb-4">Daily attendance log</h3>
            {report?.dailyAttendance && report.dailyAttendance.length > 0 ? (
                <div className="overflow-x-auto bg-white shadow-lg rounded-md">
                    <table className="min-w-full divide-y divide-gray-200 text-center">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Log in</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Log out</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Working time (minutes)</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {report.dailyAttendance.map((day, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap">{day.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{day.checkIn}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{day.checkOut}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{day.workDuration}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{day.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-center text-gray-500">There are no attendance records for this month.</p>
            )}
        </div>
    );
};

export default IndividualEmployeeReportAdmin;