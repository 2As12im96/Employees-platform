import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../Context/Context";
import axios from "axios";
import styles from '../../../Authentication/Login/login.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import useLoginLogic from "../../../Authentication/Login/login.logic";
import type { Setting } from "../../../Types/type";
import { Url } from "../../../../utils/Url";

function EmployeeSetting() {
    const navigate = useNavigate();
    const {user} = useAuth();
    const [setting , setSetting] = useState<Setting>({
        userId: user?._id,
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    
    const [success , setSuccess] = useState<boolean>(false);
    const [loading , setLoading] = useState<boolean>(false);
    const [error , setError] = useState<boolean>(false);
    const { eye , toggleEye } = useLoginLogic();


    const handleChange = (e:any)=>{
        const {name , value} = e.target;
        setSetting({...setting , [name]: value});
    }

    const handleSubmit = async(e:any)=>{
        e.preventDefault();
        if(setting.newPassword !== setting.confirmPassword){
            setError(true);
        }else{
            setLoading(true);
            try{
                const res = await axios.put(
                    `${Url}/setting/change-password`,
                    setting,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
                if(res.data.success){
                    setSuccess(true);
                    setTimeout(()=>{
                        navigate('/employee-dashboard');
                    }, 2000);
                    setError(false);
                    setLoading(false);
                }
            }catch(err:any){
                if(err.res && !err.res.data.success){
                    setError(err.res.data.err);
                    setLoading(false);
                    setSuccess(false);
                }
            }
            finally{
                setLoading(false);
            }
        }
    }
    return (
        <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md w-96">
            <h2 className="text-2xl font-bold mb-6">Change Password</h2>
            <p className="text-red-500">{error}</p>
            <p className="text-teal-500">{success && <span>Change Password Successfully</span>}</p>
            <form onSubmit={handleSubmit}>
                {/* Department Name */}
                <div>
                    <label htmlFor="" className="text-sm font-medium text-gray-700">Old Password</label>
                    <span className={styles.passwordInput +  " flex items-center justify-between"}>
                        <input type={eye ? "text" : "password"} name='oldPassword' placeholder="Change Password" onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md" required/>
                        <span className={styles.eyeIcon} onClick={toggleEye}>
                          <FontAwesomeIcon icon={eye ?  faEyeSlash : faEye} />
                        </span>
                    </span>
                </div>
                <div>
                    <label htmlFor="" className="text-sm font-medium text-gray-700">New Password</label>
                    <span className={styles.passwordInput +  " flex items-center justify-between"}>
                        <input type={eye ? "text" : "password"} name='newPassword' placeholder="New Password" onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md" required/>
                        <span className={styles.eyeIcon} onClick={toggleEye}>
                          <FontAwesomeIcon icon={eye ?  faEyeSlash : faEye} />
                        </span>
                    </span>
                </div>
                <div>
                    <label htmlFor="" className="text-sm font-medium text-gray-700">Confirm Password</label>
                    <span className={styles.passwordInput +  " flex items-center justify-between"}>
                        <input type={eye ? "text" : "password"} name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md" required/>
                        <span className={styles.eyeIcon} onClick={toggleEye}>
                          <FontAwesomeIcon icon={eye ?  faEyeSlash : faEye} />
                        </span>
                    </span>
                </div>
                <button type="submit" className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">
                    {loading ? 
                        (<>
                            <span className={styles.loader}></span> 
                        </>):
                        (<>
                            <span>Change Password</span> 
                        </>)
                    }
                </button>
            </form>
        </div>
    )
}

export default EmployeeSetting
