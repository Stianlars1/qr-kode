import JSZip from 'jszip'
import { QRCodeSVG } from 'qrcode.react'
import { CSSProperties, useEffect, useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import { GenerateButton } from '../buttons/buttons'
export const GeneratedQRCode = ({ valueToConvert, logo, onSuccess }: { valueToConvert: string; logo: string | undefined; onSuccess: () => void }) => {
    const qrRef = useRef<HTMLDivElement>(null)
    const [qrCodeProps, setQRCodeProps] = useState<QRProps>({
        value: valueToConvert,
        size: 256,
        level: 'H',
    })

    const downloadQRCode = async () => {
        if (!qrRef.current) return

        const svg = qrRef.current.querySelector('svg')
        if (!svg) return

        const svgData = new XMLSerializer().serializeToString(svg)
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })

        // Create PNG version of the QR code
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx) throw new Error('Failed to get canvas context')

        const img = new Image()
        img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
        img.onload = async () => {
            canvas.width = img.width
            canvas.height = img.height
            ctx.drawImage(img, 0, 0)
            canvas.toBlob(async (pngBlob) => {
                if (!pngBlob) throw new Error('Failed to create PNG blob')

                // Create a new JSZip instance
                const zip = new JSZip()
                // Add both SVG and PNG images to the zip
                zip.file(`${valueToConvert}.svg`, svgBlob)
                zip.file(`${valueToConvert}.png`, pngBlob)

                // Generate the zip file and trigger download
                const zipBlob = await zip.generateAsync({ type: 'blob' })
                const zipUrl = URL.createObjectURL(zipBlob)
                const downloadLink = document.createElement('a')
                downloadLink.href = zipUrl
                downloadLink.download = `${valueToConvert}.zip`
                document.body.appendChild(downloadLink)
                downloadLink.click()
                document.body.removeChild(downloadLink)

                // Revoke the object URL to free up resources
                URL.revokeObjectURL(zipUrl)

                // Call the onSuccess callback
                onSuccess && onSuccess()
            }, 'image/png')
            img.onerror = (e) => {
                toast.error('Noe gikk galt. Prøv å genere på nytt')
                throw new Error('Failed to load image')
            }
        }
    }
    useEffect(() => {
        const updateQRCodeProps = async () => {
            const props = await getQRcodeProps(logo, valueToConvert)
            setQRCodeProps(props)
        }

        updateQRCodeProps()
    }, [logo, valueToConvert])

    return (
        <>
            <div ref={qrRef}>
                <QRCodeSVG {...qrCodeProps} />
            </div>
            <GenerateButton title="Last ned" props={{ onClick: downloadQRCode }} />
        </>
    )
}

interface ImageSettings {
    src: string
    height: number
    width: number
    excavate: boolean
    x?: number
    y?: number
}
interface QRProps {
    value: string
    size?: number
    level?: string
    bgColor?: string
    fgColor?: string
    style?: CSSProperties
    includeMargin?: boolean
    imageSettings?: ImageSettings
}

const getQRcodeProps = async (logo: string | undefined, valueToConvert: string): Promise<QRProps> => {
    if (!logo)
        return {
            value: valueToConvert,
            level: 'H',
            includeMargin: true,
            size: 256,
        }
    const imageSource = await convertImageToBase64(logo)
    return {
        value: valueToConvert,
        size: 256,
        level: 'Q',
        includeMargin: true,
        imageSettings: {
            src: imageSource as string,
            x: undefined,
            y: undefined,
            height: 50,
            width: 50,
            excavate: true,
        },
    }
}

const convertImageToBase64 = async (url: string): Promise<string> => {
    const response = await fetch(url)
    const blob = await response.blob()
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(blob)
    })
}
