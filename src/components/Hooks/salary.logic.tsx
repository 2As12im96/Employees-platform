import { useState } from "react";
import type { DepartmentRow, EmployeeRow } from "../Types/type";
import { useNavigate, useParams } from "react-router-dom";
import { fetchEmployees, getEmployees } from "../../utils/EmployeeHelper";
import axios from "axios";
import { Url } from "../../utils/Url";


function useSalary() {
    const [salary  , setSalary] = useState({
        employeeId:null,
        basicSalary:0,
        allowances:0,
        deductions:0,
        salary:0,
        payDate:null
    });
    const [employees  , setEmployees] = useState<EmployeeRow[]>([]);
    const [departments  , setDepartments] = useState<DepartmentRow[] | null>(null);
    const [empLoading , setEmpLaoding] = useState<boolean>(false);
    const [error , setError] = useState<string | null>(null);

    const [salaries , setSalaries] = useState<any[] | null>(null);
    const [filterSalaries , setFilterSalaries] = useState<any[] | null>(null);
    const {id} = useParams();
    const navigate = useNavigate();



    const getDepartments = async () => {
        const departments = await fetchEmployees();
        setDepartments(departments);
    };
    const handleDepartment = async(e: React.ChangeEvent<HTMLSelectElement>)=>{ 
        const emps = await getEmployees(e.target.value); 
        setEmployees(emps)
    }
  
    const handleChange = (e:any)=> {
        const {name , value } = e.target;
        setSalary((prevData)=>( {...prevData , [name] : value}))
    }

    const handleSubmit = async(e:any)=>{
        e.preventDefault();
        setEmpLaoding(true)
        try{
            const res = await axios.post(`${Url}/salary/add` , salary ,{
                headers:{
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if(res.data.success){
                navigate('/admin-dashboard/employees');
            }
        } catch(err: any) {
            setError('Server Error: ' + (err?.message ?? String(err)));
            setEmpLaoding(false);
        }
        finally{
            setEmpLaoding(false);
        }
    }

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
    return {employees , departments , empLoading , error , getDepartments , handleDepartment , handleChange , handleSubmit , salaries , setSalaries , filterSalaries , setFilterSalaries , fetchSalaries , filterSalariesData}
}

export default useSalary
