import { type User } from '../types.d'

interface Props {
  users: User[]
  color: boolean
  deleteUser: (email: string) => void
}

export function UsersList ({ users, color, deleteUser }: Props) {
  return (
    <table width="100%">
      <thead>
        <tr>
          <th>Photo</th>
          <th>Name</th>
          <th>Last name</th>
          <th>Country</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody className={ color ? 'row-color' : '' }>
        {
          users.map(user => (
            <tr key={user.email}>
              <td>
                <img src={user.picture.thumbnail} alt={user.name.first} />
              </td>
              <td>{user.name.first}</td>
              <td>{user.name.last}</td>
              <td>{user.location.country}</td>
              <td>
                <button onClick={() => { deleteUser(user.email) }}>Delete</button>
              </td>
            </tr>
          ))
        }
      </tbody>
    </table>
  )
}
