import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BigRCard, ICargoProps } from '../components/CargoCard';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import LoadAnimation from '../components/LoadAnimation';
import { getCargo } from '../requests/GetCargo'


const CargoInfo: FC = () => {
    let { cargo_id } = useParams()
    const [cargo, setCargo] = useState<ICargoProps>()
    const [loaded, setLoaded] = useState<boolean>(false)

    useEffect(() => {
        getCargo(cargo_id)
            .then(data => {
                setCargo(data)
                setLoaded(true)
            })
            .catch((error) => {
                console.error("Error while fetching data: ", error);
            });
    }, []);

    return (
        <>
            <Navbar>
                <Nav>
                <Link to="/cargo" className="nav-link p-0 text-dark" data-bs-theme="dark">
                    Грузы
                </Link>
                <Nav.Item className='mx-1'>{">"}</Nav.Item>
                <Nav.Item className="nav-link p-0 text-dark">
                    {`${cargo ? cargo.name : 'неизвестно'}`}
                </Nav.Item>
                </Nav>
            </Navbar>
            {loaded ? (
                 cargo ? (
                    <BigRCard {...cargo} />
                 ) : (
                     <h3 className='text-center'>Такого груза не существует</h3>
                 )
            ) : (
                <LoadAnimation />
            )
            }
        </>
    )
}

export { CargoInfo }