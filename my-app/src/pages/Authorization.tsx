import { FC, useState, ChangeEvent, FormEvent } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { axiosAPI } from "../api";
import { AppDispatch } from "../store";
import { setLogin as setLoginStore, setRole } from "../store/userSlice";

interface AuthResp {
    expires_in: number;
    access_token: string;
    token_type: string;
    role: number;
}

const Authorization: FC = () => {
    const [login, setLogin] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()

    const authorize = async (login: string, password: string): Promise<void> => {
        const response = await axiosAPI.post<AuthResp>('/user/login', { login, password });
        let currentTime = new Date()
        let expires_at = new Date(currentTime.getTime() + response.data.expires_in / 1000000)
        localStorage.setItem('expires_at', expires_at.toISOString());
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('role', response.data.role.toString());
        localStorage.setItem('login', login);
        dispatch(setLoginStore(login));
        dispatch(setRole(response.data.role));
    }

    const handleRegistration = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        authorize(login, password)
            .then(() => navigate('/'))
    };

    return (
        <Container fluid="sm" className='d-flex flex-column flex-grow-1 align-items-center justify-content-center'>
            <Form onSubmit={handleRegistration} className='d-flex flex-column align-items-center'>
                <h2>Авторизация</h2>

                <Form.Group controlId="login" className='d-flex flex-column align-items-center mt-2'>
                    <Form.Label>Логин</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Введите логин"
                        value={login}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setLogin(e.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId="password" className='d-flex flex-column align-items-center mt-1'>
                    <Form.Label>Пароль</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Введите пароль"
                        value={password}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    />
                </Form.Group>

                <Button
                    variant="primary"
                    type="submit"
                    className='mt-3 w-100'
                    disabled={!login || !password}
                >
                    Войти
                </Button>

                <Link to={'/registration'}>
                    <Button variant="link">
                        Регистрация
                    </Button>
                </Link>
            </Form>
        </Container>
    );
};

export default Authorization