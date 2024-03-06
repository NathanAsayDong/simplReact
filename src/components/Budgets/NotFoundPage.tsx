import { Link } from 'react-router-dom';

export default function NotFoundPage() {
    return (
        <h1 className="flex flex-col gap-2">
            404 Not Found
            <Link to="/">Home from Link</Link>
            <a href="/">Home from A</a>
        </h1>
    );
};

