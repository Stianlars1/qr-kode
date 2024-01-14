import { Insights } from 'src/components/insights/Insights'
import { Header } from '../../components/header/header'
import { Hero } from '../../components/hero/hero'
import './home.css'
export const LandingPage = () => {
    return (
        <>
            <main>
                <Header />
                <Hero />
                <Insights />
            </main>
        </>
    )
}
