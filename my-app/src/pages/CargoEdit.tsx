import { FC, useEffect, useState, ChangeEvent, useRef } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { Card, Row, Navbar, InputGroup, Form, Col, Button, ButtonGroup } from 'react-bootstrap';
import { axiosAPI, getCargo } from '../api'
import { ICargo } from '../models';
import { AppDispatch } from "../store";
import { addToHistory } from "../store/historySlice"
import LoadAnimation from '../components/LoadAnimation';
import CardImage from '../components/CardImage';
import Breadcrumbs from '../components/Breadcrumbs';

const CargoEdit: FC = () => {
    let { cargo_id } = useParams()
    const [cargo, setCargo] = useState<ICargo | undefined>(undefined)
    const [loaded, setLoaded] = useState<Boolean>(false)
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation().pathname;
    const [edit, setEdit] = useState<boolean>(false)
    const [image, setImage] = useState<File | undefined>(undefined);
    const inputFile = useRef<HTMLInputElement | null>(null);
    const navigate = useNavigate()

    useEffect(() => {
        const getData = async () => {
            setLoaded(false);
            let data: ICargo | undefined;
            let name: string;
            try {
                if (cargo_id == 'new') {
                    data = {
                        uuid: "",
                        name: "",
                        en_name: "",
                        category: "",
                        price: NaN,
                        weight: NaN,
                        capacity: NaN,
                        description: "",
                        photo: "",
                    }
                    name = 'Новый груз'
                    setEdit(true)
                } else {
                    data = await getCargo(cargo_id);
                    name = data ? data.name : ''
                }
                setCargo(data);
                dispatch(addToHistory({ path: location, name: name }));
            } finally {
                setLoaded(true);
            }
        }

        getData();

    }, [dispatch]);

    const changeString = (e: ChangeEvent<HTMLInputElement>) => {
        setCargo(cargo ? { ...cargo, [e.target.id]: e.target.value } : undefined)
    }

    const changeNumber = (e: ChangeEvent<HTMLInputElement>) => {
        setCargo(cargo ? { ...cargo, [e.target.id]: parseInt(e.target.value) } : undefined)
    }

    const deleteCargo = () => {
        let accessToken = localStorage.getItem('access_token');
        axiosAPI.delete(`/cargo/${cargo_id}`, { headers: { 'Authorization': `Bearer ${accessToken}`, } })
            .then(() => navigate('/cargos-edit'))
    }

    const save = () => {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            return
        }
        setEdit(false);

        const formData = new FormData();
        if (cargo) {
            Object.keys(cargo).forEach(key => {
                if ((cargo as any)[key]) {
                    formData.append(key, (cargo as any)[key])
                }
            });
        }
        if (image) {
            formData.append('image', image);
        }

        if (cargo_id == 'new') {
            axiosAPI.post(`/cargo`, formData, { headers: { 'Authorization': `Bearer ${accessToken}`, } })
                .then((response) => getCargo(response.data).then((data) => setCargo(data)))
        } else {
            axiosAPI.put(`/cargo/${cargo?.uuid}`, formData, { headers: { 'Authorization': `Bearer ${accessToken}`, } })
                .then(() => getCargo(cargo_id).then((data) => setCargo(data)))
        }
    }

    const cancel = () => {
        setEdit(false)
        setImage(undefined)
        if (inputFile.current) {
            inputFile.current.value = ''
        }
        getCargo(cargo_id)
            .then((data) => setCargo(data))
    }

    return (
        <LoadAnimation loaded={loaded}>
            {cargo ? (
                <>
                    <Navbar>
                        <Breadcrumbs />
                    </Navbar>
                    <Card className='shadow-lg mb-3'>
                        <Row className='m-0'>
                            <Col className='col-12 col-md-8 overflow-hidden p-0'>
                                <CardImage url={cargo.photo} />
                            </Col>
                            <Col className='d-flex flex-column col-12 col-md-4 p-0'>
                                <Form noValidate validated={edit} onSubmit={save}>
                                    <Card.Body className='flex-grow-1'>
                                        <InputGroup hasValidation className='mb-1'>
                                            <InputGroup.Text className='c-input-group-text'>Название</InputGroup.Text>
                                            <Form.Control id='name' required type='text' value={cargo.name} readOnly={!edit} onChange={changeString} />
                                        </InputGroup>
                                        <InputGroup hasValidation className='mb-1'>
                                            <InputGroup.Text className='c-input-group-text'>Английское название</InputGroup.Text>
                                            <Form.Control id='en_name' required type='text' value={cargo.en_name} readOnly={!edit} onChange={changeString} />
                                        </InputGroup>
                                        <InputGroup hasValidation className='mb-1'>
                                            <InputGroup.Text className='c-input-group-text'>Категория</InputGroup.Text>
                                            <Form.Control id='category' required type='text' value={cargo.category} readOnly={!edit} onChange={changeString} />
                                        </InputGroup>
                                        <InputGroup className='mb-1'>
                                            <InputGroup.Text className='c-input-group-text'>Цена</InputGroup.Text>
                                            <Form.Control id='price' required type='number' value={isNaN(cargo.price) ? '' : cargo.price} readOnly={!edit} onChange={changeNumber} />
                                        </InputGroup>
                                        <InputGroup className='mb-1'>
                                            <InputGroup.Text className='c-input-group-text'>Масса</InputGroup.Text>
                                            <Form.Control id='weight' required type='number' value={isNaN(cargo.weight) ? '' : cargo.weight} readOnly={!edit} onChange={changeNumber} />
                                        </InputGroup>
                                        <InputGroup className='mb-3'>
                                            <InputGroup.Text className='c-input-group-text'>Объем</InputGroup.Text>
                                            <Form.Control id='capacity' required type='number' value={isNaN(cargo.capacity) ? '' : cargo.capacity} readOnly={!edit} onChange={changeNumber} />
                                        </InputGroup>
                                        <InputGroup className='mb-1'>
                                            <InputGroup.Text className='c-input-group-text'>Описание</InputGroup.Text>
                                            <Form.Control id='description' required value={cargo.description} readOnly={!edit} onChange={changeString} />
                                        </InputGroup>
                                        <Form.Group className="mb-1">
                                            <Form.Label>Выберите изображение</Form.Label>
                                            <Form.Control
                                                disabled={!edit}
                                                type="file"
                                                accept='image/*'
                                                ref={inputFile}
                                                onChange={(e: ChangeEvent<HTMLInputElement>) => setImage(e.target.files?.[0])} />
                                        </Form.Group>
                                    </Card.Body>
                                    {edit ? (
                                        <ButtonGroup className='w-100'>
                                            <Button variant='success' onClick={save}>Сохранить</Button>
                                            {cargo_id != 'new' && <Button variant='danger' onClick={cancel}>Отменить</Button>}
                                        </ButtonGroup>
                                    ) : (
                                        <ButtonGroup className='w-100'>
                                            <Button
                                                variant='light'
                                                onClick={() => setEdit(true)}>
                                                Изменить
                                            </Button>
                                            <Button variant='danger' onClick={deleteCargo}>Удалить</Button>
                                        </ButtonGroup>
                                    )}
                                </Form>
                            </Col>
                        </Row>
                    </Card>
                </ >
            ) : (
                <h3 className='text-center'>Такого груза нет</h3>
            )}
        </LoadAnimation>
    )
}

export default CargoEdit