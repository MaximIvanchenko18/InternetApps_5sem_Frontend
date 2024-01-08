import { FC, useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useDispatch } from "react-redux";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { getCargo } from '../api'
import { ICargo } from '../models';
import { AppDispatch } from "../store";
import { addToHistory } from "../store/historySlice"
import LoadAnimation from '../components/LoadAnimation';
import { BigCCard } from '../components/CargoCard';
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

    return loaded ? (
        cargo ? (
            <>
                <Navbar>
                    <Nav>
                        <Breadcrumbs />
                    </Nav>
                </Navbar>
                <BigCCard {...cargo} />
            </>
        ) : (
            <h3 className='text-center'>Такого груза нет</h3>
        )
    ) : (
        <LoadAnimation loaded={false}><></></LoadAnimation>
    )
}

export default CargoInfo