import { saveAs } from 'file-saver'
import JSZip from 'jszip'
import { QRCodeSVG } from 'qrcode.react'
import { CSSProperties, useEffect, useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import { ClipLoader } from 'react-spinners'
import './generateQRCode.css'
export const GeneratedQRCode = ({ valueToConvert, logo, saveAsZip, onSuccess }: { valueToConvert: string; logo: string | undefined; onSuccess: () => void; saveAsZip: boolean }) => {
    const qrRef = useRef<HTMLDivElement>(null)
    const [downloadContent, setDownloadContent] = useState<Blob | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isDownloading, setIsDownloading] = useState(false)
    const [png, setPNG] = useState<Blob | null>(null)
    const [svg, setSVG] = useState<Blob | null>(null)

    const [qrCodeProps, setQRCodeProps] = useState<QRProps>({
        value: valueToConvert,
        size: 256,
        level: 'H',
        includeMargin: true,
    })

    useEffect(() => {
        const updateQRCodeProps = async () => {
            const props = await getQRcodeProps(logo, valueToConvert)
            setQRCodeProps(props)
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

                    if (saveAsZip) {
                        // Create a new JSZip instance
                        const zip = new JSZip()
                        // Add both SVG and PNG images to the zip
                        zip.file('qr-kode.svg', svgBlob)
                        zip.file('qr-kode.png', pngBlob)

                        // Generate the zip file
                        await zip.generateAsync({ type: 'blob', mimeType: 'application/zip' }).then((content: Blob) => {
                            setDownloadContent(content)
                        })
                    } else {
                        setPNG(pngBlob)
                        setSVG(svgBlob)
                        setDownloadContent(pngBlob)
                    }
                    setIsLoading(false)

                    // Call the onSuccess callback
                }, 'image/png')
                img.onerror = (e) => {
                    toast.error('Noe gikk galt. Prøv å genere på nytt')
                    throw new Error('Failed to load image')
                }
            }
        }

        updateQRCodeProps()
    }, [logo, valueToConvert, qrRef.current])

    const handleDownload = async () => {
        setIsDownloading(true)
        if (saveAsZip) {
            downloadContent && saveAs(downloadContent, 'qr-kode.zip')
        } else {
            png && saveAs(png, 'qr-kode.png')
            svg && saveAs(svg, 'qr-kode.svg')
        }

        toast.loading('Sjekk om du trenger å tillate nedlastingen i nettleseren din', { duration: 5000 })
    }

    return (
        <>
            {!isDownloading && (
                <>
                    {isLoading && <ClipLoader color="#bf29e7" />}
                    <div style={{ opacity: isLoading ? '0' : '1', transition: 'opacity 0.3s ease' }} ref={qrRef}>
                        {<QRCodeSVG {...qrCodeProps} />}
                    </div>
                    <button className="button" onClick={handleDownload} disabled={!downloadContent && !logo}>
                        Last ned
                    </button>
                    <p className="info">Det blir generert 2 bilder i formatene (.png & .svg)</p>
                </>
            )}

            {isDownloading && (
                <>
                    <p className="warning">
                        <mark>
                            <span style={{ color: 'black', margin: '0 8px' }}>Viktig</span>
                        </mark>
                        : Når du laster ned QR-koden, kan nettleseren din be om bekreftelse for å forsikre at nedlastingen er trygg.
                    </p>

                    <p className="warning">Vennligst tillat nedlastingen for å motta dine QR-bilder i (.png & .svg) formatene. Alle filer fra oss er sikre og trygge.</p>
                </>
            )}
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
