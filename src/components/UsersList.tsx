import { type User } from '../types.d'

interface Props {
  users: User[]
  color: boolean
}

export function UsersList ({ users, color }: Props) {
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
          users.map((user, index) => (
            <tr key={index}>
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
  )
}
