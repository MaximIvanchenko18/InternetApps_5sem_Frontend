import { FC, useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { BigCCard } from '../components/CargoCard';
import LoadAnimation from '../components/LoadAnimation';
import { getCargo } from '../api'
import { AppDispatch, RootState } from "../store";
import { setCargo, resetCargo } from "../store/cargoSlice"
import Breadcrumbs from '../components/Breadcrumbs';
import { addToHistory } from "../store/historySlice"

const CargoInfo: FC = () => {
    let { cargo_id } = useParams()
    const cargo = useSelector((state: RootState) => state.cargo.cargo);
    const [loaded, setLoaded] = useState<boolean>(false)
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation().pathname;

    useEffect(() => {
        getCargo(cargo_id)
            .then(data => {
                dispatch(setCargo(data))
                dispatch(addToHistory({ path: location, name: data ? data.name : "неизвестно" }))
                setLoaded(true)
            })
            .catch((error) => {
                console.error("Error while fetching data: ", error);
            });

        return () => {
            dispatch(resetCargo());
        };
    }, [dispatch]);

    return loaded ? (
        cargo ? (
            <>
                <Navbar>
                    <Nav>
                        <Breadcrumbs />
                    </Nav>
                </Navbar>
                <BigCCard {...cargo} />
            </ >
        ) : (
            <h3 className='text-center'>Такого груза не существует</h3>
        )
    ) : (
        <LoadAnimation />
    )
}

export default CargoInfo