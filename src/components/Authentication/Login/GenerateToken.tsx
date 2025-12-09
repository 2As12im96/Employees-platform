import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from "./login.module.css";
import { Link } from 'react-router-dom';
import { Url } from '../../../utils/Url';

const API_BASE_URL = Url;

const GenerateToken: React.FC = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const response = await axios.post<{ success: boolean; message: string; token: string }>(
                `${API_BASE_URL}/generate-reset-token`,
                { email }
            );

            const receivedToken = response.data.token;
            navigate(`/update-password/${receivedToken}`);
            
        } catch (err: any) {
            console.error("Error generating token:", err);
            
            const errorMessage = err.response?.data?.error || "Failed to generate the update link. Ensure the email is correct.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className={styles.login + " flex flex-col items-center h-screen justify-center bg-gradient-to-b from-teal-600 from-50% to-gray-100 to-50% space-y-6"}>
            <h2 className="font-Playwrite text-4xl font-extrabold text-white text-center drop-shadow-lg">Employee Management System</h2>
            <div className="border shadow p-6 bg-white w-full max-w-md rounded-lg">
                <h2 className='text-2xl text-center font-bold mb-6'>Reset Password</h2>
                
                <p className="text-center text-gray-600 mb-4">
                    Please enter your email to update your password.
                </p>

                {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label htmlFor="email" className='block text-gray-700 font-medium mb-1'>Email</label>
                        <input 
                            type="email" 
                            id='email' 
                            name='email' 
                            placeholder='Enter your registered email' 
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500" 
                            onChange={(e) => setEmail(e.target.value)} 
                            required
                        />
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
                                <span>Confirm Email and Update Password</span>
                            }
                        </button>
                    </div>

                    <div className="text-center mt-4">
                        <Link to='/login' className="text-sm text-gray-600 hover:text-teal-600 hover:underline">
                            Back to Login
                        </Link>
                    </div>

                </form>
                {error && <p className="text-red-500 text-center mt-4">{error}</p>}
            </div>
        </section>
    );
};

export default GenerateToken;