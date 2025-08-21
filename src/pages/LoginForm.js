import jwt from 'jsonwebtoken';
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { server } from "../constants";

const LoginForm = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch(server + '/user/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, password }),
            });
            const data = await response.json();

            if (data.token) {
                localStorage.setItem('jwt', data.token);
                setIsLoading(false);
                navigate('/admin/')
            } else {
                setError(data.error);
                setIsLoading(false);
            }
        } catch (error) {
            setError(error.message);
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && <p className="error">{error}</p>}
            <label>
                Username:
                <input
                    type="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                />
            </label>
            <br />
            <label>
                Password:
                <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                />
            </label>
            <br />
            <button type="submit" disabled={isLoading }>
                {isLoading ? 'Logging in...' : 'Log in'}
            </button>
        </form>
    );
};

export default LoginForm;
