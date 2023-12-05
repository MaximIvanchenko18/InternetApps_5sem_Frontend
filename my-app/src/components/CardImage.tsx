import Card from 'react-bootstrap/Card';
import { useState, useEffect } from 'react';

interface CardImageProps {
    url: string;
    className?: string;
}

const CardImage = ({ url, className, ...props }: CardImageProps) => {
    const [src, setSrc] = useState(`${import.meta.env.BASE_URL}placeholder.jpeg`);

    useEffect(() => {
        fetch(url)
            .then(response => {
                console.info(url)
                if (response.status >= 500 || response.headers.get("Server") == "GitHub.com") {
                    throw new Error(`Can't load image from ${url}`);
                }
                return response.blob();
            })
            .then(blob => setSrc(URL.createObjectURL(blob)))
            .catch(error => {
                console.error(error.message);
            });
    }, []);

    const handleError = () => {
        console.error(`Error while loading image: ${url}`);
    };

    return <Card.Img src={src} className={className} onError={handleError} {...props} />;
};

export default CardImage;