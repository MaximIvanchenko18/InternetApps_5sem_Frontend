import { useEffect, useState } from 'react';
import { Navbar, Form, Button, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux";
import { useLocation, Link } from 'react-router-dom';
import { getAllCargo, axiosAPI } from '../api'
import { ICargo } from '../models'
import { AppDispatch, RootState } from "../store";
import { setSearchCargoName, setLowPrice, setHighPrice } from "../store/searchSlice"
import { clearHistory, addToHistory } from "../store/historySlice"
import LoadAnimation from '../components/LoadAnimation';
import CardImage from '../components/CardImage';

const CargoTable = () => {
    const searchCargoName = useSelector((state: RootState) => state.search.searchCargoName);
    const searchLowPrice = useSelector((state: RootState) => state.search.searchLowPrice);
    const searchHighPrice = useSelector((state: RootState) => state.search.searchHighPrice);
    const [cargos, setCargos] = useState<ICargo[]>([])
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation().pathname;
    const [loaded, setLoaded] = useState(false);

    const getCargos = () => {
        setLoaded(false)
        getAllCargo(searchCargoName, searchLowPrice, searchHighPrice)
            .then(data => {
                setCargos(data.cargos)
                setLoaded(true)
            })
            .catch((error) => {
                console.error("Error while fetching data:", error)
                setLoaded(true)
            });
    }

    const handleSearch = (event: React.FormEvent<any>) => {
        event.preventDefault();
        setCargos([])
        getCargos();
    }

    useEffect(() => {
        dispatch(clearHistory())
        dispatch(addToHistory({ path: location, name: "Управление грузами" }))
        getCargos();
    }, [dispatch]);

    const deleteCargo = (uuid: string) => () => {
        let accessToken = localStorage.getItem('access_token');
        axiosAPI.delete(`/cargo/${uuid}`, { headers: { 'Authorization': `Bearer ${accessToken}`, } })
            .then(() => getCargos())
    }

    return (
        <>
            <Navbar>
                <Form className="d-flex flex-row flex-grow-1 gap-2" onSubmit={handleSearch}>
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
                    <Link to='new' className='btn btn-sm btn-success shadow ms-sm-2'>Создать</Link>
                </Form>
            </Navbar>
            <LoadAnimation loaded={loaded}>
                <Table bordered hover responsive>
                    <thead>
                        <tr>
                            <th className='text-center'>Изображение</th>
                            <th className='text-center'>Название</th>
                            <th className='text-center'>Категория</th>
                            <th className='text-center'>Цена, руб</th>
                            <th className='text-center text-nowrap'>Масса, кг</th>
                            <th className=''></th>
                        </tr>
                    </thead>
                    <tbody>
                        {cargos.map((cargo) => (
                            <tr key={cargo.uuid}>
                                <td style={{ width: '15%' }} className='p-0'>
                                    <CardImage url={cargo.photo} />
                                </td>
                                <td className='text-center' style={{ backgroundColor: '#d7faf9' }}>{cargo.name}</td>
                                <td className='text-center' style={{ backgroundColor: '#d7faf9' }}>{cargo.category}</td>
                                <td className='text-center' style={{ backgroundColor: '#d7faf9' }}>{cargo.price}</td>
                                <td className='text-center' style={{ backgroundColor: '#d7faf9' }}>{cargo.weight}</td>
                                <td className='text-center align-middle p-0'>
                                    <Table className='m-0'>
                                        <tbody>
                                            <tr>
                                                <td className='py-1 border-0' style={{ background: 'transparent' }}>
                                                    <Link
                                                        to={`/cargos-edit/${cargo.uuid}`}
                                                        className='btn btn-sm btn-light text-decoration-none w-100' >
                                                        Редактировать
                                                    </Link>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className='py-1 border-0' style={{ background: 'transparent' }}>
                                                    <Button
                                                        variant='danger'
                                                        size='sm'
                                                        className='w-100'
                                                        onClick={deleteCargo(cargo.uuid)}>
                                                        Удалить
                                                    </Button>
                                                </td>
                                            </tr>
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

export default CargoTable