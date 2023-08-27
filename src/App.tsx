import { useEffect, useRef, useState, useMemo } from 'react'
import { type User } from './types.d'
import { UsersList } from './components/UsersList'
import './App.css'

function App () {
  const [users, setUsers] = useState<User[]>([])
  const [color, setColor] = useState<boolean>(false)
  const [sortByCountry, setSortByCountry] = useState<boolean>(false)
  const [search, setSearch] = useState<string | null>(null)
  const originalUsers = useRef<User[]>([])

  const toggleSortByCountry = () => {
    setSortByCountry(prevState => !prevState)
  }

  const handleDelete = (email: string) => {
    const filteredUsers = users.filter(user => user.email !== email)
    setUsers(filteredUsers)
  }

  const handleRestartState = () => {
    setUsers(originalUsers.current)
  }

  useEffect(() => {
    fetch('https://randomuser.me/api?results=100')
      .then(async res => await res.json())
      .then(res => {
        setUsers(res.results)
        originalUsers.current = res.results
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  const filteredUsers = useMemo(() => {
    console.log('FILTERING USERS BY COUNTRY')

    return search !== null && search.length > 0
      ? [...users].filter(user => user.location.country.toLowerCase().includes(search.toLowerCase()))
      : users
  }, [users, search])

  const sortedUsers = useMemo(() => {
    console.log('SORTING USERS')

    return sortByCountry
      ? filteredUsers.sort((a, b) => a.location.country.localeCompare(b.location.country))
      : filteredUsers
  }, [filteredUsers, sortByCountry])

  return (
    <>
      <header>
        <button onClick={() => { setColor(!color) }}>Color files</button>
        <button onClick={toggleSortByCountry}>{sortByCountry ? 'Unsort by Country' : 'Sort by Country'}</button>
        <button onClick={handleRestartState}>Restart state</button>
        <input placeholder='Type a country' onChange={e => { setSearch(e.target.value) }} />
      </header>
      <main>
        <UsersList users={sortedUsers} color={color} deleteUser={handleDelete} />
      </main>
    </>
  )
}

export default App
