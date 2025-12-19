import { useEffect } from "react"
import LoadingPage from "../../../pages/Loading";
import useSalary from "../../../Hooks/salary.logic";

function ViewSalary() {
    let sno = 1;
    const { filterSalaries , fetchSalaries , filterSalariesData} = useSalary();
    useEffect(()=>{
        fetchSalaries();
    },[]);
    return (
        <>
           {filterSalaries === null ? 
           (
                <LoadingPage />
           ):
           (
                <div className="overflow-x-auto p-5">
                    <h2 className="font-bold text-2xl text-center p-4">Salary History</h2>
                    <div className="text-end">
                        <input 
                            type="text"
                            placeholder="Search By Emp ID"
                            className="border px-6 w-100 rounded-md py-0.5 m-3 border-gray-300"
                            onChange={(e) => filterSalariesData((e.target as HTMLInputElement).value)} />
                    </div>
                    {filterSalaries.length > 0 ? 
                        (
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 border border-gray-200">
                                    <tr>
                                        <td className="px-6 py-3 font-bold">SNO</td>
                                        <td className="px-6 py-3 font-bold">Emp ID</td>
                                        <td className="px-6 py-3 font-bold">Salary</td>
                                        <td className="px-6 py-3 font-bold">Allowance</td>
                                        <td className="px-6 py-3 font-bold">Deduction</td>
                                        <td className="px-6 py-3 font-bold">Total</td>
                                        <td className="px-6 py-3 font-bold">Pay Date</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filterSalaries.map((salary)=> (
                                        <tr key={salary._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                            <td className="px-6 py-3">{sno++}</td>
                                            <td className="px-6 py-3">{salary.employeeId.employeeId}</td>
                                            <td className="px-6 py-3">{salary.basicSalary}</td>
                                            <td className="px-6 py-3">{salary.allowances}</td>
                                            <td className="px-6 py-3">{salary.deductions}</td>
                                            <td className="px-6 py-3">{salary.netSalary}</td>
                                            <td className="px-6 py-3">{new Date(salary.payDate).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ): 
                        (
                            <div className="w-full">
                                <p className="text-center">No Records</p>
                            </div>
                        )
                    }
                </div>
           )}
        </>
    )
}

export default ViewSalary
