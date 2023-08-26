# React + TypeScript + Vite

Study practice based on [this video](https://www.youtube.com/watch?v=mNJOWXc83Y4&ab_channel=midulive).

## 🩵 Tasks:

1. [x] Fetch 100 rows of data using the API.
2. [x] Display the data in a table format, similar to the example.
3. [x] Provide the option to color rows as shown in the example.
4. [x] Allow the data to be sorted by country as demonstrated in the example.
5. [] Enable the ability to delete a row as shown in the example.
6. [] Implement a feature that allows the user to restore the initial state, meaning that all deleted rows will be recovered.
7. [] Handle any potential errors that may occur.
8. [] Implement a feature that allows the user to filter the data by country.
9. [] Avoid sorting users again the data when the user is changing filter by country.
10. [] Sort by clicking on the column header.

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
### 5. ✨ 
___

```
```
