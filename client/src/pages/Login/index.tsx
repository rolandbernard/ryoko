import Page from 'components/ui/Page';
import { Link } from 'react-router-dom';
import './login.scss';

export default function Login() {
    return (
        <Page header={false}>
            <div className="content-container">
                <h1>Login</h1>
                <Link to="/register">You don't have an account?</Link>
            </div>
        </Page>
    );
}

