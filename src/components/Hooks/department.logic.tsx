import axios from "axios";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Url } from "../../utils/Url";
import type { DeleteModalState, DepartmentRow } from "../Types/type";
import { columns, DepartmentButtons } from "../../utils/DepartmentHelper";


function useDepartment() {
    const [department , setDepartment] = useState({
        dep_name: '',
        description: ''
    });
    const [Loading , setLoading] = useState<boolean>(false);
    const [departments, setDepartments] = useState<DepartmentRow[]>([]);
    const [deplaoding, setDeplaoding] = useState<boolean>(false);
    const [deleteItem, setDeleteItem] = useState<DeleteModalState | null>(null);
    const [filteredDepartment , setFilteredDepartment] = useState< DepartmentRow[]>([]);
    const {id} = useParams();
    const [editDepartment , setEditDepartment]:any = useState([]);

    const navigate = useNavigate();

    const handleChange = (e:any)=>{
        const {name , value}  = e.target;
        setDepartment({...department , [name]:value});
    }

    const handleSubmit = async(e:any)=>{
        e.preventDefault();
        setLoading(true);
        try{
            const response = await axios.post(`${Url}/department/add`, department, {
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
        finally{
            setLoading(false);
        }
    }

    const onDepartmentDelete = (id: string) => {
        const data = departments.filter((dep) => dep._id !== id);
        setDepartments(data);
    }
    
    const openDeleteModal = (id: string, name: string) => { 
        setDeleteItem({ id, name });
    };

    const closeDeleteModal = () => {
        setDeleteItem(null);
    };

    const handleConfirmDelete = async () => {
        if (!deleteItem) return;
        const idToDelete = deleteItem.id;
        closeDeleteModal();
        try {
            const res = await axios.delete(`${Url}/department/${idToDelete}`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (res.data.success) {
                onDepartmentDelete(idToDelete); 
            }
        } catch (err: any) {
            if (err.response && err.response.data.message) {
                alert(err.response.data.message);
            } else {
                alert("An error occurred during deletion.");
            }
        }
    };

    const memoizedColumns = useMemo(() => columns, []);
    
    const fetchDepartments = async () => {
        setDeplaoding(true);
        try {
            const res = await axios.get(`${Url}/department`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (res.data.success) {
                let sno = 1;
                const data: DepartmentRow[] = res.data.departments.map((dep: any) => (
                    {
                        _id: dep._id,
                        sno: sno++,
                        dep_name: dep.dep_name,
                        action: (<DepartmentButtons DepId={String(dep._id)} DepName={dep.dep_name} onOpenModal={openDeleteModal} />)
                    }
                ));
                setDepartments(data);
                setFilteredDepartment(data);
            }
        }
        catch (err: any) {
            if (err.response && err.response.data.message) {
                alert(err.response.data.message);
            }
        }
        finally {
            setDeplaoding(false);
        }
    }

    const filterDepartments = (e:any)=>{
        const records = departments.filter((dep)=> dep.dep_name.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase()));
        setFilteredDepartment(records);
    }

    const fetchDepartment = async () => {
        setDeplaoding(true);
        try{
            const res = await axios.get(`${Url}/department/${id}` , {
                headers:{
                  "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            });
            if(res.data.success){
                setEditDepartment(res.data.department);
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

    const handleEditChange = (e:any)=>{
        const {name , value}  = e.target;
        setEditDepartment({...editDepartment , [name]:value});
    }

    const handleEditSubmit = async(e:any)=>{
        e.preventDefault();
        try{
            const response = await axios.put(`${Url}/department/${id}`, editDepartment, {
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

    return {Loading , handleChange , handleSubmit , departments , deplaoding , deleteItem , filteredDepartment , closeDeleteModal , handleConfirmDelete , memoizedColumns , fetchDepartments , filterDepartments , editDepartment ,  fetchDepartment , handleEditChange , handleEditSubmit}
}

export default useDepartment
