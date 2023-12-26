import { useEffect, forwardRef, ButtonHTMLAttributes } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useLocation, Link } from 'react-router-dom';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import { Navbar, Form, Button, Table, Col, InputGroup } from 'react-bootstrap';
import { axiosAPI } from "../api";
import { IFlight } from "../models";
import { AppDispatch, RootState } from "../store";
import { setFlights, setStatusFilter, setDateStart, setDateEnd } from "../store/flightSlice";
import { clearHistory, addToHistory } from "../store/historySlice";
import LoadAnimation from '../components/LoadAnimation';
import AuthCheck, { CUSTOMER, MODERATOR } from '../components/AuthCheck'

interface ApiResponse {
    flights: IFlight[]
}

interface CustomInputProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    value?: string;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const AllFlights = () => {
    const flights = useSelector((state: RootState) => state.flight.flights);
    const statusFilter = useSelector((state: RootState) => state.flight.statusFilter);
    const dateStart = useSelector((state: RootState) => state.flight.formationDateStart);
    const dateEnd = useSelector((state: RootState) => state.flight.formationDateEnd);
    const role = useSelector((state: RootState) => state.user.role);
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation().pathname;

    const getFlights = () => {
        let accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            return
        }

        axiosAPI.get<ApiResponse>('/flights', {
            params: {
                ...(statusFilter && { status: statusFilter }),
                ...(dateStart && { form_date_start: format(new Date(dateStart), 'yyyy-MM-dd HH:mm') }),
                ...(dateEnd && { form_date_end: format(new Date(dateEnd), 'yyyy-MM-dd HH:mm') }),
            },
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            }
        })
            .then(response => {
                console.log(response.data)
                dispatch(setFlights(response.data.flights))
            })
            .catch((error) => {
                console.error("Error while fetching data:", error);
            });
    }


    const handleSearch = (event: React.FormEvent<any>) => {
        event.preventDefault();
        getFlights();
    }

    useEffect(() => {
        dispatch(clearHistory())
        dispatch(addToHistory({ path: location, name: "Полеты" }))
        getFlights();
    }, [dispatch]);

    const CustomInput = forwardRef<HTMLButtonElement, CustomInputProps>((props, ref) => (
        <Button
            variant="outline-dark"
            ref={ref}
            size="sm"
            className="text-nowrap shadow-sm"
            style={{ paddingRight: '1.5rem', minWidth: '137px' }}
            {...props}
        >
            {props.value ? props.value : "Введите дату"}
        </Button>
    ));

    return (
        <AuthCheck allowedRole={CUSTOMER}>
            <Navbar>
                <Form className="d-flex flex-row align-items-stretch flex-grow-1 gap-2" onSubmit={handleSearch}>
                    <InputGroup size='sm'>
                        <InputGroup.Text >Статус</InputGroup.Text>
                        <Form.Select
                            defaultValue={statusFilter}
                            onChange={(status) => dispatch(setStatusFilter(status.target.value))}
                            className="shadow-sm"
                        >
                            <option value="">Любой</option>
                            <option value="сформирован">Сформирован</option>
                            <option value="завершен">Завершен</option>
                            <option value="отклонен">Отклонен</option>
                        </Form.Select>
                    </InputGroup>
                    <DatePicker
                        selected={dateStart ? new Date(dateStart) : null}
                        onChange={(date: Date) => dispatch(setDateStart(date))}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={60}
                        isClearable
                        timeCaption="Время"
                        dateFormat="HH:mm MM.d.yyyy"
                        customInput={<CustomInput />}
                        className='text-nowrap'
                    />
                    <DatePicker
                        selected={dateEnd ? new Date(dateEnd) : null}
                        onChange={(date: Date) => dispatch(setDateEnd(date))}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={60}
                        isClearable
                        timeCaption="Время"
                        dateFormat="HH:mm MM.d.yyyy"
                        customInput={<CustomInput />}
                        className='text-nowrap'
                    />
                    <Button
                        variant="primary"
                        size="sm"
                        type="submit"
                        className="shadow-lg">
                        Поиск
                    </Button>
                </Form>
            </Navbar>
            {flights ? (
                <Table bordered hover>
                    <thead>
                        <tr>
                            {role == MODERATOR && <th className='text-center'>Пользователь</th>}
                            <th className='text-center'>Статус</th>
                            <th className='text-center'>Дата создания</th>
                            <th className='text-center'>Дата формирования</th>
                            <th className='text-center'>Дата завершения</th>
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
                                <td className='text-center'>{flight.rocket_type}</td>
                                <td className=''>
                                    <Col className='d-flex flex-col align-items-center justify-content-center'>
                                        <Link to={`/flights/${flight.uuid}`} className='text-decoration-none' >
                                            <Button
                                                variant='outline-secondary'
                                                size='sm'
                                                className='align-self-center'
                                            >
                                                Подробнее
                                            </Button>
                                        </Link>
                                    </Col>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            ) : (
                <LoadAnimation />
            )
            }
        </ AuthCheck >
    );
}

export default AllFlights