import { NavLink } from 'react-router-dom'
import { Path } from '@/common/routing'
import s from './Header.module.css'
import { useGetMeQuery } from '@/features/auth/api/authApi.ts';
import { Login } from '@/features/auth/ui/Login/Login.tsx';
import { useLogoutMutation } from '@/features/auth/api/authApi.ts';



export const Header = () => {
  const navItems = [
    { to: Path.Main, label: 'Main' },
    { to: Path.Playlists, label: 'Playlists' },
    { to: Path.Tracks, label: 'Tracks' },
    { to: Path.Profile, label: 'Profile' },
  ]
  const{data} = useGetMeQuery();
  const [logout] = useLogoutMutation()

  const logoutHandler = () => logout()

  return (
    <header className={s.container}>
      <nav>
        <ul className={s.list}>
          {navItems.map(item => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) => `link ${isActive ? s.activeLink : ''}`}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      {data && (
        <div className={s.loginContainer}>
          <p>{data.login}</p>
          <button onClick={logoutHandler}>logout</button>
        </div>
      )}
      {!data && <Login/>}
    </header>
  )
}