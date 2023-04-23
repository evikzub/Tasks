import { Routing } from '../pages'
import { withProviders } from './providers'
import "./styles/index.scss";

const App = () => {
  //const [count, setCount] = useState(0)
  // className="App"

  return (
    <div className='app'>
      <Routing/>
    </div>
  )
}

export default withProviders(App);