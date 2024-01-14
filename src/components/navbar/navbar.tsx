import './navbar.css'
import logo from './qr-kode-60.png'

export const Navbar = () => {
    return (
        <>
            <nav>
                <figure>
                    <img src={logo} alt="qr-kode-logo" />
                </figure>
            </nav>
        </>
    )
}
