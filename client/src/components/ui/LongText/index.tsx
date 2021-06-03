
import { useState } from 'react';

import { compileMarkdown } from './markdown';

import './markdown.scss';

interface Props {
    text: string;
}

export default function LongText({ text }: Props) {
    const [more, setMore] = useState(false);

    return (
        (text.length < 300)
            ? <p dangerouslySetInnerHTML={{ __html: compileMarkdown(text)}}>{}</p>
            : (more
                ? <>
                    <p dangerouslySetInnerHTML={{ __html: compileMarkdown(text)}}>{}</p>
                    <button onClick={() => setMore(false)}>less</button>
                </>
                : <>
                    <p dangerouslySetInnerHTML={{ __html: compileMarkdown(text.substr(0, 300) + '... ')}}>{}</p>
                    <button onClick={() => setMore(true)}>more</button>
                </>
            )
    );
}

