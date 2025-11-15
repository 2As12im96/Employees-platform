import type { MonthlyReport } from '../Types/type';
import { getMonthName } from './Employee Attendences/EmployeeReportViewer';
import { useParams } from 'react-router-dom';


interface ReportProps {
    report: MonthlyReport
}

const AttendanceReportTable: React.FC<ReportProps> = ({ report }) => {
    const { year, month } = useParams<{ year: string, month: string }>();
    const reportYear = parseInt(year || '0', 10);
    const reportMonth = parseInt(month || '0', 10);

    const departmentName = typeof report.department === 'string' 
                           ? report.department 
                           : report.department?.dep_name || 'N/A';

    return (
        <div id="pdf-content" className="bg-white shadow-2xl rounded-lg p-10 my-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
                Monthly Summary {getMonthName(reportMonth)} {reportYear}: {report.name} ({departmentName})
            </h2>
            
            <div className="grid grid-cols-4 gap-4 mb-6 text-sm font-medium">
                <p className="text-center p-2 rounded-lg" style={{ backgroundColor: '#EEF2FF' }}>
                    Attendance: <span className="font-extrabold" style={{ color: '#4F46E5' }}>{report.presentDays}</span> Days
                </p>
                <p className="text-center p-2 rounded-lg" style={{ backgroundColor: '#F0FFF4' }}>
                    Approved Leave: <span className="font-extrabold" style={{ color: '#059669' }}>{report.totalLeaveDays}</span> Days
                </p>
                <p className="text-center p-2 rounded-lg" style={{ backgroundColor: '#FEF2F2' }}>
                    Actual Absence: <span className="font-extrabold" style={{ color: '#DC2626' }}>{report.absenceDays}</span> Days
                </p>
                <p className="text-center p-2 rounded-lg" style={{ backgroundColor: '#FFFBEB' }}>
                    Total Hours: <span className="font-extrabold" style={{ color: '#CA8A04' }}>{report.totalWorkDurationHours}</span> Hours
                </p>
            </div>
            
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Check Out</th>
                            {/* <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Work Duration (Hours)</th> */}
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {report.dailyAttendance.map((day, index) => (
                            <tr key={index} style={day.status === 'Early Out' ? { backgroundColor: '#FFF7ED' } : {}}>
                                <td className="text-center px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{day.date}</td>
                                <td className="text-center px-6 py-4 whitespace-nowrap text-sm text-gray-500">{day.checkIn}</td>
                                <td className="text-center px-6 py-4 whitespace-nowrap text-sm text-gray-500">{day.checkOut}</td>
                                {/* <td className="text-center px-6 py-4 whitespace-nowrap text-sm text-gray-500">{day.durationHours}</td>  */}
                                <td className="text-center px-6 py-4 whitespace-nowrap text-sm font-semibold">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full`} 
                                        style={{
                                            backgroundColor: 
                                                day.status === 'Full Day' ? '#DCFCE7' :
                                                day.status === 'Early Out' ? '#FEF9C3' : 
                                                '#DBEAFE', 
                                            color: 
                                                day.status === 'Full Day' ? '#166534' : 
                                                day.status === 'Early Out' ? '#92400E' : 
                                                '#1E40AF'
                                        }}
                                    >
                                        {day.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
export default AttendanceReportTable;