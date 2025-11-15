import axios from "axios";
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import { Url } from "../../../../utils/Url";



function ViewSalary() {
    const [salaries , setSalaries] = useState<any[] | null>(null);
    const [filterSalaries , setFilterSalaries] = useState<any[] | null>(null);
    const {id} = useParams();
    let sno = 1;

    const fetchSalaries = async()=>{
        try{
            const res = await axios.get(`${Url}/salary/${id}` , {
                headers:{
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                }
            })
            if(res.data.success){
                setSalaries(res.data.salary);
                setFilterSalaries(res.data.salary);
            }
        }catch(err:any){
            if(err.res && !err.res.data.success){
                console.error(err.message);
            }
        }
    }
    useEffect(()=>{
        fetchSalaries();
    },[]);
    const filterSalariesData = (q: string)=>{
        if (!salaries) {
            setFilterSalaries([]);
            return;
        }
        const filterRecords = salaries.filter((leave: any) => {
            return String(leave.employeeId).toLocaleLowerCase().includes(q.toLocaleLowerCase());
        })
        setFilterSalaries(filterRecords);
    }
    return (
        <>
           {filterSalaries === null ? 
           (
                <div className="fixed inset-0 bg-white/80 flex items-center justify-center z-50">
                    <svg className="animate-spin h-10 w-10 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="ml-3 text-lg text-gray-700">Loading...</span>
                </div>
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
                            <div>No Records</div>
                        )
                    }
                </div>
           )}
        </>
    )
}

export default ViewSalary
