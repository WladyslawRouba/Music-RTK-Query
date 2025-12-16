
import { Routing } from '@/common/routing/Routing.tsx'
import { Header } from '@/common/components'
import s from './App.module.css'
import {ToastContainer} from 'react-toastify'

export function App() {


  return (
      <>
        <Header />
        <div className={s.layout}>
          <Routing />
          </div>
        <ToastContainer />
      </>

      )
}

export default App
