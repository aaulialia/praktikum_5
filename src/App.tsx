import { RequireAuth } from './components/RequireAuth'
import { ProtectedPage } from './pages/ProtectedPage'
import './App.css'

function App() {
  return (
    <RequireAuth>
      {(user) => <ProtectedPage user={user} />}
    </RequireAuth>
  )
}

export default App
