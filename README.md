# React + TypeScript + Vite

Study practice based on [this video](https://www.youtube.com/watch?v=mNJOWXc83Y4&ab_channel=midulive).

## 🩵 Tasks:

[x] 1. Fetch 100 rows of data using the API.
[x] 2. Display the data in a table format, similar to the example.
[x] 3. Provide the option to color rows as shown in the example.
[x] 4. Allow the data to be sorted by country as demonstrated in the example.
[x] 5. Enable the ability to delete a row as shown in the example.
[x] 6. Implement a feature that allows the user to restore the initial state, meaning that all deleted rows will be recovered.
[x] 7. Handle any potential errors that may occur.
[x] 8. Implement a feature that allows the user to filter the data by country.
[x] 9. Avoid sorting users again the data when the user is changing filter by country.
[] 10. Sort by clicking on the column header.

## 📚 Documentation:

* [React Dev](https://react.dev/reference/react)

## 📝 Notes:

* Start project: `npm create vite@latest`
* Configure ESlint: `npx eslint --init`

  ```
  Ok to proceed? (y) y
  ✔ How would you like to use ESLint? · style
  ✔ What type of modules does your project use? · esm
  ✔ Which framework does your project use? · react
  ✔ Does your project use TypeScript? · No / Yes
  ✔ Where does your code run? · browser
  ✔ How would you like to define a style for your project? · guide
  ✔ Which style guide do you want to follow? · standard-with-typescript
  ✔ What format do you want your config file to be in? · JavaScript
  ```

* SWC: Babel alternative to compile JS code. Faster than Babel.

* To typing: Use tools like [quicktype](https://quicktype.io/). Activate "Interfaces only" option.

___
### 1. ✨ Fetch 100 rows of data using the API
___

* State to save users:

```
const [users, setUsers] = useState([])
```

* Fetch:

```
useEffect(() => {
  fetch('https://randomuser.me/api?results=100')
  .then(async res => await res.json())
  .then(res => {
    setUsers(res.results)
    console.log('RES: ', typeof res.results)
  })
  .catch(err => {
    console.log(err)
  })
}, [])
```

* Return object as JSON.stringify:

```
return (
  <div>
    {
      JSON.stringify(users)
    }
  </div>
)
```

* Type API results with [quicktype](https://quicktype.io/). Create `type.d.ts` file to add the interfaces. So, `const [users, setUsers] = useState<User[]>([])` would be `const [users, setUsers] = useState([])` and User type would be `export interface User` in **types.d.ts**.

___
### 2. ✨ Display the data in a table format, similar to the example.
___

To create a table:

```
Important elements: table, thead, tbody
thead -> tr, th (th inside of tr)
tbody -> tr, td (tr inside of td)
```

Example of result:

```
<table>
  <thead>
    <tr>
      <th>Photo</th>
      <th>Name</th>
      <th>Last name</th>
      <th>Country</th>
      <th>Actions</th>
    </tr>
  </thead>

  <tbody>
    {
      users.map(user => (
        <tr key={user.id.value}>
          <td>
            <img src={user.picture.thumbnail} alt={user.name.first} />
          </td>
          <td>{user.name.first}</td>
          <td>{user.name.last}</td>
          <td>{user.location.country}</td>
          <td>
            <button>Delete</button>
          </td>
        </tr>
      ))
    }
  </tbody>
</table>
```

Import prop types in the new UsersList.tsx component:

```
import { type User } from '../types.d'

interface Props {
  users: User[]
}

export function UsersList ({ users }: Props) {
```

* To delete elements, don't use `index`.

___
### 3. ✨ Provide the option to color rows as shown in the example.
___

CSS alternative:

1. Create a color state: `const [color, setColor] = useState<boolean>(false)`
2. Create a function to change color: ` <button onClick={() => { setColor(!color) }}>Color files</button>`
3. Set color prop and use it: `<tbody className={ color ? 'row-color' : '' }>`
4. Add CSS classes: `.row-color tr:nth-child(even) {` and `.row-color tr:nth-child(odd) {`

JS alternative:

1. Create a color state: `const [color, setColor] = useState<boolean>(false)`
2. Create a function to change color: ` <button onClick={() => { setColor(!color) }}>Color files</button>`
3. Set color prop in style attribute: `<tr key={index} style={{ backgroundColor: color }}>`
4. Create logic if user row is even or odd.
  ```
  const backgroundColor = index % 2 === 0 ? '#F8F6F4' : '#E3F4F4'
  const applyColor = color ? backgroundColor : ''
  ```

___
### 4. ✨ Allow the data to be sorted by country as demonstrated in the example.
___

To compare strings, use: `sort()` with `localeCompare()` (The last one reviews the lenguage).
> 🚨 BUT `sort()` mutates the original state.

With `sort()` and `localeCompare()` mutating state:

```
const sortedUsers = sortByCountry
  ? users.sort((a, b) => {
    return a.location.country.localeCompare(b.location.country)
  })
  : users
```
> 👆🏼 This is wrong becouse if I need to revert to the original state, I can't.

With `sort()` and `localeCompare()` WITHOUT mutating state:

```
const sortedUsers = sortByCountry
  ? [...users].sort((a, b) => {
    return a.location.country.localeCompare(b.location.country)
  })
  : users
```
> 👆🏼 If I don't want to mutate the state, I can create a copy of the original state to sort it like: `[...users]`

Other better option would be with `toSorted()` but it return a new array and it is not suported by TS:

```
const sortedUsers = sortByCountry
  ? users.toSorted((a, b) => {
    return a.location.country.localeCompare(b.location.country)
  })
  : users
```

> 👆🏼 Using this solution, we neet to add the next code into types file:

```
declare global { 
  interface Array<T>{
    toSorted(compareFn?: (a: T, b: T) => number): T[]
  }
}
```

Final result:

```
const [sortByCountry, setSortByCountry] = useState<boolean>(false)

const toggleSortByCountry = () => {
  setSortByCountry(prevState => !prevState)
}

👆🏼 It also could be:
const toggleSortByCountry = () => { setSortByCountry(!sortByCountry) }

const sortedUsers = sortByCountry
  ? [...users].sort((a, b) => {
      return a.location.country.localeCompare(b.location.country)
    })
  : users

// Change users={users} by users={sortedUsers}
<UsersList users={sortedUsers} color={color} />
```

___
### 5. ✨ Enable the ability to delete a row as shown in the example.
___

Don't delete users by index like:

```
const handleDelete = (index: number) => {
  const filteredUsers = users.filter((user, userIndex) => userIndex !== index)
  setUsers(filteredUsers)
}
```

Instead of that, use user.email (that is unic) to delete users without problems like:

```
const handleDelete = (email: string) => {
  const filteredUsers = users.filter(user => user.email !== email)
  setUsers(filteredUsers)
}
```

Remember add deleteUser prop as interface:

```
interface Props {
  users: User[]
  color: boolean
  deleteUser: (email: string) => void
}
```

___
### 6. ✨ Implement a feature that allows the user to restore the initial state, meaning that all deleted rows will be recovered.
___

Don't use a state to save the original users because it'll render the UI again.

Instead of using a new state, use `userRef()` because it allows to share data between renders (that means, if the state changes, the useRef value doesn't) but it doesn't render the UI again.

Other considaration is that if we request to the API again, maybe, we could have other different data than the initial. Also, the task says "restore" not "request" again.

```
const originalUsers = useRef<User[]>([])

const handleRestartState = () => {
  setUsers(originalUsers.current)
}

useEffect(() => {
  fetch('https://randomuser.me/api?results=100')
    .then(async res => await res.json())
    .then(res => {
      setUsers(res.results)
      originalUsers.current = res.results <-------------- HERE
    })
    .catch(err => {
      console.log(err)
    })
}, [])

```

___
### 7. ✨ Handle any potential errors that may occur.
___

* Changing index by user.email.

___
### 8. ✨ Implement a feature that allows the user to filter the data by country.
___

Don't create a new state to save the filtered users. Instead of that, replace the `users` value in sortedUsers function by `filteredUsers` where `filteredUsers` whould be a function with the users filtered by user typing.

```
const [search, setSearch] = useState<string | null>(null)

const filteredUsers = search !== null && search.length > 0
  ? [...users].filter(user => user.location.country.toLowerCase().includes(search.toLowerCase()))
  : users

const sortedUsers = sortByCountry
  ? filteredUsers.sort((a, b) => a.location.country.localeCompare(b.location.country))
  : filteredUsers

<input placeholder='Type a country' onChange={e => { setSearch(e.target.value) }} />
```

___
### 9. ✨ Avoid sorting users again the data when the user is changing filter by country.
___

This means, don't sort users if is not necessary.

To see the behavior of sortedUsers, do the following:

BEFORE:
```
const sortedUsers = sortByCountry
  ? filteredUsers.sort((a, b) => a.location.country.localeCompare(b.location.country))
  : filteredUsers

<UsersList users={sortedUsers} color={color} deleteUser={handleDelete} /> 👈🏼 It does not change.
```

AFTER:
```
const sortUsers = (users: User[]) => {
  console.log('SORTING USERS')
  return sortByCountry
    ? users.sort((a, b) => a.location.country.localeCompare(b.location.country))
    : users
}

const sortedUsers = sortUsers(filteredUsers)

<UsersList users={sortedUsers} color={color} deleteUser={handleDelete} /> 👈🏼 It does not change.
```

With this, we can see the `console.log` appears when you click on colored rows, unsort by country, etc. So, the idea is avoid sorting users when it is not necessary. To do that, use `userMemo()`.

BEFORE:
```
const sortUsers = (users: User[]) => {
  console.log('SORTING USERS')
  return sortByCountry
    ? users.sort((a, b) => a.location.country.localeCompare(b.location.country))
    : users
}

const sortedUsers = sortUsers(filteredUsers)

<UsersList users={sortedUsers} color={color} deleteUser={handleDelete} />
```

AFTER:
```
const sortedUsers = useMemo(() => {
  console.log('SORTING USERS')

  return sortByCountry
    ? filteredUsers.sort((a, b) => a.location.country.localeCompare(b.location.country))
    : filteredUsers
}, [filteredUsers, sortByCountry])

<UsersList users={sortedUsers} color={color} deleteUser={handleDelete} /> 👈🏼 It does not change.
```
> The console.log should appear just when click on 'Sort by country' and when type something.
> The console.log should not appear just when click on 'Color rows'

The same with filteredUsers like:

BEFORE:
```
const filteredUsers = search !== null && search.length > 0
  ? [...users].filter(user => user.location.country.toLowerCase().includes(search.toLowerCase()))
  : users
```

AFTER:
```
const filteredUsers = useMemo(() => {
  console.log('FILTERING USERS BY COUNTRY')

  return search !== null && search.length > 0
    ? [...users].filter(user => user.location.country.toLowerCase().includes(search.toLowerCase()))
    : users
}, [users, search])
```
> The console.log should appear just when type something.
> The console.log should not appear just when click on 'Color rows' and 'Sort by country'

___
### 10. ✨ Sort by clicking on the column header.
___

```
```