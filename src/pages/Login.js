import React, { useState } from 'react'
import { useHistory } from "react-router-dom";
import { CButton, CCard, CCardBody, CCardGroup, CCol, CContainer, CForm, CFormInput, CInputGroup, CInputGroupText, CRow, } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import axios from 'axios';
import toast from 'react-hot-toast';
const Login = () => {
    const history = useHistory();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    function handleLoginProcess() {
        if (username !== '') {
            if (password !== '') {
                var body = { username: username, password: password };
                axios({ method: 'POST', url: process.env.REACT_APP_API_URL + 'api/auth/login', data: body })
                    .then(function (response) {
                        if (response.status == 200) {
                            console.log(response.data);
                            localStorage.setItem('is_login', true);
                            localStorage.setItem('full_name', response.data.full_name);
                            localStorage.setItem('token', response.data.token.token);
                            localStorage.setItem('user_id', response.data.user_id);
                            window.location.reload(false);
                        }
                    }).catch(function (error) {
                        toast.error('Incorrect Password or Username')
                        console.log(error);
                    });
            } else {
                alert('Enter Password');
            }
        } else {
            alert('Enter Username');
        }
    }
    return (
        <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
            <CContainer>
                <CRow className="justify-content-center">
                    <CCol md={8}>
                        <CCardGroup>
                            <CCard className="p-4">
                                <CCardBody>
                                    <CForm>
                                        <h1>Login</h1>
                                        <p className="text-medium-emphasis">Sign In to your account</p>
                                        <CInputGroup className="mb-3">
                                            <CInputGroupText>
                                                <CIcon icon={cilUser} />
                                            </CInputGroupText>
                                            <CFormInput
                                                placeholder="Username"
                                                autoComplete="username"
                                                onChange={(e) => setUsername(e.target.value)} />
                                        </CInputGroup>
                                        <CInputGroup className="mb-4">
                                            <CInputGroupText>
                                                <CIcon icon={cilLockLocked} />
                                            </CInputGroupText>
                                            <CFormInput
                                                type="password"
                                                placeholder="Password"
                                                autoComplete="current-password"
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                        </CInputGroup>
                                        <CRow>
                                            <CCol xs={6}>
                                                <CButton color="primary" className="px-4" onClick={handleLoginProcess}>
                                                    Login
                                                </CButton>
                                            </CCol>
                                        </CRow>
                                    </CForm>
                                </CCardBody>
                            </CCard>
                        </CCardGroup>
                    </CCol>
                </CRow>
            </CContainer>
        </div>
    )
}

export default Login
