import { Toaster } from 'react-hot-toast'
import { Footer } from 'src/components/footer/footer'
import { Navbar } from '../components/navbar/navbar'
import { LandingPage } from '../pages/home/home'
import './app.css'

function App() {
    return (
        <div className="app">
            <div className="app-wrapper">
                <Navbar />
                <LandingPage />
            </div>
            <Footer />
            <Toaster />
        </div>
    )
}

export default App
