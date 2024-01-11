import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { Card, Row, Col, Navbar, InputGroup, Form, Button, ButtonGroup } from 'react-bootstrap';
import { axiosAPI } from "../api";
import { getFlight } from '../api/Flights';
import { IFlight } from "../models";
import { AppDispatch, RootState } from "../store";
import { addToHistory } from "../store/historySlice";
import LoadAnimation from '../components/LoadAnimation';
import { SmallCCard } from '../components/CargoCard';
import Breadcrumbs from '../components/Breadcrumbs';
import {FlightComposition} from '../api/Flights';
import { MODERATOR } from '../components/AuthCheck';

const FlightInfo = () => {
    let { flight_id } = useParams()
    const [flight, setFlight] = useState<IFlight | null>(null)
    const [composition, setComposition] = useState<FlightComposition[] | null>([])
    const role = useSelector((state: RootState) => state.user.role)
    const [loaded, setLoaded] = useState(false)
    const dispatch = useDispatch<AppDispatch>()
    const location = useLocation().pathname
    const navigate = useNavigate()
    const [edit, setEdit] = useState(false)
    const [rocket_type, setRocketType] = useState<string>('')
    const [quantities, setQuantities] = useState<number[]>([])

    const getFlightData = () => {
        setLoaded(false)
        getFlight(flight_id)
            .then(data => {
                if (data === null) {
                    setFlight(null)
                    setComposition([])
                    setQuantities([])
                } else {
                    setFlight(data.flight)
                    setRocketType(data.flight.rocket_type ? data.flight.rocket_type : '')
                    setComposition(data.cargos)
                    setQuantities(data.cargos.map((cargo) => cargo.cargo_quantity))
                }
                setLoaded(true)
            })
            .catch((error) => {
                console.error("Error while fetching data:", error);
                setLoaded(true)
            });
    }

    const update = () => {
        let accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            return
        }
        axiosAPI.put(`/flights`,
            { rocket_type: rocket_type },
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                }
            })
            .then(() => getFlightData())
            .catch((error) => {
                console.error("Error while fetching data:", error);
            });
        setEdit(false);
    }

    useEffect(() => {
        getFlightData()
        dispatch(addToHistory({ path: location, name: "Полет" }))
    }, [dispatch]);

    const deleteFromFlight = (id: string) => () => {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            return
        }
        axiosAPI.delete(`/flights/delete_cargo/${id}`, { headers: { 'Authorization': `Bearer ${accessToken}`, } })
            .then(() => getFlightData())
            .catch((error) => {
                console.error("Error while fetching data:", error);
            });
    }

    const updateQuantity = (id: string, quantityOrig: number, index: number) => () => {
        let accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            return
        }
        if (quantityOrig <= 0) {
            return
        }
        axiosAPI.put(`/flights/change_cargo/${id}`,
            { quantity: quantityOrig},
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                }
            })
            .then(() => {
                setQuantities(quantities.map((quantity, i) => (i === index) ?
                quantityOrig : quantity))
            })
            .catch((error) => {
                console.error("Error while fetching data:", error);
            });
    }

    const confirm = () => {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            return
        }
        axiosAPI.put('/flights/user_confirm', null, { headers: { 'Authorization': `Bearer ${accessToken}`, } })
            .then(_ => {
                getFlightData()
            })
            .catch((error) => {
                console.error("Error while fetching data:", error);
            });
    }

    const deleteFlight = () => {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            return
        }
        axiosAPI.delete('/flights', { headers: { 'Authorization': `Bearer ${accessToken}`, } })
            .then(_ => {
                navigate('/cargo')
            })
            .catch((error) => {
                console.error("Error while fetching data:", error);
            });
    }

    const moderator_confirm = (confirm: boolean) => () => {
        const accessToken = localStorage.getItem('access_token');
        axiosAPI.put(`/flights/${flight?.uuid}/moderator_confirm`,
            { confirm: confirm },
            { headers: { 'Authorization': `Bearer ${accessToken}`, } })
            .then(() => getFlightData())
    }

    return (
        <LoadAnimation loaded={loaded}>
            {flight ? (
                <>
                    <Navbar>
                        <Breadcrumbs />
                    </Navbar>
                    <Col className='p-3'>
                        <Card className='shadow text center text-md-start'>
                            <Card.Body>
                                <InputGroup className='mb-1 flex-wrap'>
                                    <InputGroup.Text className='t-input-group-text'>Статус</InputGroup.Text>
                                    <Form.Control readOnly value={flight.status} style={{minWidth: `${flight.status.length * 12}px`}}/>
                                </InputGroup>
                                <InputGroup className='mb-1'>
                                    <InputGroup.Text className='t-input-group-text'>Создан</InputGroup.Text>
                                    <Form.Control readOnly value={flight.creation_date} style={{minWidth: `${flight.creation_date.length * 10}px`}}/>
                                </InputGroup>
                                <InputGroup className='mb-1'>
                                    <InputGroup.Text className='t-input-group-text'>Сформирован</InputGroup.Text>
                                    <Form.Control readOnly value={flight.formation_date ? flight.formation_date : ''}
                                        style={{minWidth: flight.formation_date ? `${flight.formation_date.length * 10}px` : 'auto'}}/>
                                </InputGroup>
                                {(flight.status == 'отклонен' || flight.status == 'завершен') && <InputGroup className='mb-1'>
                                    <InputGroup.Text className='t-input-group-text'>{flight.status === 'отклонен' ? 'Отклонен' : 'Завершен'}</InputGroup.Text>
                                    <Form.Control readOnly value={flight.completion_date ? flight.completion_date : ''}
                                        style={{minWidth: flight.completion_date ? `${flight.completion_date.length * 10}px` : 'auto'}}/>
                                </InputGroup>}
                                <InputGroup className='mb-1'>
                                    <InputGroup.Text className='t-input-group-text'>Тип ракеты</InputGroup.Text>
                                    <Form.Control style={{minWidth: `${rocket_type.length * 12}px`}}
                                        readOnly={!edit}
                                        value={rocket_type}
                                        onChange={(e) => setRocketType(e.target.value)}
                                    />
                                    {!edit && flight.status === 'черновик' && <Button variant='light' onClick={() => setEdit(true)}>Изменить</Button>}
                                    {edit && <Button variant='success' onClick={update}>Сохранить</Button>}
                                    {edit && <Button
                                        variant='danger'
                                        onClick={() => {
                                            setRocketType(flight.rocket_type ? flight.rocket_type : '')
                                            setEdit(false)
                                        }}>
                                        Отменить
                                    </Button>}
                                </InputGroup>
                                {flight.status != 'черновик' &&
                                    <InputGroup className='mb-1'>
                                        <InputGroup.Text className='t-input-group-text'>Статус доставки</InputGroup.Text>
                                        <Form.Control readOnly value={flight.shipment_status ? flight.shipment_status : ''}
                                            style={{minWidth: flight.shipment_status ? `${flight.shipment_status.length * 12}px` : 'auto'}}/>
                                    </InputGroup>}
                                {flight.status == 'сформирован' && role == MODERATOR &&
                                    <ButtonGroup className='flex-grow-1 w-100'>
                                        <Button variant='success' onClick={moderator_confirm(true)}>Подтвердить</Button>
                                        <Button variant='danger' onClick={moderator_confirm(false)}>Отклонить</Button>
                                    </ButtonGroup>}
                                {flight.status == 'черновик' &&
                                    <ButtonGroup className='flex-grow-1 w-100'>
                                        <Button variant='success' onClick={confirm}>Сформировать</Button>
                                        <Button variant='danger' onClick={deleteFlight}>Удалить</Button>
                                    </ButtonGroup>}
                            </Card.Body>
                        </Card>
                        {composition && <Row className='row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4 px-1 mt-2'>
                            {composition.map((cargo, index) => (
                                <div className='d-flex p-2 justify-content-center' key={cargo.cargo_info.uuid}>
                                    <SmallCCard  {...cargo.cargo_info}>
                                        {flight.status == 'черновик' &&
                                            <Button
                                                variant='danger'
                                                className='mt-0 rounded-bottom border border-dark'
                                                onClick={deleteFromFlight(cargo.cargo_info.uuid)}>
                                                Удалить из корзины
                                            </Button>}
                                        
                                        <InputGroup className='mb-1'>
                                            <InputGroup.Text className='t-input-group-text'>Штук</InputGroup.Text>
                                            <Form.Control
                                                type="number"
                                                min="1"
                                                readOnly={flight.status == 'черновик' ? false : true}
                                                value={quantities[index]}
                                                onChange={(e) => dispatch(updateQuantity(cargo.cargo_info.uuid, parseInt(e.target.value), index))}
                                            />
                                        </InputGroup>
                                        {flight.status == 'черновик' &&
                                            <div className='my-display-inline'>
                                                <Button
                                                    className='my-edit-button'
                                                    variant='danger'
                                                    onClick={ updateQuantity(cargo.cargo_info.uuid, quantities[index] - 1, index) }>
                                                    -
                                                </Button>
                                                <Button
                                                    className='my-edit-button'
                                                    variant='success'
                                                    onClick={ updateQuantity(cargo.cargo_info.uuid, quantities[index] + 1, index) }>
                                                    +
                                                </Button>
                                            </div>}
                                    </SmallCCard>
                                </div>
                            ))}
                        </Row>}
                    </Col>
                </>
            ) : (
                <h4 className='text-center'>Такого полета нет</h4>
            )}
        </LoadAnimation>
    )
}

export default FlightInfo