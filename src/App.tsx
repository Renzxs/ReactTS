import { useEffect, useState } from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { useSignUpForm } from './store';
import axios from 'axios';
import { Edit, Trash } from 'lucide-react'

function App() {

  const { fullname, email, password, userData, setFullname, setEmail, setPassword, setUserData } = useSignUpForm();
  const [statusMsg, setStatusMsg] = useState('');
  
  // Create a user
  const onSignUpHandler = () => {
    axios.post("http://localhost:5001/create-user", {
      fullname: fullname,
      email: email,
      password: password
    })
    .then((res) => {
      setStatusMsg(res.data.message);
      fetchUsers();
      setFullname('');
      setEmail('');
      setPassword('');
    })
    .catch((error) => {
      console.log(error);
    });
  }

  // Fetch Users
  const fetchUsers = () => {
    axios.get("http://localhost:5001/get-users")
    .then((res) => { setUserData(res.data.result.reverse()) })
    .catch((error) => { console.log(error) });
  }

  // Delete a User
  const onDeleteUser = (id: string) => {
    axios.delete(`http://localhost:5001/delete-user/${id}`)
    .then((res) => { fetchUsers() })
    .catch((error) => { console.log(error) });
  }

  // Update a user
  const onUpdateUser = (id: string) => {
    const updatedFullname = prompt("Enter a new fullname");
    const updatedEmail = prompt("Enter a new email address");
    const updatedPassword = prompt("Enter a new password");

    axios.put(`http://localhost:5001/edit-user/${id}`, {
      fullname: updatedFullname,
      email: updatedEmail,
      password: updatedPassword
    })
    .then((res) => {
      fetchUsers();
    })
    .catch((error) => {
      console.log(error) 
    });
  }

  useEffect(() => {
      fetchUsers();
  }, []);
  
  return (
    <div className="w-100 vh-100 d-flex justify-content-around align-items-center p-4 gap-3 flex-wrap small">
      {/* Create account form */}
      <div className="border rounded-3 p-4 shadow-lg">
        <h2 className='h2'>Create account</h2>
        <p className="mb-4">Please fill all the fields below.</p>
        {/* Fullname */}
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text" id="basic-addon1">@</span>
          </div>
          <input value={fullname} onChange={(e) => setFullname(e.target.value)} required type="text" className="form-control" placeholder="Fullname*" aria-label="Username" aria-describedby="basic-addon1"/>
        </div>

        {/* Email */}
        <div className="input-group mb-3">
          <input value={email} onChange={(e) => setEmail(e.target.value)} required type="text" className="form-control" placeholder="Email address*" aria-label="Email" aria-describedby="basic-addon2"/>
          <div className="input-group-append">
            <span className="input-group-text" id="basic-addon2">@example.com</span>
          </div>
        </div>

        {/* Password */}
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text" id="basic-addon1">*</span>
          </div>
          <input value={password} onChange={(e) => setPassword(e.target.value)} required type="password" className="form-control" placeholder="Password*" aria-label="Username" aria-describedby="basic-addon1"/>
        </div>

        {/* Add Button */}
        <div className='mt-4'>
          <button onClick={onSignUpHandler} className="btn btn-success w-100">Add Account</button>
        </div>

        {/* Status Message */}
        <div className='w-100 text-center d-flex justify-content-center'>
          <p className='mt-3 w-75 text-center'>{statusMsg}</p>
        </div>
      </div>

      {/* Table Display Container */}
      <div className="border rounded-3 p-4 shadow-lg flex-grow-1">
        <h2 className='h2'>Users account</h2>
        <p className="mb-4">List of users account in the system.</p>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Fullname</th>
              <th scope="col">Email</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {userData.length !== 0 ? 
              userData.map((user: any, index: number) => (
                <tr key={index}>
                  <th scope="row">{index+1}</th>
                  <td>{user.fullname}</td>
                  <td>{user.email}</td>
                  <td className="d-flex align-items-center gap-2">
                    <button onClick={() => onUpdateUser(user.id)} className='btn btn-primary d-flex justify-content-around align-items-center gap-1'>
                      <Edit width={20}/>
                      Edit
                    </button>
                    <button onClick={() => onDeleteUser(user.id)} className='btn btn-danger d-flex justify-content-around align-items-center gap-1'>
                      <Trash width={20}/>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
              :
              <tr>
                <th scope="row"></th>
                <td></td>
                <td>No users found.</td>
                <td></td>
              </tr>
            }
          </tbody>
        </table>
        <div className='d-flex justify-content-end'>
          <p className='small'>Showing {userData.length} of {userData.length} in {userData.length} entries.</p>
        </div>
      </div>
    </div>
  )
}

export default App;
