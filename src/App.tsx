import { useEffect, useState } from 'react';
import { useSignUpForm } from './store';
import axios from 'axios';
import { Edit, Trash, Search } from 'lucide-react'
import { Container, Box, Typography, TextField, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { SearchRounded } from '@mui/icons-material';

function App() {

  // UserStore (Zustand)
  const { fullname, 
          email, 
          password, 
          userData, 
          setFullname, 
          setEmail, 
          setPassword, 
          setUserData } = useSignUpForm();

  // Status Message
  const [statusMsg, 
        setStatusMsg] = useState('');

  // Search Bar
  const [search, setSearch] = useState('');
  
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
    axios.get("http://localhost:5001/get-users", {
      params: {
        searchFullName: search
      }
    })
    .then((res) => { setUserData(res.data.result.reverse()) })
    .catch((error) => { console.log(error) });
  }

  // Delete a User
  const onDeleteUser = (id: string) => {
    axios.delete(`http://localhost:5001/delete-user/${id}`)
    .then((res) => { 
      fetchUsers();
      console.log(res.data);
    })
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
      console.log(res.data);
    })
    .catch((error) => {
      console.log(error) 
    });
  }

  // Run's every runtime.
  useEffect(() => {
      fetchUsers();
  }, [search]);
  
  return (
    <Container sx={{width: '100%', height: '100vh', display: 'flex', alignItems: 'flex-start' , justifyContent: 'center', padding: 4, gap: 3, flexWrap: 'wrap'}}>
      {/* Create account form */}
      <Box sx={{boxShadow: 2, borderRadius: 3, padding: 4, width: '30%'}}>
        <Typography variant='h4'>Create account</Typography>
        <Typography variant='subtitle2' sx={{mb: 3}}>Please fill all the fields below.</Typography>

        <Box sx={{display: 'flex', justifyContent: 'flex-start', flexDirection: 'column', gap: 2}}>
          {/* Fullname */}
          <TextField value={fullname} onChange={(e) => setFullname(e.target.value)} required type='text' size='small' id="outlined-basic" label="Fullname" variant="outlined" />

          {/* Email */}
          <TextField value={email} onChange={(e) => setEmail(e.target.value)} required type='email' size='small' id="outlined-basic" label="Email address" variant="outlined" />
        
          {/* Password */}
          <TextField value={password} onChange={(e) => setPassword(e.target.value)} required type='password' size='small' id="outlined-basic" label="Password" variant="outlined" />
        </Box>

        {/* Add Button */}
        <Box sx={{mt: 3}}>
          <Button onClick={onSignUpHandler} variant='contained' sx={{textTransform: 'none', width: '100%'}}>Add Account</Button>
        </Box>

        {/* Status Message */}
        <Box sx={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <Typography sx={{mt: 3, textAlign: 'center'}} variant='subtitle2'>{statusMsg}</Typography>
        </Box>
      </Box>

      {/* Table Display Container */}
      <Box sx={{boxShadow: 2, borderRadius: 3, padding: 4, flexGrow: 1}}>
        <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          {/* Header Title */}
          <Box>
            <Typography variant='h4'>Users account</Typography>
            <Typography variant='subtitle2'>List of users account in the system.</Typography>
          </Box>

          {/* Search Bar */}
          <Box sx={{ display: 'flex', alignItems: 'center', }}>
            <SearchRounded sx={{ mr: 1, my: 0.5 }} />
            <TextField value={search} onChange={(e) => setSearch(e.target.value)} size='small' id="input-with-sx" label="Search a user.." variant="outlined" />
          </Box>
        </Box>

        {/* TABLE */}
        <TableContainer sx={{mt: 2}}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell sx={{fontWeight: 'bold'}} align="left">Fullname</TableCell>
                <TableCell sx={{fontWeight: 'bold'}}  align="left">Email Adress</TableCell>
                <TableCell sx={{fontWeight: 'bold'}}  align="left">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                userData.map((row: any, index: number) => (
                  <TableRow>
                    <TableCell>{index+1}</TableCell>
                    <TableCell>{row.fullname}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                      <Button onClick={() => onUpdateUser(row.id)} variant='contained' sx={{textTransform: 'none', bgcolor: '#009d00', display:'flex', justifyContent: 'center', alignItems: 'center', gap: 1 ,":hover": {bgcolor: 'green'}}}>
                        <Edit width={20}/>
                        Edit
                      </Button>

                      <Button onClick={() => onDeleteUser(row.id)} variant='contained' sx={{textTransform: 'none', bgcolor: '#c40000', display:'flex', justifyContent: 'center', alignItems: 'center', gap: 1 ,":hover": {bgcolor: '#b10000'}}}>
                        <Trash width={20}/>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{display:'flex', justifyContent: 'flex-end', mt: 2}} className='d-flex justify-content-end'>
          <Typography variant='subtitle2' sx={{color:'gray'}}>Showing {userData.length} of {userData.length} in {userData.length} entries.</Typography>
        </Box>
      </Box>
    </Container>
  );
}

export default App;
