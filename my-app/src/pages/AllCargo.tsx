import { useEffect } from 'react';
import { SmallCCard } from '../components/CargoCard';
import LoadAnimation from '../components/LoadAnimation';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { getAllCargo } from '../api'
import { AppDispatch, RootState } from "../store";
import { useDispatch, useSelector } from "react-redux";
import { setCargos, setSearchText, setLowPrice, setHighPrice } from "../store/cargoSlice"
import { setDraft } from '../store/flightSlice';

const AllCargos = () => {
    const cargos = useSelector((state: RootState) => state.cargo.cargos);
    const searchText = useSelector((state: RootState) => state.cargo.searchText);
    const searchLowPrice = useSelector((state: RootState) => state.cargo.searchLowPrice);
    const searchHighPrice = useSelector((state: RootState) => state.cargo.searchHighPrice);
    //const _ = useSelector((state: RootState) => state.flight.draft);
    const dispatch = useDispatch<AppDispatch>();

    const getCargos = () =>
        getAllCargo(searchText, searchLowPrice, searchHighPrice)
            .then(data => {
                dispatch(setCargos(data?.cargos))
                dispatch(setDraft(data?.draft_flight))
            })
            .catch((error) => {
                console.error("Error while fetching data:", error);
            });
    
    const handleSearch = (event: React.FormEvent<any>) => {
        event.preventDefault();
        getCargos();
    }

    useEffect(() => {
        getCargos();
    }, [dispatch]);

    return (
        <>
            <Navbar>
                <Nav.Item className="nav-link p-0 text-dark">Грузы</Nav.Item>
                <Nav.Item className='mx-1'>{">"}</Nav.Item>
            </Navbar>
            <Navbar>
                <Form className="d-flex flex-row flex grow-1 gap-2" onSubmit={handleSearch}>
                    <Form.Control
                        type="text"
                        placeholder="Название"
                        className="form-control-sm flex-grow-1 shadow shadow-sm"
                        data-bs-theme="dark"
                        value={searchText}
                        onChange={(e) => dispatch(setSearchText(e.target.value))}
                    />
                    <Form.Control
                        type="number"
                        placeholder="Цена от"
                        className="form-control-sm flex-grow-1 shadow shadow-sm"
                        data-bs-theme="dark"
                        value={searchLowPrice}
                        min="0"
                        onChange={(e) => dispatch(setLowPrice(e.target.value))}
                    />
                    <Form.Control
                        type="number"
                        placeholder="Цена до"
                        className="form-control-sm flex-grow-1 shadow shadow-sm"
                        data-bs-theme="dark"
                        value={searchHighPrice}
                        min="0"
                        onChange={(e) => dispatch(setHighPrice(e.target.value))}
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
            <div className='row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4 px-1'>
                {cargos ? (
                    cargos.map((cargo) => (
                        <div className='d-flex p-2 justify-content-center' key={cargo.uuid}>
                            <SmallCCard {...cargo} />
                        </div>
                    ))
                ) : (
                    <LoadAnimation />
                )} 
            </div>
        </>
    )
}

export default AllCargos