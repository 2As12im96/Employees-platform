import { useNavigate, useParams } from "react-router-dom";
import { Url } from "../../utils/Url";
import { useState } from "react";
import axios from "axios";


function useResetPassword() {
    const { token } = useParams<{ token: string }>(); 
    const navigate = useNavigate();
    const API_BASE_URL = Url; 
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [eye, setEye] = useState(false);

    const toggleEye = () => setEye(!eye);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        if (newPassword !== confirmPassword) {
            setError("New password and confirmation do not match.");
            setLoading(false);
            return;
        }

        if (!token) {
            setError("Reset token is missing. Please start from the 'Forgot Password' page.");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.patch<{ success: boolean; message: string }>(
                `${API_BASE_URL}/reset-password-simple/${token}`,
                { newPassword }
            );

            setSuccessMessage(response.data.message || "Password updated successfully.");
            setTimeout(() => {
                navigate('/login');
            }, 3000);
            
        } catch (err: any) {
            console.error("Error updating password:", err);
            
            const errorMessage = err.response?.data?.error || "Failed to update password. The link might be expired.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };
    return {
        newPassword,
        setNewPassword,
        confirmPassword,
        setConfirmPassword,
        loading,
        setLoading,
        error,
        setError,
        eye,
        setEye,
        successMessage,
        setSuccessMessage,
        toggleEye,
        handleSubmit
    }
}

export default useResetPassword
