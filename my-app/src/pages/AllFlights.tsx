import { useEffect, forwardRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import { useLocation } from 'react-router-dom';
import { axiosAPI } from "../api";
import { IFlight } from "../models";
import { AppDispatch, RootState } from "../store";
import { setFlights, setStatusFilter, setDateStart, setDateEnd } from "../store/flightSlice";
import { clearHistory, addToHistory } from "../store/historySlice";
import LoadAnimation from '../components/LoadAnimation';
import AuthCheck, { CUSTOMER } from '../components/AuthCheck'

interface ApiResponse {
    flights: IFlight[]
}

const AllFlights = () => {
    const flights = useSelector((state: RootState) => state.flight.flights);
    const statusFilter = useSelector((state: RootState) => state.flight.statusFilter);
    const dateStart = useSelector((state: RootState) => state.flight.formationDateStart);
    const dateEnd = useSelector((state: RootState) => state.flight.formationDateEnd);
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
                ...(dateStart && { formation_date_start: format(new Date(dateStart), 'yyyy-MM-dd HH:mm') }),
                ...(dateEnd && { formation_date_end: format(new Date(dateEnd), 'yyyy-MM-dd HH:mm') }),
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

    const CustomInput = forwardRef(({ value, onClick }, ref) => (
        <Button
            variant="outline-dark"
            onClick={onClick}
            ref={ref}
            size="sm"
            className="text-nowrap shadow-sm"
            style={{ paddingRight: '1.5rem', minWidth: '137px' }}
        >
            {value ? value : "Введите дату"}
        </Button>
    ));

    return (
        <AuthCheck allowedRole={CUSTOMER}>
            <Navbar>
                <Form className="d-flex flex-row align-items-stretch flex-grow-1 gap-2" onSubmit={handleSearch}>
                    <Form.Label className="m-0">Статус:</Form.Label>
                    <Form.Select
                        defaultValue={statusFilter}
                        onChange={(status) => dispatch(setStatusFilter(status.target.value))}
                        className="shadow-sm"
                        size="sm"
                    >
                        <option value="">Любой</option>
                        <option value="сформирован">Сформирован</option>
                        <option value="завершен">Завершен</option>
                        <option value="отклонен">Отклонен</option>
                    </Form.Select>
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
                            <th>Статус</th>
                            <th>Дата создания</th>
                            <th>Дата формирования</th>
                            <th>Дата завершения</th>
                            <th>Тип ракеты</th>
                        </tr>
                    </thead>
                    <tbody>
                        {flights.map((flight) => (
                            <tr key={flight.uuid}>
                                <td>{flight.status}</td>
                                <td>{flight.creation_date}</td>
                                <td>{flight.formation_date}</td>
                                <td>{flight.completion_date}</td>
                                <td>{flight.rocket_type}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            ) : (
                <LoadAnimation />
            )}
        </ AuthCheck>
    );
}

export default AllFlights