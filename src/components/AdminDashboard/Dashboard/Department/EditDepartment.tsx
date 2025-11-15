import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Url } from "../../../../utils/Url";


function EditDepartment() {
    const {id} = useParams();
    const [department, setDepartment]:any = useState([]);
    const [deplaoding, setDeplaoding] = useState<boolean>(false);
    const navigate = useNavigate();
    
    useEffect(()=> {
        const fetchDepartments = async () => {
            setDeplaoding(true);
            try{
                const res = await axios.get(`${Url}/department/${id}` , {
                    headers:{
                      "Authorization": `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if(res.data.success){
                    setDepartment(res.data.department);
                }
            }
            catch(err: any){
                if(err.res && err.res.data.success){
                    alert(err.res.data.message);
                }
            }
            finally{
                setDeplaoding(false);
            }
        }
        fetchDepartments();
    },[]);
    const handleChange = (e:any)=>{
        const {name , value}  = e.target;
        setDepartment({...department , [name]:value});
    }
    const handleSubmit = async(e:any)=>{
        e.preventDefault();
        try{
            const response = await axios.put(`${Url}/department/${id}`, department, {
                headers:{
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            });
            if(response.data.success){
                navigate('/admin-dashboard/departments');
            }
        }catch(err:any){
            if(err.response && err.response.data.error){
                alert(err.response.data.error);
            }
        }
    }
    return (
        <>
            {deplaoding ? 
            <div className="fixed inset-0 bg-white/80 flex items-center justify-center z-50">
                <svg className="animate-spin h-10 w-10 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="ml-3 text-lg text-gray-700">Loading...</span>
            </div> :
            <div className="max-w-3xl mx-auto mt-30 bg-white p-8 rounded-md shadow-md w-150">
                <div>
                    <h2 className="text-2xl font-bold mb-6">Edit Department</h2>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor='dep_name' className="text-sm font-medium text-gray-700">Department Name</label>
                            <input id='dep_name' name='dep_name' type="text" placeholder="Enter Dep Name" className="mt-1 w-full p-2 border border-gray-300 rounded-md" onChange={handleChange} value={department.dep_name} required/>
                        </div>
                        <div className="mt-3">
                            <label htmlFor='description' className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea id='description' name='description' placeholder="Enter Description" className="mt-1 p-2 block w-full border border-gray-300 rounded-md" onChange={handleChange} value={department.description}></textarea>
                        </div>
                        <button type="submit" className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded">Edit Department</button>
                    </form>
                </div>
            </div>
            }
        </>
    )
}

export default EditDepartment
