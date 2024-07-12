import { useEffect, useState } from 'react';
import { useSignUpForm } from './store';
import axios from 'axios';
import { Edit, Trash } from 'lucide-react'
import { Container, 
         Box, 
         Typography, 
         TextField, 
         Button, 
         TableContainer, 
         Table, 
         TableHead, 
         TableRow, 
         TableCell, 
         TableBody, 
         Alert, 
         Modal} from '@mui/material';
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

  // Current user
  const [currentUserID, setCurrentUserID] = useState('');

  // Status Message
  const [statusMsg, setStatusMsg] = useState('');
  const [statusBoolean, setStatusBoolean] = useState('');

  // Search Bar
  const [search, setSearch] = useState('');

  // Modals
  // Update Modal
  const [UpdateModal, setUpdateModal] = useState(false);
  const openUpdateModal = (id: any) => {
    axios.get("http://localhost:5001/user/get-users", {
      params: {
        getUserByID: id
      }
    })
    .then((res) => {
      setFullname(res.data.result.fullname);
      setEmail(res.data.result.email);
      setPassword(res.data.result.password);
      setUpdateModal(true);
      setStatusMsg('');
      setStatusBoolean('');
      setCurrentUserID(id);
    })
    .catch((err) => {
      console.log(err);
    });
  }
  const closeUpdateModal = () => {
    setUpdateModal(false);
    setFullname('');
    setEmail('');
    setPassword('');
    setStatusMsg('');
    setStatusBoolean('');
  } 
  // Delete Modal
  const [DeleteModal, setDeleteModal] = useState(false);
  const openDeleteModal = (id: any) => {
    setCurrentUserID(id);
    setDeleteModal(true);
  }
  const closeDeleteModal = () => {
    setDeleteModal(false);
  }

  // Alert Status
  const alertStatus = (status: boolean, message: string) => {
    setStatusMsg(message);
    if(status){
      setStatusBoolean("success")
    }
    else {
      setStatusBoolean("error");
    }
  }
  
  // Create a user
  const onSignUpHandler = () => {
    axios.post("http://localhost:5001/user/create-user", {
      fullname: fullname,
      email: email,
      password: password
    })
    .then((res) => {
      alertStatus(res.data.success, res.data.message);
      fetchUsers();
      if(res.data.success){
        setFullname('');
        setEmail('');
        setPassword('');
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }

  // Fetch Users
  const fetchUsers = () => {
    axios.get("http://localhost:5001/user/get-users", {
      params: {
        searchFullName: search
      }
    })
    .then((res) => { setUserData(res.data.result.reverse()) })
    .catch((error) => { console.log(error) });
  }

  // Delete a User
  const onDeleteUser = () => {
    axios.delete(`http://localhost:5001/user/delete-user/${currentUserID}`)
    .then((res) => { 
      fetchUsers();
      setDeleteModal(false);
      console.log(res.data);
    })
    .catch((error) => { console.log(error) });
  }

  // Update a user
  const onUpdateUser = () => {
    axios.put(`http://localhost:5001/user/edit-user/${currentUserID}`, {
      fullname: fullname,
      email: email,
      password: password
    })
    .then((res) => {
      if(res.data.success) {
        setUpdateModal(false);
        alertStatus(res.data.success, res.data.message);
        fetchUsers();
        setFullname('');
        setEmail('');
        setPassword('');
      }
      else {
        alertStatus(res.data.success, res.data.message);
      }
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
    // Main Container
    <> 
      <Container sx={{width: '100%', height: '100vh', display: 'flex', alignItems: 'flex-start' , justifyContent: 'center', padding: 4, gap: 3, flexWrap: 'wrap'}}>
        {/* Create account form */}
        <Box sx={{boxShadow: 2, borderRadius: 3, padding: 4, width: { lg: '30%', md: '80%', sm: '80%'}}}>
          <Typography variant='h4'>Create account</Typography>
          <Typography variant='subtitle2' sx={{mb: 3}}>Please fill all the fields below.</Typography>

          <Box sx={{display: 'flex', justifyContent: 'flex-start', flexDirection: 'column', gap: 2}}>
            {/* Fullname */}
            <TextField InputLabelProps={{ style: { fontSize: '13px' } }} InputProps={{ style: { fontSize: '12px' } }}  error={statusBoolean === 'error' && fullname.length === 0} value={fullname} onChange={(e) => setFullname(e.target.value)} required type='text' size='small' id="fullname" label="Fullname" variant="outlined" />

            {/* Email */}
            <TextField InputLabelProps={{ style: { fontSize: '13px' } }} InputProps={{ style: { fontSize: '12px' } }} error={statusBoolean === 'error' && email.length === 0} value={email} onChange={(e) => setEmail(e.target.value)} required type='email' size='small' id="email" label="Email address" variant="outlined" />
          
            {/* Password */}
            <TextField InputLabelProps={{ style: { fontSize: '13px' } }} InputProps={{ style: { fontSize: '12px' } }} error={statusBoolean === 'error' && password.length === 0}  value={password} onChange={(e) => setPassword(e.target.value)} required type='password' size='small' id="password" label="Password" variant="outlined" />
          </Box>

          {/* Add Button */}
          <Box sx={{mt: 3}}>
            <Button onClick={onSignUpHandler} variant='contained' sx={{textTransform: 'none', width: '100%'}}>Add Account</Button>
          </Box>

          {/* Status Message */}
          <Alert sx={{mt: 3, fontSize: '12px'}} severity={statusBoolean}>
              {statusMsg}
          </Alert>
        </Box>

        {/* Table Display Container */}
        <Box sx={{boxShadow: 2, borderRadius: 3, padding: 4, flexGrow: 1,}}>
          <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
            {/* Header Title */}
            <Box>
              <Typography variant='h4'>Users account</Typography>
              <Typography variant='subtitle2'>List of users account in the system.</Typography>
            </Box>

            {/* Search Bar */}
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1}}>
              <SearchRounded sx={{ mr: 1, my: 0.5 }} />
              <TextField  value={search} onChange={(e) => setSearch(e.target.value)} sx={{width: '100%'}} size='small' id="input-with-sx" label="Search a user.." variant="outlined" />
            </Box>
          </Box>

          {/* TABLE */}
          <TableContainer sx={{mt: 2}}>
            <Table>
              {/* Table header */}
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell sx={{fontWeight: 'bold', fontSize: '12px'}} align="left">Fullname</TableCell>
                  <TableCell sx={{fontWeight: 'bold', fontSize: '12px'}}  align="left">Email Adress</TableCell>
                  <TableCell sx={{fontWeight: 'bold', fontSize: '12px'}}  align="left">Actions</TableCell>
                </TableRow>
              </TableHead>
              {/* Table body */}
              <TableBody>
                { 
                  // Data Table
                  userData.map((row: any, index: number) => (
                    <TableRow key={index} sx={{bgcolor: `${index%2 === 0 ? '#f0f0f0' : ''}`, ':hover': {bgcolor: '#e7e7e7'}}}>
                      <TableCell sx={{fontSize: '12px'}}>{index+1}</TableCell>
                      <TableCell sx={{fontSize: '12px'}}>{row.fullname}</TableCell>
                      <TableCell sx={{fontSize: '12px'}}>{row.email}</TableCell>
                      <TableCell sx={{display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap'}}>
                        {/* Edit Button*/}
                        <Button onClick={() => openUpdateModal(row.id)} variant='contained' sx={{textTransform: 'none', bgcolor: '#009d00', display:'flex', justifyContent: 'center', alignItems: 'center', gap: 1 ,  fontSize: '12px', ":hover": {bgcolor: 'green'}}}>
                          <Edit width={20}/>
                          Edit
                        </Button>

                        {/* Delete Button */}
                        <Button onClick={(() => openDeleteModal(row.id))} variant='contained' sx={{textTransform: 'none', bgcolor: '#c40000', display:'flex', justifyContent: 'center', alignItems: 'center', gap: 1, fontSize: '12px' ,":hover": {bgcolor: '#b10000'}}}>
                          <Trash width={20}/>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                }
                {
                  // No users found
                  userData.length === 0 && (
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell>No users found in the list.</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  )
                }
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{display:'flex', justifyContent: 'flex-end', mt: 2}} className='d-flex justify-content-end'>
            <Typography variant='subtitle2' sx={{color:'gray'}}>Showing {userData.length} of {userData.length} in {userData.length} entries.</Typography>
          </Box>
        </Box>
      </Container>

      {/* Update Modal */}
      <Modal open={UpdateModal} onClose={closeUpdateModal} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <Box sx={{bgcolor: 'white', boxShadow: 2, borderRadius: 3, padding: 4, width: '30%'}}>
          <Typography variant='h4'>Edit account</Typography>
          <Typography variant='subtitle2' sx={{mb: 3}}>Update or modify the user account here.</Typography>

          <Box sx={{display: 'flex', justifyContent: 'flex-start', flexDirection: 'column', gap: 2}}>
            {/* Fullname */}
            <TextField InputLabelProps={{ style: { fontSize: '13px' } }} InputProps={{ style: { fontSize: '12px' } }} error={statusBoolean === 'error' && fullname.length === 0} value={fullname} onChange={(e) => setFullname(e.target.value)} required type='text' size='small' id="update-fullname" label="Fullname" variant="outlined" />

            {/* Email */}
            <TextField InputLabelProps={{ style: { fontSize: '13px' } }} InputProps={{ style: { fontSize: '12px' } }} error={statusBoolean === 'error' && email.length === 0} value={email} onChange={(e) => setEmail(e.target.value)} required type='email' size='small' id="update-email" label="Email" variant="outlined" />
          
            {/* Password */}
            <TextField InputLabelProps={{ style: { fontSize: '13px' } }} InputProps={{ style: { fontSize: '12px' } }} error={statusBoolean === 'error' && password.length === 0}  value={password} onChange={(e) => setPassword(e.target.value)} required type='password' size='small' id="update-password" label="Password" variant="outlined" />
          </Box>

          {/* Add Button */}
          <Box sx={{mt: 3}}>
            <Button onClick={() => onUpdateUser()} variant='contained' sx={{textTransform: 'none', width: '100%',  bgcolor: '#009d00', ":hover": {bgcolor: 'green'}}}>Save changes</Button>
          </Box>

          {/* Status Message */}
          <Alert sx={{mt: 3, fontSize: '12px'}} severity={statusBoolean}>
              {statusMsg}
          </Alert>
        </Box>
      </Modal>

      {/* Delete Modal */}
      <Modal open={DeleteModal} onClose={closeDeleteModal} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <Box sx={{bgcolor: 'white', boxShadow: 2, borderRadius: 3, padding: 4, width: '30%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
          <Box>
            <Typography variant='h5'>Are you sure to delete this user?</Typography>
            <Typography variant='subtitle2'>Once you already deleted it, you can't revert it</Typography>
          </Box>

          {/* Add Button */}
          <Box sx={{mt: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, width: '100%'}}>
            <Button onClick={() => setDeleteModal(false)} variant='outlined' sx={{textTransform: 'none', flexGrow: 1}}>Cancel</Button>
            <Button onClick={() => onDeleteUser()} variant='contained' sx={{textTransform: 'none', bgcolor: '#c40000', ":hover": {bgcolor: '#b10000'}, flexGrow: 1}}>Delete</Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}

export default App;
