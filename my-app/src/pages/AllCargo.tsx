import { useEffect } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useDispatch, useSelector } from "react-redux";
import { useLocation, Link } from 'react-router-dom';
import { SmallCCard } from '../components/CargoCard';
import LoadAnimation from '../components/LoadAnimation';
import { getAllCargo, axiosAPI } from '../api'
import { AppDispatch, RootState } from "../store";
import { setCargos, setSearchText, setLowPrice, setHighPrice } from "../store/cargoSlice"
import { setDraft } from '../store/flightSlice';
import { clearHistory, addToHistory } from "../store/historySlice"

const AllCargos = () => {
    const cargos = useSelector((state: RootState) => state.cargo.cargos);
    const searchText = useSelector((state: RootState) => state.cargo.searchText);
    const searchLowPrice = useSelector((state: RootState) => state.cargo.searchLowPrice);
    const searchHighPrice = useSelector((state: RootState) => state.cargo.searchHighPrice);
    const role = useSelector((state: RootState) => state.user.role);
    const draft = useSelector((state: RootState) => state.flight.draft);
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation().pathname;

    const getCargos = () =>
        getAllCargo(searchText, searchLowPrice, searchHighPrice)
            .then(data => {
                dispatch(setCargos(data?.cargos))
                dispatch(setDraft(data?.draft_flight?.uuid))
            })
            .catch((error) => {
                console.error("Error while fetching data:", error);
            });
    
    const handleSearch = (event: React.FormEvent<any>) => {
        event.preventDefault();
        getCargos();
    }

    useEffect(() => {
        dispatch(clearHistory())
        dispatch(addToHistory({ path: location, name: "Грузы" }))
        getCargos();
    }, [dispatch]);

    const addToFlight = (id: string) => () => {
        let accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            return
        }

        axiosAPI.post(`/cargo/${id}/add_to_flight`, null, { headers: { 'Authorization': `Bearer ${accessToken}`, } })
            .then(response => {
                dispatch(setDraft(response.data.uuid))
            })
            .catch((error) => {
                console.error("Error while fetching data:", error);
            });
    }

    return (
        <>
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
                            <SmallCCard  {...cargo}>
                                {role != '0' &&
                                    <Button
                                        variant='outline-primary'
                                        className='mt-0 rounded-bottom'
                                        onClick={addToFlight(cargo.uuid)}>
                                        Добавить в корзину
                                    </Button>
                                }
                            </SmallCCard>
                        </div>
                    ))
                ) : (
                    <LoadAnimation />
                )}
            </div>
            {draft && <Link
                to={`/flights/${draft}`}
                className="btn btn-primary rounded-pill"
                style={{ position: 'fixed', bottom: '16px', right: '16px', zIndex: '1000' }}>
                Корзина
            </Link>}
        </>
    )
}

export default AllCargos