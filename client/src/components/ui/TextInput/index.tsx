
import { ChangeEvent, FocusEvent, useCallback, useState } from "react";

import './text-input.scss';

interface Props {
    label: string;
    name: string;
    type?: 'password' | 'textarea' | 'text' | 'date';
    defaultText?: string;
    compareValue?: string;
    onChange: (state: any) => void;
    validation?: (
        ((text: string) => Promise<string | null> | string | null)
        | ((value1: string, value2: string) => Promise<string | null> | string | null)
    );
    note?: string;
}

/**
 * This component implements a input element for inputing text. The component will display the label
 * property, the error and note property. If type is equal to 'textarea' then instead of using an html
 * input element a textarea element will be used.
 */
export default function TextInput({ label, name, type, onChange, validation, compareValue, defaultText, note }: Props) {
    const [error, setError] = useState('');

    const handleChange = useCallback((e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        onChange(e.target.value);
    }, [onChange]);

    const handleBlur = useCallback(async (e: FocusEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        let error = await validation?.(e.target.value, compareValue ?? '');
        setError(error ?? '');
    }, [validation, compareValue]);

    return (
        <div className={'input-element' + (type === 'textarea' ? ' textarea' : '')}>
            <div className={'input-field' + (validation ? ' mandatory' : '')}>
                <label htmlFor={name}>{label}</label>
                {
                    type === 'textarea'
                        ? (<textarea
                                onChange={handleChange}
                                name={name}
                                id={name}
                                onBlur={handleBlur}
                                value={defaultText}
                            />)
                        : (<input
                                onChange={handleChange}
                                type={type} name={name}
                                id={name} onBlur={handleBlur}
                                value={defaultText}
                                autoComplete="off"
                            />)
                }
            </div >
            {error && (<div className="error">{error}</div>)}
            {note && (
                <div className="note">
                    <span className="material-icons">
                        help_outline
                    </span>
                    {note}
                </div>
            )}
        </div>
    );
}

