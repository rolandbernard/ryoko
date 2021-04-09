
import { DEMO_CONSTANT } from 'adapters/constants';
import Button from 'components/ui/Button';
import './home.scss';

export default function Home() {
    return (
        <div>
            Home {DEMO_CONSTANT}
            <Button>Hello world</Button>
        </div>
    );
}

