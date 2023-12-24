import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import { FC } from 'react';
import Container from 'react-bootstrap/Container';

interface IButtonProps {
    path: string;
    text: string;
}

const MenuButton: FC<IButtonProps> = ({ path, text }) => (
    <Link to={path} className='d-flex text-decoration-none mb-2'>
        <Button variant="outline-primary" className='flex-grow-1 shadow-sm'>
            {text}
        </Button>
    </Link>
);

const Main = () => {
    return (
        <Container fluid="sm" className='d-flex flex-column flex-grow-1 align-items-center justify-content-center'>
            <Col className='col-10 col-sm-7 col-md-6 col-lg-5'>
                <MenuButton path="/registration" text="Регистрация" />
                <MenuButton path="/authorization" text="Авторизация" />
                <MenuButton path="/cargo" text="Грузы" />
                <MenuButton path="/flights" text="Полеты" />
                <MenuButton path="/cargo/edit/new" text="Добавить груз" />
            </Col>
        </Container>
    );
};

export default Main