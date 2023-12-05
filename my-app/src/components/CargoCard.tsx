import { FC } from 'react'
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import CardImage from './CardImage.tsx';

export interface ICargoProps {
    uuid: string
    name: string
    en_name: string
    category: string
    price: number
    weight: number
    capacity: number
    description: string
    photo: string
}

export const SmallRCard: FC<ICargoProps> = ({ uuid, name, price, weight, photo}) => (
    <Card className='card text-center'>
        <CardImage url={`http://${photo}`} className='rounded object-fit-cover'/>
        <Card.Body className='flex-grow-1'>
            <Card.Title>{name}</Card.Title>
            <Card.Text>{price} руб./{weight} кг</Card.Text>
        </Card.Body>
        <Link to={`/cargo/${uuid}`} className="btn btn-primary">Подробнее</Link>
    </Card>
)

export const BigRCard: FC<ICargoProps> = ({name, category, price, weight, capacity, description, photo}) => {
    return (
        <Card className='mx-auto shadow w-50 p-3 text-center text-md-start' >
            <div className='row'>
                <div className='col-12 col-md-8 px-md-0 overflow-hidden'>
                    <CardImage url={`http://${photo}`}/>
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
};