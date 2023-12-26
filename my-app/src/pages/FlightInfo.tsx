import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation } from 'react-router-dom'
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

import { axiosAPI } from "../api";
import { IFlight, ICargo } from "../models";

import { AppDispatch, RootState } from "../store";
import { setFlight, setComposition } from "../store/flightSlice";
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

    useEffect(() => {
        let accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            return
        }

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
                dispatch(addToHistory({ path: location, name: "Полет" }))
                setLoaded(true)
            })
            .catch((error) => {
                console.error("Error while fetching data:", error);
            });
    }, [dispatch]);

    return loaded ? (
        flight ? (
            <AuthCheck allowedRole={CUSTOMER}>
                <Navbar>
                    <Nav>
                        <Breadcrumbs />
                    </Nav>
                </Navbar>
                <Card className='shadow-lg text center text-md-start'>
                    <Row className="m-0">
                        <Card.Body className='col-12 col-md-4 pe-md-0'>
                            <Card.Text>Статус: {flight.status}</Card.Text>
                            <Card.Text>Дата создания: {dateToString(new Date(flight.creation_date))}</Card.Text>
                            {flight.formation_date ? (<Card.Text>Дата формирования: {dateToString(new Date(flight.formation_date))}</Card.Text>) : (<></>)}
                            {flight.completion_date ? <Card.Text>Дата подтверждения: {dateToString(new Date(flight.completion_date))}</Card.Text> : <></>}
                            <Card.Text>Тип ракеты: {flight.rocket_type ? flight.rocket_type : "Неизвестен"}</Card.Text>
                        </Card.Body>
                        <Col className='col-12 col-md-8'>
                            <Row className='row-cols-1 row-cols-sm-2 row-cols-xl-4 px-1'>
                                {composition.map((cargo) => (
                                    <div className='d-flex p-2 justify-content-center' key={cargo.uuid}>
                                        <SmallCCard  {...cargo} />
                                    </div>
                                ))}
                            </Row>
                        </Col>
                    </Row>
                </Card>
            </AuthCheck >
        ) : (
            <h4 className='text-center'>Такого полета не существует</h4>
        )
    ) : (
        <LoadAnimation />
    )

}

export default FlightInfo

function dateToString(date: Date | null): string {
    if (!date) {
        return ""
    }
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${day}.${month}.${year} ${hours}:${minutes}`;
}