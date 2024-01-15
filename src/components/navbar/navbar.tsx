import './navbar.css'
import logo from './qr-kode-100.png'

export const Navbar = () => {
    return (
        <>
            <nav>
                <figure>
                    <img width={50} height={50} src={logo} alt="qr-kode-logo" />
                </figure>
            </nav>
        </>
    )
}
