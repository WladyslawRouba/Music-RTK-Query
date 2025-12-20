
import { Routing } from '@/common/routing/Routing.tsx'
import { Header } from '@/common/components'
import s from './App.module.css'
import {ToastContainer} from 'react-toastify'
import {useGlobalLoading} from '@/common/hooks/useGlobalLoading'
import { LinearProgress } from '@/common/components/LinearProgress/LinearProgress.tsx';

export function App() {
  const isGlobalLoading = useGlobalLoading()

  return (
      <>
        <Header />
        {isGlobalLoading && <LinearProgress/>}
        <div className={s.layout}>
          <Routing />
          </div>
        <ToastContainer />
      </>

      )
}

export default App
