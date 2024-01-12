import { useEffect, useState } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useDispatch, useSelector } from "react-redux";
import { useLocation, Link } from 'react-router-dom';
import { getAllCargo, axiosAPI } from '../api'
import { ICargo } from '../models'
import { AppDispatch, RootState } from "../store";
import { setSearchCargoName, setLowPrice, setHighPrice } from "../store/searchSlice"
import { clearHistory, addToHistory } from "../store/historySlice"
import { SmallCCard } from '../components/CargoCard';
import LoadAnimation from '../components/LoadAnimation';

const AllCargos = () => {
    const searchCargoName = useSelector((state: RootState) => state.search.searchCargoName);
    const searchLowPrice = useSelector((state: RootState) => state.search.searchLowPrice);
    const searchHighPrice = useSelector((state: RootState) => state.search.searchHighPrice);
    const [cargos, setCargos] = useState<ICargo[]>([]);
    const [draft, setDraft] = useState<string | null>(null);
    const role = useSelector((state: RootState) => state.user.role);
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation().pathname;
    const [loaded, setLoaded] = useState(false);

    const getCargos = () => {
        setLoaded(false)
        getAllCargo(searchCargoName, searchLowPrice, searchHighPrice)
            .then(data => {
                setCargos(data.cargos)
                setDraft(data.draft_flight)
                setLoaded(true)
            })
            .catch((error) => {
                console.error("Error while fetching data:", error);
                setLoaded(true)
            });
    }
    
    const handleSearch = (event: React.FormEvent<any>) => {
        event.preventDefault();
        setCargos([]);
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

        axiosAPI.post(`/cargo/${id}/add_to_flight`, {quantity: 1}, { headers: { 'Authorization': `Bearer ${accessToken}`, } })
            .then(() => {
                getCargos();
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
                        className="form-control-sm flex-grow-1 shadow shadow-sm border border-dark"
                        data-bs-theme="light"
                        value={searchCargoName}
                        onChange={(e) => dispatch(setSearchCargoName(e.target.value))}
                    />
                    <Form.Control
                        type="number"
                        placeholder="Цена от"
                        className="form-control-sm flex-grow-1 shadow shadow-sm border border-dark"
                        data-bs-theme="light"
                        value={searchLowPrice < 0 ? '' : searchLowPrice}
                        min="0"
                        onChange={(e) => dispatch(setLowPrice(e.target.value))}
                    />
                    <Form.Control
                        type="number"
                        placeholder="Цена до"
                        className="form-control-sm flex-grow-1 shadow shadow-sm border border-dark"
                        data-bs-theme="light"
                        value={searchHighPrice < 0 ? '': searchHighPrice}
                        min="0"
                        onChange={(e) => dispatch(setHighPrice(e.target.value))}
                    />
                    <Button
                        variant="primary"
                        size="sm"
                        type="submit"
                        className="shadow-lg border border-dark">
                        Поиск
                    </Button>
                </Form>
            </Navbar>
            <div className='row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4 px-1'>
                <LoadAnimation loaded={loaded}>
                    {cargos.map((cargo) => (
                        <div className='my-cards-wrapper' key={cargo.uuid}>
                            <SmallCCard  {...cargo}>
                                {role != 0 &&
                                    <Button
                                        variant='primary'
                                        className='mt-0 rounded-bottom border border-dark'
                                        onClick={addToFlight(cargo.uuid)}>
                                        Добавить в корзину
                                    </Button>
                                }
                            </SmallCCard>
                        </div>
                    ))}
                </LoadAnimation>
            </div>
            {!!role && <Link to={`/flights/${draft}`}>
                <Button
                    style={{ position: 'fixed', bottom: '16px', right: '16px', zIndex: '1000' }}
                    className="btn btn-primary rounded-pill"
                    disabled={!draft}>
                    Корзина
                </Button>
            </Link>}
        </>
    )
}

export default AllCargos