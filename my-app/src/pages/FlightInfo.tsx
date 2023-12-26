import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { Card, Row, Col, Navbar, Nav, InputGroup, Form, Button, ButtonGroup } from 'react-bootstrap';

import { axiosAPI } from "../api";
import { IFlight, ICargo } from "../models";

import { AppDispatch, RootState } from "../store";
import { setFlight, resetFlight, setComposition } from "../store/flightSlice";
import { addToHistory } from "../store/historySlice";

import AuthCheck, { CUSTOMER } from '../components/AuthCheck'
import LoadAnimation from '../components/LoadAnimation';
import { SmallCCard } from '../components/CargoCard';
import Breadcrumbs from '../components/Breadcrumbs';

interface ApiResponse {
    flight: IFlight
    cargos: ICargo[]
}

const FlightInfo = () => {
    let { flight_id } = useParams()
    const flight = useSelector((state: RootState) => state.flight.flight);
    const composition = useSelector((state: RootState) => state.flight.flightComposition);
    const [loaded, setLoaded] = useState<boolean>(false)
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation().pathname;
    const [edit, setEdit] = useState(false)
    const [rocket_type, setRocketType] = useState<string>('')
    const navigate = useNavigate()

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
            .then(response => {
                console.log(response.data)
                dispatch(setFlight(response.data))
            })
            .catch((error) => {
                console.error("Error while fetching data:", error);
            });
        setEdit(false);
    }

    const getFlights = () => {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            return
        }

        setLoaded(false)
        axiosAPI.get<ApiResponse>(`/flights/${flight_id}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            }
        })
            .then(response => {
                console.log(response.data)
                dispatch(setFlight(response.data.flight))
                dispatch(setComposition(response.data.cargos))
                setRocketType(response.data.flight.rocket_type ? response.data.flight.rocket_type : '')
                setLoaded(true)
            })
            .catch((error) => {
                console.error("Error while fetching data:", error);
            });
    }

    useEffect(() => {
        getFlights()
        dispatch(addToHistory({ path: location, name: "Полет" }))

        return () => {
            dispatch(resetFlight());
        };
    }, [dispatch]);

    const deleteFromFlight = (id: string) => () => {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            return
        }
        axiosAPI.delete(`/flights/delete_cargo/${id}`, { headers: { 'Authorization': `Bearer ${accessToken}`, } })
            .then(response => {
                dispatch(setComposition(response.data.cargos))
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
                getFlights()
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

    return (
        <AuthCheck allowedRole={CUSTOMER}>
            {loaded ? (
                flight ? (
                    <>
                        <Navbar>
                            <Nav>
                                <Breadcrumbs />
                            </Nav>
                        </Navbar>
                        <Col className='p-3'>
                            <Card className='shadow text center text-md-start'>
                                <Card.Body>
                                    <InputGroup className='mb-1'>
                                        <InputGroup.Text>Статус</InputGroup.Text>
                                        <Form.Control readOnly value={flight.status} />
                                    </InputGroup>
                                    <InputGroup className='mb-1'>
                                        <InputGroup.Text>Создан</InputGroup.Text>
                                        <Form.Control readOnly value={flight.creation_date} />
                                    </InputGroup>
                                    <InputGroup className='mb-1'>
                                        <InputGroup.Text>Сформирован</InputGroup.Text>
                                        <Form.Control readOnly value={flight.formation_date ? flight.formation_date : ''} />
                                    </InputGroup>
                                    <InputGroup className='mb-1'>
                                        <InputGroup.Text>{flight.status === 'отклонен' ? 'Отклонен' : 'Завершен'}</InputGroup.Text>
                                        <Form.Control readOnly value={flight.completion_date ? flight.completion_date : ''} />
                                    </InputGroup>
                                    <InputGroup className='mb-1'>
                                        <InputGroup.Text>Тип ракеты</InputGroup.Text>
                                        <Form.Control
                                            readOnly={!edit}
                                            value={rocket_type}
                                            onChange={(e) => setRocketType(e.target.value)}
                                        />
                                        {!edit && flight.status === 'черновик' && <Button onClick={() => setEdit(true)}>Изменить</Button>}
                                        {edit && <Button variant='success' onClick={update}>Сохранить</Button>}
                                        {edit && <Button
                                            variant='danger'
                                            onClick={() => {
                                                setRocketType(flight.rocket_type ? flight.rocket_type : '');
                                                setEdit(false)
                                            }}>
                                            Отменить
                                        </Button>}
                                    </InputGroup>
                                    {flight.status != 'черновик' &&
                                        <InputGroup className='mb-1'>
                                            <InputGroup.Text>Статус доставки</InputGroup.Text>
                                            <Form.Control readOnly value={flight.shipment_status ? flight.shipment_status : ''} />
                                        </InputGroup>}
                                    {flight.status == 'черновик' &&
                                        <ButtonGroup className='flex-grow-1 w-100'>
                                            <Button variant='success' onClick={confirm}>Сформировать</Button>
                                            <Button variant='danger' onClick={deleteFlight}>Удалить</Button>
                                        </ButtonGroup>}
                                </Card.Body>
                            </Card>
                            <Row className='row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4 px-1 mt-2'>
                                {composition.map((cargo) => (
                                    <div className='d-flex p-2 justify-content-center' key={cargo.uuid}>
                                        <SmallCCard  {...cargo}>
                                            {flight.status == 'черновик' &&
                                                <Button
                                                    variant='outline-danger'
                                                    className='mt-0 rounded-bottom'
                                                    onClick={deleteFromFlight(cargo.uuid)}>
                                                    Удалить
                                                </Button>}
                                        </SmallCCard>
                                    </div>
                                ))}
                            </Row>
                        </Col>
                    </>
                ) : (
                    <h4 className='text-center'>Такого полета не существует</h4>
                )
            ) : (
                <LoadAnimation />
            )}
        </AuthCheck>
    )
}

export default FlightInfo