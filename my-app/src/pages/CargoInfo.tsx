import { FC, useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { Card, Row, Navbar, ListGroup } from 'react-bootstrap';
import { getCargo } from '../api'
import { ICargo } from '../models';
import { AppDispatch } from "../store";
import { addToHistory } from "../store/historySlice"
import LoadAnimation from '../components/LoadAnimation';
import CardImage from '../components/CardImage';
import Breadcrumbs from '../components/Breadcrumbs';

const CargoInfo: FC = () => {
    let { cargo_id } = useParams()
    const [cargo, setCargo] = useState<ICargo | undefined>(undefined)
    const [loaded, setLoaded] = useState<boolean>(false)
    const dispatch = useDispatch<AppDispatch>()
    const location = useLocation().pathname

    useEffect(() => {
        getCargo(cargo_id)
            .then(data => {
                setCargo(data)
                dispatch(addToHistory({ path: location, name: data ? data.name : "неизвестно" }))
                setLoaded(true)
            })
            .catch((error) => {
                console.error("Error while fetching data: ", error)
            });
    }, [dispatch]);

    return (
        <LoadAnimation loaded={loaded}>
            {cargo ? (
                <>
                    <Navbar>
                        <Breadcrumbs />
                    </Navbar>
                    <Card className='shadow-lg text-center text-md-start'>
                        <Row>
                            <div className='col-12 col-md-8 overflow-hidden'>
                                <CardImage url={cargo.photo} />
                            </div>
                            <Card.Body className='col-12 col-md-4 ps-md-0'>
                                <ListGroup variant="flush">
                                    <ListGroup.Item>
                                        <Card.Title>{cargo.name}</Card.Title>
                                        <Card.Text>Категория: {cargo.category}</Card.Text>
                                        <Card.Text>Описание: {cargo.description}</Card.Text>
                                        <Card.Text>Цена: {cargo.price} руб.</Card.Text>
                                        <Card.Text>Масса: {cargo.weight} кг.</Card.Text>
                                        <Card.Text>Объем: {cargo.capacity} м<sup>3</sup></Card.Text>
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card.Body>
                        </Row>
                    </Card>
                </ >
            ) : (
                <h3 className='text-center'>Такого груза нет</h3>
            )}
        </LoadAnimation>
    )
}

export default CargoInfo