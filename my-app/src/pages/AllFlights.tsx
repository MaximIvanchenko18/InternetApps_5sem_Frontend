import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useLocation, Link } from 'react-router-dom';
import { Navbar, Form, Button, Table, InputGroup, ButtonGroup, Col} from 'react-bootstrap';
import { axiosAPI } from '../api';
import { getFlights } from '../api/Flights';
import { IFlight } from "../models";
import { AppDispatch, RootState } from "../store";
import { setUser, setStatus, setDateStart, setDateEnd } from "../store/searchSlice";
import { clearHistory, addToHistory } from "../store/historySlice";
import LoadAnimation from '../components/LoadAnimation';
import { MODERATOR } from '../components/AuthCheck'
import DateTimePicker from '../components/DatePicker';

const AllFlights = () => {
    const [flights, setFlights] = useState<IFlight[]>([]);
    const userFilter = useSelector((state: RootState) => state.search.user);
    const statusFilter = useSelector((state: RootState) => state.search.status);
    const startDate = useSelector((state: RootState) => state.search.formationDateStart);
    const endDate = useSelector((state: RootState) => state.search.formationDateEnd);
    const role = useSelector((state: RootState) => state.user.role);
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation().pathname;
    const [loaded, setLoaded] = useState(false);

    const getFlightsData = () => {
        setLoaded(false)
        getFlights(userFilter, statusFilter, startDate, endDate)
            .then((data) => {
                setFlights(data)
                setLoaded(true)
            })
            .catch((error) => {
                console.error("Error while fetching data:", error)
                setLoaded(true)
            })
    }


    const handleSearch = (event: React.FormEvent<any>) => {
        event.preventDefault()
        getFlightsData()
    }

    useEffect(() => {
        dispatch(clearHistory())
        dispatch(addToHistory({ path: location, name: "Полеты" }))
        getFlightsData()
        const intervalId = setInterval(() => {
            getFlightsData();
        }, 6000);
        return () => clearInterval(intervalId);
    }, [dispatch, userFilter, statusFilter, startDate, endDate]);

    const moderator_confirm = (id: string, confirm: boolean) => () => {
        const accessToken = localStorage.getItem('access_token');
        axiosAPI.put(`/flights/${id}/moderator_confirm`,
            { confirm: confirm },
            { headers: { 'Authorization': `Bearer ${accessToken}`, } })
            .then(() => setFlights(prevFLights => [...prevFLights]))
    }

    return (
        <>
            <Navbar>
                <Form className="d-flex flex-wrap align-items-stretch flex-grow-1" onSubmit={handleSearch}>
                    {role == MODERATOR && <Form.Group as={Col} xs={12} md={3} style={{paddingRight: '10px'}}><InputGroup size='sm' className='shadow-sm'>
                        <InputGroup.Text>Пользователь</InputGroup.Text>
                        <Form.Control value={userFilter} onChange={(e) => dispatch(setUser(e.target.value))}/>
                    </InputGroup></Form.Group>}
                    <Form.Group as={Col} xs={12} md={role == MODERATOR ? 3: 4} style={{paddingRight: '10px'}}>
                    <InputGroup size='sm' className='shadow-sm'>
                        <InputGroup.Text >Статус</InputGroup.Text>
                        <Form.Select
                            defaultValue={statusFilter}
                            onChange={(status) => dispatch(setStatus(status.target.value))}
                            className="shadow-sm"
                        >
                            <option value="">Любой</option>
                            <option value="сформирован">Сформирован</option>
                            <option value="завершен">Завершен</option>
                            <option value="отклонен">Отклонен</option>
                        </Form.Select>
                    </InputGroup>
                    </Form.Group>
                    <Form.Group as={Col} xs={12} md={role == MODERATOR ? 3: 4} style={{paddingRight: '10px'}}>
                    <DateTimePicker
                        selected={startDate ? new Date(startDate) : null}
                        onChange={(date: Date) => dispatch(setDateStart(date ? date.toISOString() : null))}
                    />
                    </Form.Group>
                    <Form.Group as={Col} xs={12} md={role == MODERATOR ? 3: 4} style={{paddingRight: '10px'}}>
                    <DateTimePicker
                        selected={endDate ? new Date(endDate) : null}
                        onChange={(date: Date) => dispatch(setDateEnd(date ? date.toISOString() : null))}
                    />
                    </Form.Group>
                </Form>
            </Navbar>
            <LoadAnimation loaded={loaded}>
                <Table bordered hover responsive>
                    <thead>
                        <tr>
                            {role == MODERATOR && <th className='text-center'>Заказчик</th>}
                            <th className='text-center'>Статус</th>
                            <th className='text-center'>Дата создания</th>
                            <th className='text-center'>Дата формирования</th>
                            <th className='text-center'>Дата завершения</th>
                            <th className='text-center'>Статус доставки</th>
                            <th className='text-center'>Тип ракеты</th>
                            <th className='text-center'></th>
                        </tr>
                    </thead>
                    <tbody>
                        {flights.map((flight) => (
                            <tr key={flight.uuid}>
                                {role == MODERATOR && <td className='text-center'>{flight.customer}</td>}
                                <td className='text-center'>{flight.status}</td>
                                <td className='text-center'>{flight.creation_date}</td>
                                <td className='text-center'>{flight.formation_date}</td>
                                <td className='text-center'>{flight.completion_date}</td>
                                <td className='text-center'>{flight.shipment_status}</td>
                                <td className='text-center'>{flight.rocket_type}</td>
                                <td className='p-0 text-center align-middle'>
                                    <Table className='m-0'>
                                        <tbody>
                                            <tr>
                                                <td className='py-1 border-0' style={{ background: 'transparent' }}>
                                                    <Link to={`/flights/${flight.uuid}`}
                                                        className='btn btn-sm btn-outline-secondary text-decoration-none w-100' >
                                                        Подробнее
                                                    </Link>
                                                </td>
                                            </tr>
                                            {flight.status == 'сформирован' && role == MODERATOR &&
                                                <tr>
                                                    <td className='py-1 border-0' style={{ background: 'transparent' }}>
                                                        <ButtonGroup className='flex-grow-1 w-100'>
                                                            <Button variant='outline-success' size='sm' onClick={moderator_confirm(flight.uuid, true)}>Подтвердить</Button>
                                                            <Button variant='outline-danger' size='sm' onClick={moderator_confirm(flight.uuid, false)}>Отклонить</Button>
                                                        </ButtonGroup>
                                                    </td>
                                                </tr>}
                                        </tbody>
                                    </Table>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </LoadAnimation >
        </>
    )
}

export default AllFlights