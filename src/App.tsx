import { useEffect, useState } from 'react'
import { type User } from './types.d'
import { UsersList } from './components/UsersList'
import './App.css'

function App () {
  const [users, setUsers] = useState<User[]>([])
  const [color, setColor] = useState<boolean>(false)
  const [sortByCountry, setSortByCountry] = useState<boolean>(false)

  const toggleSortByCountry = () => {
    setSortByCountry(prevState => !prevState)
  }

  useEffect(() => {
    fetch('https://randomuser.me/api?results=100')
      .then(async res => await res.json())
      .then(res => {
        setUsers(res.results)
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  const sortedUsers = sortByCountry
    ? [...users].sort((a, b) => {
        return a.location.country.localeCompare(b.location.country)
      })
    : users

  return (
    <>
      <header>
        <button onClick={() => { setColor(!color) }}>Color files</button>
        <button onClick={toggleSortByCountry}>{sortByCountry ? 'Unsort by Country' : 'Sort by Country'}</button>
      </header>
      <main>
        <UsersList users={sortedUsers} color={color} />
      </main>
    </>
  )
}

export default App
