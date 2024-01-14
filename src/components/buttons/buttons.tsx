import { ButtonHTMLAttributes } from 'react'
import './buttons.css'

export const GenerateButton = ({ title, props }: { title: string; props: ButtonHTMLAttributes<HTMLButtonElement> }) => {
    return (
        <>
            <button {...props}>{title}</button>
        </>
    )
}
