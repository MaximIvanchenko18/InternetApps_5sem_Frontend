import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import { RootState } from '../store';

function Breadcrumbs() {
    const pages = useSelector((state: RootState) => state.history.pages);

    return (
        <>
            { pages.map((page, index) => (
                <React.Fragment key={index}>
                    {index < pages.length - 1 ? (
                        <>
                            <Link to={page.path} className="nav-link p-0 text-dark" data-bs-theme="dark">
                                {page.name}
                            </Link>
                            <Nav.Item className='mx-1'>{">"}</Nav.Item>
                        </>
                    ) : (
                        <Nav.Item className="nav-link p-0 text-dark">
                            {page.name}
                        </Nav.Item>
                    )}
                </React.Fragment>
            ))}
        </>
    );
}

export default Breadcrumbs;