import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Url } from "../../utils/Url";


function useGenerateLogic() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    
    const navigate = useNavigate();
    const API_BASE_URL = Url;

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
    return {
        email,
        setEmail,
        loading,
        setLoading,
        error,
        setError,
        successMessage,
        setSuccessMessage,
        handleSubmit
    }
}

export default useGenerateLogic
