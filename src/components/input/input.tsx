import { Dispatch, SetStateAction } from 'react'
import { IoIosCheckmarkCircle } from 'react-icons/io'

import './input.css'

export const CustomInput = ({
    valueToConvert,
    imageAdded,
    setValueToConvert,
    setImageAdded,
    setImageSrc,
}: {
    valueToConvert: string
    imageAdded: boolean
    setValueToConvert: Dispatch<SetStateAction<string>>
    setImageSrc: Dispatch<SetStateAction<string | undefined>>
    setImageAdded: Dispatch<SetStateAction<boolean>>
}) => {
    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (file && file.type.startsWith('image/')) {
            const src = URL.createObjectURL(file)
            setImageAdded(true)
            setImageSrc(src)
        }
    }
    return (
        <>
            <section className="inputs">
                <input value={valueToConvert} onChange={(e) => setValueToConvert(e.target.value)} />
                <div className="logo">
                    {imageAdded && (
                        <>
                            <div className="icon-container">
                                <IoIosCheckmarkCircle />
                                <div className="iconBg" />
                            </div>
                        </>
                    )}{' '}
                    <label htmlFor="imageInput" className={imageAdded ? 'label-added' : ''}>
                        {imageAdded ? 'Logo er lagt til' : 'Vil du ha med logo?'}
                    </label>
                </div>
                <input id="imageInput" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleLogoUpload} />
            </section>
        </>
    )
}
