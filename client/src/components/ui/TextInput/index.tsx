import React, { ChangeEvent, Dispatch } from "react";

import './text-input.scss';

interface Props {
    label: string,
    name: string,
    color?: 'dark'
    type?: 'password' | 'textarea' | 'text',
    valueSetter?: Dispatch<string>,
    error?: string
}

export default function TextInput({ label, name, type, color, valueSetter, error }: Props) {

    type = type ?? 'text';

    const setValue = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void => {
        if (valueSetter)
            valueSetter(e.target.value);
    }

    const errorTag = error ? (<div className="error">{error}</div>) : null;

    return (
        <div className={'input-element' + (type === 'textarea' ? ' textarea' : '')}>
            <div className={'input-field ' + (color ?? '')}>
                <label htmlFor={name}>{label}</label>
                {
                    type === 'textarea' ?
                        (<textarea onChange={(e) => setValue(e)} name={name} id={name}></textarea>)
                        : (<input onChange={(e) => setValue(e)} type={type} name={name} id={name} />)
                }
            </div >
            {errorTag}
        </div>
    );
}

