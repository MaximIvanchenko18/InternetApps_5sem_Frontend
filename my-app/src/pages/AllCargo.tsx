import { useEffect, useState, FC } from 'react';
import { SmallRCard, ICargoProps } from '../components/CargoCard';
import LoadAnimation from '../components/LoadAnimation';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { getAllCargo } from '../requests/GetAllCargo'
import Nav from 'react-bootstrap/Nav';

interface ISearchProps {
    setCargo: React.Dispatch<React.SetStateAction<ICargoProps[]>>
}

const Search: FC<ISearchProps> = ({ setCargo }) => {
    const [searchName, setSearchText] = useState<string>('');
    const [searchLowPrice, setSearchLowPrice] = useState<number | undefined>(undefined);
    const [searchHighPrice, setSearchHighPrice] = useState<number | undefined>(undefined);
    //let lowest_price, highest_price

    // При удалении числа в поле фильтра не 0, а пустое поле
    if (searchLowPrice === 0) setSearchLowPrice(undefined)
    if (searchHighPrice === 0) setSearchHighPrice(undefined)

    const handleSearch = (event: React.FormEvent<any>) => {
        event.preventDefault();
        getAllCargo(searchName, searchLowPrice, searchHighPrice)
            .then(data => {
                /*if (searchLowPrice === undefined && searchHighPrice === undefined && data.cargos.length > 0) {  // Цены по умолчанию
                    lowest_price = data.cargos[0].price
                    highest_price = data.cargos[0].price
                    for (let cargo of data.cargos) {
                        if (cargo.price > highest_price) highest_price = cargo.price
                        if (cargo.price < lowest_price) lowest_price = cargo.price
                    }
                    setSearchLowPrice(lowest_price)
                    setSearchHighPrice(highest_price)
                }*/
                console.log(data)
                setCargo(data.cargos)
            })
    }
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
                    data-bs-theme="primary"
                    value={searchName}
                    onChange={(e) => setSearchText(e.target.value)}
                />
                <Form.Control
                    type="number"
                    placeholder="Цена от"
                    className="form-control-sm flex-grow-1 shadow shadow-sm"
                    data-bs-theme="primary"
                    value={searchLowPrice}
                    min="0"
                    onChange={(e) => setSearchLowPrice(Number(e.target.value))}
                />
                <Form.Control
                    type="number"
                    placeholder="Цена до"
                    className="form-control-sm flex-grow-1 shadow shadow-sm"
                    data-bs-theme="primary"
                    value={searchHighPrice}
                    min="0"
                    onChange={(e) => setSearchHighPrice(Number(e.target.value))}
                />
                 <Button
                    variant="primary"
                    size="sm"
                    type="submit"
                    className="shadow">
                    Поиск
                </Button>
            </Form>
        </Navbar>
        </>)
}

const AllCargo = () => {
        const [loaded, setLoaded] = useState<boolean>(false)
        const [cargos, setCargo] = useState<ICargoProps[]>([]);
        const [_, setDraftFlight] = useState<string | null>(null);
    
        useEffect(() => {
            getAllCargo()
                .then(data => {
                    console.log(data)
                    setDraftFlight(data.draft_flight)
                    setCargo(data.cargos)
                    setLoaded(true)
                })
                .catch((error) => {
                    console.error("Error while fetching data: ", error);
                });
        }, []);
    return (
        <>
            <Search  setCargo={setCargo} />
            <div className='row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4 px-1'>
            {loaded ? (
                cargos.map((cargo) => (
                <div className='d-flex py-1 p-2 justify-content-center' key={cargo.uuid}>
                    <SmallRCard {...cargo} />
                </div>
                ))
            ) : (
                <LoadAnimation />
            )} 
            </div>
        </>
    )
}

export { AllCargo }