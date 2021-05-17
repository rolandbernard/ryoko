
import { ChangeEvent, Dispatch, FocusEvent, useCallback, useState } from "react";

import './text-input.scss';

interface Props {
    label: string;
    name: string;
    type?: 'password' | 'textarea' | 'text' | 'date';
    defaultText?: string;
    compareValue?: string;
    onChange: (state: any) => void;
    validation?: ((text: string) => Promise<string | null> | string | null) | ((value1: string, value2: string) => Promise<string | null> | string | null);
}

export default function TextInput({ label, name, type, onChange, validation, compareValue, defaultText }: Props) {
    const [error, setError] = useState('');

    const handleChange = useCallback((e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        if (type === 'date') {
            onChange(new Date(e.target.value));
        } else {
            onChange(e.target.value);
        }
    }, [onChange, type]);

    const handleBlur = useCallback(async (e: FocusEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        let error = await validation?.(e.target.value, compareValue ?? '');
        setError(error ?? '');
    }, [validation, compareValue]);

    return (
        <div className={'input-element' + (type === 'textarea' ? ' textarea' : '')}>
            <div className={'input-field' + (validation ? ' mandatory' : '')}>
                <label htmlFor={name}>{label}</label>
                {
                    type === 'textarea' ?
                        (<textarea onChange={handleChange} name={name} id={name} onBlur={handleBlur} value={defaultText} />)
                        : (<input onChange={handleChange} type={type} name={name} id={name} onBlur={handleBlur} value={defaultText} autoComplete="off" />)
                }
            </div >
            {error && (<div className="error">{error}</div>)}
        </div>
    );
}

