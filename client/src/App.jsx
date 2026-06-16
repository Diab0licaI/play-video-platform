import { AppProviders } from './context/index.jsx'
import AppRoutes from './routes/AppRoutes.jsx'

function App() {
  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  )
}

export default App