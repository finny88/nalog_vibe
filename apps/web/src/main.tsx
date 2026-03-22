import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from '@app/App'
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import './app/global.css'

const queryClient = new QueryClient()
const rootElement = document.getElementById('root')

if (rootElement === null) {
	throw new Error('Root element was not found')
}

createRoot(rootElement).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<MantineProvider defaultColorScheme={'light'}>
				<Notifications />
				<BrowserRouter>
					<App />
				</BrowserRouter>
			</MantineProvider>
		</QueryClientProvider>
	</StrictMode>
)