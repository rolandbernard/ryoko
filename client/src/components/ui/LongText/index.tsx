
import { useState } from 'react';

interface Props {
    text: string;
}

export default function LongText({ text }: Props) {
    const [more, setMore] = useState(false);

    return (
        (text.length < 300)
            ? <p>{text}</p>
            : (more
                ? <>
                    <p>{text}</p>
                    <button onClick={() => setMore(false)}>less</button>
                </>
                : <>
                    <p>{text.substr(0, 300) + '... '}</p>
                    <button onClick={() => setMore(true)}>more</button>
                </>
            )
    );
}

