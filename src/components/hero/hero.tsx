import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { QRModal } from '../QRModal/qrModal'
import { GenerateButton } from '../buttons/buttons'
import { GeneratedQRCode } from '../generateQRCode/generateQRCode'
import { CustomInput } from '../input/input'
import './hero.css'
import { updateAddedLogo, updateDownloadCount, updateGeneratedCount } from './utils'

export const Hero = () => {
    const queryClient = useQueryClient()
    const [valueToConvert, setValueToConvert] = useState<string>('')
    const [imageSrc, setImageSrc] = useState<string | undefined>(undefined)

    const [imageAdded, setImageAdded] = useState<boolean>(false)

    const [generateQR, setGenerateQR] = useState(false)

    const [onSuccess, setOnSuccess] = useState(false)

    const [showDisabledMessage, setShowDisabledMessage] = useState(false)
    const isDisabled = !valueToConvert || valueToConvert.length === 0 || (imageAdded && !valueToConvert) || (imageAdded && valueToConvert.length === 0)

    const handleGenerateQR = async () => {
        await updateGeneratedCount()
        if (imageAdded) {
            await updateAddedLogo()
        }
        queryClient.invalidateQueries({ queryKey: ['insights'] })
        setGenerateQR(true)
    }
    const handleClose = () => {
        setGenerateQR(false)
    }

    const handleMouseEnter = () => {
        if (isDisabled) {
            setShowDisabledMessage(true)
        }
    }

    const handleMouseLeave = () => {
        if (isDisabled) {
            setShowDisabledMessage(false)
        }
    }

    useEffect(() => {
        const handleSuccess = async () => {
            setImageSrc(undefined)
            setValueToConvert('')
            setGenerateQR(false)
            setOnSuccess(false)
            setImageAdded(false)
            setShowDisabledMessage(false)

            await updateDownloadCount()
            queryClient.invalidateQueries({ queryKey: ['insights'] })
            return
        }
        if (onSuccess) {
            handleSuccess()
        }
    }, [onSuccess])

    return (
        <>
            <div className="hero">
                <CustomInput valueToConvert={valueToConvert} setValueToConvert={setValueToConvert} setImageSrc={setImageSrc} imageAdded={imageAdded} setImageAdded={setImageAdded} />

                <GenerateButton
                    title={onSuccess ? 'restart' : 'Lag QR kode'}
                    props={{ onClick: handleGenerateQR, disabled: isDisabled, onMouseOver: handleMouseEnter, onMouseOut: handleMouseLeave }}
                />
                {showDisabledMessage && <p className="disabled-message">Du må skrive inn en verdi før du kan generere en QR kode</p>}
                <QRModal isOpen={generateQR} onClose={handleClose}>
                    <GeneratedQRCode valueToConvert={valueToConvert} logo={imageSrc} onSuccess={() => setOnSuccess(true)} />
                </QRModal>
            </div>
        </>
    )
}
