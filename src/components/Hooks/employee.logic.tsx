import { useMemo, useState } from "react";
import type { DepartmentRow, EmployeeRow } from "../Types/type";
import axios from "axios";
import { Url } from "../../utils/Url";
import { columns, EmployeeButtons, fetchEmployees } from "../../utils/EmployeeHelper";
import { useNavigate, useParams } from "react-router-dom";


function useEmployee() {
    const [employee  , setEmployee] = useState({
        name:'',
        maritalStatus:'',
        designation:'',
        salary:0,
        department:'',
        phoneNumber:''
    });
    const [employees , setEmployees] = useState<EmployeeRow[]>([]);
    const [emplaoding, setEmolaoding] = useState<boolean>(false);
    const [filteredEmployee , setFilteredEmployee] = useState<EmployeeRow[]>([]);
    const [department  , setDepartment] = useState<DepartmentRow[]>([]);
    const [loading , setLoading] = useState<boolean>(false);
    const [error , setError] = useState<string | null>(null);
    const [formData , setFormData] = useState<Record<string, any>>({});
    const [departments  , setDepartments] = useState<DepartmentRow[] | null>(null);
    const [empLoading , setEmpLaoding] = useState<boolean>(false);
    const {id} = useParams();

    const navigate = useNavigate();
    const memoizedColumns = useMemo(() => columns, []);


    const fetchEmployee = async () => {
        setEmolaoding(true);
        try {
            const res = await axios.get(`${Url}/employee`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (res.data.success) {
                let sno = 1;
                const data: EmployeeRow[] = res.data.employees.map((emp: any) => (
                    {
                        _id: emp._id,
                        sno: sno++,
                        dep_name: emp.department.dep_name,
                        name: emp.userId.name,
                        dob:new Date (emp.dob).toLocaleDateString(),
                        profileImage: emp.userId.profileImage,
                        action: (<EmployeeButtons Id={emp._id}/>)
                    }
                ));
                setEmployees(data);
                setFilteredEmployee(data);
            }
        }
        catch (err: any) {
            if (err.response && err.response.data.message) {
                alert(err.response.data.message);
            }
        }
        finally {
            setEmolaoding(false);
        }
    }

    const handleFilter = (e:any)=>{
        const searchTerm = e.target.value.toLowerCase();
        const records = employees.filter((emp)=> {
            return emp.name.toLowerCase().includes(searchTerm)
        })
        setFilteredEmployee(records)
    }

    const fetchData = async () => {
        const departments = await fetchEmployees();
        setDepartment(departments);
    };

    const handleChange = (e:any)=> {
        const {name , value , files} = e.target;
        if(name === 'profileImage'){
            setFormData((prevData)=>( {...prevData , [name] : files[0]}))
        }else{
            setFormData((prevData)=>( {...prevData , [name] : value}))
        }
    }

    const handleAddSubmit = async(e:any)=>{
        e.preventDefault();
        const formDataObj = new FormData();
        Object.keys(formData).forEach((key)=>{
            formDataObj.append(key , formData[key])
        });
        setLoading(true)
        try{
            const res = await axios.post(`${Url}/employee/add` , formDataObj ,{
                headers:{
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if(res.data.success){
                navigate('/admin-dashboard/employees');
            }
        } catch(err: any) {
              setError('Server Error: ' + (err?.message ?? String(err)));
              setLoading(false);
        }
        finally{
            setLoading(false);
        }
    }

    const getDepartments = async () => {
        const departments = await fetchEmployees();
        setDepartments(departments);
    };

    const fetchEmployeeData = async () => {
        setEmpLaoding(true);
        try{
            const res = await axios.get(`${Url}/employee/${id}` , {
                headers:{
                  "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            });
            if(res.data.success && res.data.employee){
                const employee = res.data.employee; 
                setEmployee((prev)=> ({...prev , 
                    name: employee.userId.name ,
                    maritalStatus: employee.maritalStatus , 
                    designation: employee.designation ,
                    salary: employee.salary ,
                    department: employee.department,
                    phoneNumber: employee.phoneNumber
                })); 
            }
        }
        catch(err: any){
            if(err.res && err.res.data.success){
                alert(err.res.data.message);
            }
        }
        finally{
            setEmpLaoding(false);
        }
    }
    
    const handleEditChange = (e:any)=> {
        const {name , value } = e.target;
        setEmployee((prevData)=>( {...prevData , [name] : value}))
    }

    const handleSubmit = async(e:any)=>{
        e.preventDefault();
        setEmpLaoding(true)
        try{
            const res = await axios.put(`${Url}/employee/${id}` , employee ,{
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

    return {emplaoding , filteredEmployee , memoizedColumns , fetchEmployee , handleFilter , department , loading , error , formData , fetchData , handleChange , handleAddSubmit , employee , departments , empLoading , id , getDepartments , fetchEmployeeData , handleEditChange , handleSubmit}
}

export default useEmployee
