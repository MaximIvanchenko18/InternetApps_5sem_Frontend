import { FC, ReactNode } from 'react'
import { Link } from 'react-router-dom';
import { Card, ButtonGroup } from 'react-bootstrap';
import ListGroup from 'react-bootstrap/ListGroup';
import CardImage from './CardImage.tsx';
import { ICargo } from '../models';

interface CardProps extends ICargo {
    children: ReactNode;
}

export const SmallCCard: FC<CardProps> = ({ children, uuid, name, price, weight, photo}) => (
    <Card className='w-100 mx-auto px-0 shadow-lg text-center' key={uuid}>
        <div className="ratio ratio-1x1 overflow-hidden">
            <CardImage url={photo} className='rounded object-fit-cover' />
        </div>
        <Card.Body className='flex-grow-1'>
            <Card.Title>{name}</Card.Title>
            <Card.Text>{price} руб./{weight} кг</Card.Text>
        </Card.Body>
        <ButtonGroup vertical>
            <Link to={`/cargo/${uuid}`} className="btn btn-primary border border-dark">Подробнее</Link>
            <>{children}</>
        </ButtonGroup>
    </Card>
)

export const BigCCard: FC<ICargo> = ({name, category, price, weight, capacity, description, photo}) => (
    <Card className='shadow-lg text-center text-md-start'>
        <div className='row'>
            <div className='col-12 col-md-8 overflow-hidden'>
                <CardImage url={photo} />
            </div>
            <Card.Body className='col-12 col-md-4 ps-md-0'>
                <ListGroup variant="flush">
                    <ListGroup.Item>
                        <Card.Title>{name}</Card.Title>
                        <Card.Text>Категория: {category}</Card.Text>
                        <Card.Text>Описание: {description}</Card.Text>
                        <Card.Text>Цена: {price} руб.</Card.Text>
                        <Card.Text>Масса: {weight} кг.</Card.Text>
                        <Card.Text>Объем: {capacity} м<sup>3</sup></Card.Text>
                    </ListGroup.Item>
                </ListGroup>
            </Card.Body>
        </div>
    </Card>
);