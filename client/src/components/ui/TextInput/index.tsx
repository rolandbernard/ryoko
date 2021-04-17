import React, { ChangeEvent, Dispatch, FocusEvent, useState } from "react";

import './text-input.scss';

interface Props {
    label: string,
    name: string,
    color?: 'dark'
    type?: 'password' | 'textarea' | 'text',
    onChange: Dispatch<string>,
    validateFn: (arg0: string) => string | null;
}

export default function TextInput({ label, name, type, color, onChange, validateFn }: Props) {
    const [error, setError] = useState('');

    type = type ?? 'text';

    const setValue = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void => {
        onChange(e.target.value);
    }

    const validateField = (e: FocusEvent<HTMLTextAreaElement | HTMLInputElement>): void => {
        if (validateFn) {
            let error = validateFn(e.target.value);
            
            if (error)
                setError(error);
            else
                setError('');
        }
    }

    const errorTag = error ? (<div className="error">{error}</div>) : null;

    return (
        <div className={'input-element' + (type === 'textarea' ? ' textarea' : '')}>
            <div className={'input-field ' + (color ?? '')}>
                <label htmlFor={name}>{label}</label>
                {
                    type === 'textarea' ?
                        (<textarea onChange={setValue} name={name} id={name} onBlur={validateField}></textarea>)
                        : (<input onChange={setValue} type={type} name={name} id={name} onBlur={validateField} />)
                }
            </div >
            {errorTag}
        </div>
    );
}

