import styles from "./login.module.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import useLoginLogic from "../../Hooks/Login.logic";


const Login: React.FC = ()=> {
  const { setEmail , setPassword , res , loading , error , eye , handleSubmit , toggleEye } = useLoginLogic();
  return (
        <section className={styles.login + " flex flex-col items-center h-screen justify-center bg-gradient-to-b from-teal-600 from-50% to-gray-100 to-50% space-y-8"}>
            <h2 className="font-Playwrite text-4xl font-extrabold text-white text-center drop-shadow-lg">Employee Management System</h2>
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md transform transition duration-500 ">
                <h2 className='text-3xl text-center font-extrabold text-gray-800 mb-6 border-b pb-3'>Log In</h2>
                {res && <p className="text-green-500 text-center mb-4 font-medium">{res}</p>}
                <form onSubmit={handleSubmit}>

                    <div className="mb-5">
                        <label htmlFor="email" className='block text-gray-700 font-medium mb-2'>Email</label>
                        <input 
                            type="email" 
                            id='email' 
                            name='email' 
                            placeholder='Enter your email' 
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-150" 
                            onChange={(e) => setEmail(e.target.value)} 
                            required
                        />
                    </div>

                    <div className="mb-5">
                        <label htmlFor="password" className='block text-gray-700 font-medium mb-2'>Password</label>
                        <div className={styles.passwordInput + " relative flex items-center"}>
                            <input 
                                type={eye ? "text" : "password"} 
                                id='password' 
                                name='password' 
                                placeholder='Enter password' 
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-150 pr-10" 
                                onChange={(e) => setPassword(e.target.value)} 
                                required
                            />
                            <span 
                                className={styles.eyeIcon + " absolute right-3 top-2/2 transform -translate-y-1/5 text-gray-500 hover:text-teal-600 cursor-pointer transition duration-150"} 
                                onClick={toggleEye}
                            >
                                <FontAwesomeIcon icon={eye ? faEyeSlash : faEye} />
                            </span>
                        </div>
                    </div>

                    <div className="mb-6 flex items-center justify-between">
                        <label className="inline-flex items-center text-sm">
                            <input 
                                type="checkbox" 
                                className={styles.checkBox + " form-checkbox h-4 w-4 text-teal-600 rounded"} 
                                required
                            />
                            <span className="mr-2 pl-4 text-gray-700">Remember me</span>
                        </label>
                        <Link to='/forgot-password' className="text-sm text-teal-600 hover:text-teal-700 font-medium transition duration-150">Forgot password?</Link> 
                    </div>

                    <div className="mb-4">
                        <button 
                            type="submit" 
                            className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 shadow-md hover:shadow-lg transition duration-200 font-bold text-lg" 
                            disabled={loading}
                        >
                            {loading ? 
                                <span className={styles.loader}></span> 
                                : 
                                <span>Log In</span>
                            }
                        </button>
                    </div>

                </form>
                
                {error && <p className="text-red-500 text-center mt-4 text-sm font-medium">{error}</p>}
                
            </div>
        </section>
  )
}

export default Login



