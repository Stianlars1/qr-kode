import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
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
    const [inputResetKey, setInputResetKey] = useState(0) // New state for input reset key

    const [imageAdded, setImageAdded] = useState<boolean>(false)

    const [generateQR, setGenerateQR] = useState(false)

    const [onSuccess, setOnSuccess] = useState(false)

    const [showDisabledMessage, setShowDisabledMessage] = useState(false)

    const [saveAsZip, setSaveAsZip] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const isDisabled = !valueToConvert || valueToConvert.length === 0 || (imageAdded && !valueToConvert) || (imageAdded && valueToConvert.length === 0)

    const handleGenerateQR = async () => {
        setIsLoading(true)
        await updateGeneratedCount()
        if (imageAdded) {
            await updateAddedLogo()
        }
        queryClient.invalidateQueries({ queryKey: ['insights'] })
        setIsLoading(false)
        setGenerateQR(true)
    }
    const handleClose = () => {
        setOnSuccess(true)
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
            setInputResetKey((prevKey) => prevKey + 1) // Increment the reset key
            toast.remove()
            return toast.success('QR kode lastet ned', {})
        }
        if (onSuccess) {
            handleSuccess()
        }
    }, [onSuccess])

    return (
        <>
            <div className="hero">
                <CustomInput
                    valueToConvert={valueToConvert}
                    setValueToConvert={setValueToConvert}
                    setImageSrc={setImageSrc}
                    imageAdded={imageAdded}
                    setImageAdded={setImageAdded}
                    saveAsZip={saveAsZip}
                    setSaveAsZip={setSaveAsZip}
                    resetKey={inputResetKey}
                />

                <GenerateButton
                    title={onSuccess ? 'restart' : 'Lag QR kode'}
                    isLoading={isLoading}
                    props={{ onClick: handleGenerateQR, disabled: isDisabled, onMouseOver: handleMouseEnter, onMouseOut: handleMouseLeave }}
                />
                {showDisabledMessage && <p className="disabled-message">Du må skrive inn en verdi før du kan generere en QR kode</p>}
                <QRModal isOpen={generateQR} onClose={handleClose}>
                    <GeneratedQRCode saveAsZip={saveAsZip} valueToConvert={valueToConvert} logo={imageSrc} onSuccess={() => setOnSuccess(true)} />
                </QRModal>
            </div>
        </>
    )
}
