import React from "react";

import './text-input.scss';

interface Props {
    label: string,
    name: string,
    type?: string
}

export default function TextInput({ label, name, type }: Props) {
    type = type ? type : 'text';

    return (
        <div className={'input-field' + (type === 'textarea' ? ' textarea' : '')}>
            <label htmlFor={name}>{label}</label>
            {
                type === 'textarea' ?
                    (<textarea name={name} id={name} required></textarea>)
                    : (<input type={type} required name={name} id={name} />)
            }
        </div>
    );
}

