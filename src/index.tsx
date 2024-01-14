import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRoot } from 'react-dom/client'
import App from './app/app'

const root = createRoot(document.getElementById('root') as HTMLElement)
const queryClient = new QueryClient()
root.render(
    <QueryClientProvider client={queryClient}>
        <App />
    </QueryClientProvider>
)
