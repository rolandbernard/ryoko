import React from "react";

import './text-input.scss';

interface Props {
    label: string,
    name: string,
    type?: string
}

export default function TextInput({ label, name, type }: Props) {
    type = type ? type : 'text';
    let field = (
        <input type={type} required name={name} id={name} />
    );

    if (type === 'textarea') {
        field = (
            <textarea name={name} id={name} required></textarea>
        )
    }

    return (
        <div className={'input-field' + (type === 'textarea' ? ' textarea' : '')}>
            <label htmlFor={name}>{label}</label>
            {field}
        </div>
    );
}

