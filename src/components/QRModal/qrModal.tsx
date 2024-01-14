import React from 'react'
import { createPortal } from 'react-dom'
import './qrModal.css'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    children: React.ReactNode
    className?: string
}

export const QRModal = ({ isOpen, onClose, children }: ModalProps) => {
    if (!isOpen) return null

    return createPortal(
        <div className={'modal-overlay '} onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>,
        document.body
    )
}
