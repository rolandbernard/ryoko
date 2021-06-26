
import { useState } from 'react';

import { compileMarkdown } from './markdown';

import './markdown.scss';

interface Props {
    text: string;
    open?: boolean;
}

/**
 * This component displays the given text property as a markdown string. The markdown will be
 * compiled by the component and then displayed. If the text is long the text will be shown
 * collapsed and allow the user to expand it and collapse it again.
 */
export default function LongText({ text, open }: Props) {
    const [more, setMore] = useState(false);

    return (
        (open || text.length < 300)
            ? <p dangerouslySetInnerHTML={{ __html: compileMarkdown(text)}} />
            : (more
                ? <>
                    <p dangerouslySetInnerHTML={{ __html: compileMarkdown(text)}} />
                    <button onClick={() => setMore(false)}>less</button>
                </>
                : <>
                    <p dangerouslySetInnerHTML={{ __html: compileMarkdown(text.substr(0, 300) + '... ')}} />
                    <button onClick={() => setMore(true)}>more</button>
                </>
            )
    );
}

