
import { ChangeEvent, Dispatch, FocusEvent, useCallback, useState } from "react";

import './text-input.scss';

interface Props {
    label: string,
    name: string,
    color?: 'dark'
    type?: 'password' | 'textarea' | 'text',
    onChange: Dispatch<string>,
    validation: (text: string) => Promise<string | null> | string | null;
}

export default function TextInput({ label, name, type, color, onChange, validation }: Props) {
    const [error, setError] = useState('');

    const handleChange = useCallback((e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        onChange(e.target.value);
    }, [ onChange ]);

    const handleBlur = useCallback(async (e: FocusEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        let error = await validation?.(e.target.value);
        setError(error ?? '');
    }, [ validation ]);

    return (
        <div className={'input-element' + (type === 'textarea' ? ' textarea' : '')}>
            <div className={'input-field ' + (color ?? '')}>
                <label htmlFor={name}>{label}</label>
                {
                    type === 'textarea' ?
                        (<textarea onChange={handleChange} name={name} id={name} onBlur={handleBlur} />)
                        : (<input onChange={handleChange} type={type} name={name} id={name} onBlur={handleBlur} autoComplete="off"/>)
                }
            </div >
            <div className="error">{error}</div>
        </div>
    );
}

