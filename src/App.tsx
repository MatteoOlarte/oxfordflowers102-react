import { HomePageProvider } from './context/HomePageContext'
import HomePage from './pages/HomePage'

function App() {
  return (
    <HomePageProvider>
      <HomePage>
      </HomePage>
    </HomePageProvider>

  )
}

export default App
