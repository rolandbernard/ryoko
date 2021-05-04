import { useState, useEffect } from 'react';
import './background.scss';

function getWindowHeight(): number {    
    return document.body.offsetHeight;
}

export default function DynamicBackground() {
    const [height, setHeight] = useState(0);
    useEffect(() => {
        setHeight(getWindowHeight());
    }, [])

    let bubbles = [];
    let secondary = true;

    for (let i = 0; i <= height; i += 700) {
        let lr = secondary ? { right: '-5%' } : { left: '-5%' };
        bubbles.push(
            <div
                className={'bubble ' + (secondary ? 'secondary' : 'primary')}
                key={i}
                style={{ ...lr, top: (i - 200) + 'px' }}>
            </div>
        )
        secondary = !secondary;
    }

    return (
        <div className="background-container">
            {bubbles}
        </div>
    )
}