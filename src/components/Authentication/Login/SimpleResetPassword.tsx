import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import styles from "./login.module.css";
import { Link } from 'react-router-dom';
import useResetPassword from '../../Hooks/resetPassword.logic';

const SimpleResetPassword: React.FC = () => {
    const { setNewPassword , setConfirmPassword , loading , error , eye , successMessage , toggleEye , handleSubmit } = useResetPassword();

    return (
        <section className={styles.login + " flex flex-col items-center h-screen justify-center bg-gradient-to-b from-teal-600 from-50% to-gray-100 to-50% space-y-6"}>
            <h2 className="font-Playwrite text-3xl text-white text-center">Employee Management System</h2>
            
            <div className="border shadow p-6 bg-white w-full max-w-md rounded-lg">
                <h2 className='text-2xl text-center font-bold mb-6'>Set New Password</h2>
                
                {successMessage ? (
                    <div className="text-center">
                        <p className="text-green-600 text-lg font-semibold mb-4">{successMessage}</p>
                        <p className="text-gray-600">You will be redirected to the login page shortly...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        
                        <div className="mb-4">
                            <label htmlFor="newPassword" className='block text-gray-700 font-medium mb-1'>New Password</label>
                            <span className={styles.passwordInput + " flex items-center justify-between"}>
                                <input 
                                    type={eye ? "text" : "password"} 
                                    id='newPassword' 
                                    name='newPassword' 
                                    placeholder='Enter new password' 
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500" 
                                    onChange={(e) => setNewPassword(e.target.value)} 
                                    required
                                />
                                <span className={styles.eyeIcon} onClick={toggleEye}>
                                    <FontAwesomeIcon icon={eye ? faEyeSlash : faEye} />
                                </span>
                            </span>
                        </div>

                        <div className="mb-6">
                            <label htmlFor="confirmPassword" className='block text-gray-700 font-medium mb-1'>Confirm Password</label>
                            <span className={styles.passwordInput + " flex items-center justify-between"}>
                                <input 
                                    type="password" 
                                    id='confirmPassword' 
                                    name='confirmPassword' 
                                    placeholder='Confirm new password' 
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500" 
                                    onChange={(e) => setConfirmPassword(e.target.value)} 
                                    required
                                />
                            </span>
                        </div>

                        <div className="mb-4">
                            <button 
                                type="submit" 
                                className="w-full bg-teal-600 text-white py-3 rounded-md hover:bg-teal-700 transition duration-300 font-semibold" 
                                disabled={loading}
                            >
                                {loading ? 
                                    <span className={styles.loader}></span> 
                                    : 
                                    <span>Set and Update Password</span>
                                }
                            </button>
                        </div>

                    </form>
                )}
                
                {error && <p className="text-red-500 text-center mt-4">{error}</p>}
                
                {!successMessage && (
                    <div className="text-center mt-4">
                        <Link to='/login' className="text-sm text-gray-600 hover:text-teal-600 hover:underline">
                            Back to Login
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
};

export default SimpleResetPassword;