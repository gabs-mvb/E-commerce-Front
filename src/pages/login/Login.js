import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Link } from "react-router-dom";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import React, { useState } from "react";
import Swal from "sweetalert2";
import { toast } from 'react-toastify';
import { injectStyle } from "react-toastify/dist/inject-style";
import api from "./../../api/Api";
import { useNavigate } from 'react-router-dom';

const defaultTheme = createTheme();

export default function SignIn() {
  injectStyle();
  const navigate = useNavigate();

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
   
  const alertaErro = () => {
    Swal.fire({
        icon: "error",
        iconColor: "#FF9F1C",
        title: "<b>Oops!</b>",
        text: "Confira suas credênciais",
        position: "center",
        confirmButtonColor: "#FF9F1C",
        footer: "Certifique-se de estar inserindo as credênciais de uma conta existente"
    })
  }
  
  const alertaErroInterno = () => {
    Swal.fire({
        icon: "error",
        title: "<b>Acesso Negado!</b>",
        text: "Verifique suas informações e tente novamente",
        position: "center",
    })
  }
  

  const handleSubmit = (e) => {
    e.preventDefault();
        api.post('/usuarios/login', {
            email: email,
            senha: senha
        }, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then((response) => {
                console.log("Entrei no .then -> Login")
                if (response.status === 200 && response.data?.token) {

                    console.log("Entrei na validação de status do .then -> Login")

                    sessionStorage.setItem('authToken', response.data.token);
                    sessionStorage.setItem('nome', response.data.nome);
                    sessionStorage.setItem('id', response.data.id);
                    sessionStorage.setItem('email', response.data.email);
                    sessionStorage.setItem('permissao', response.data.permissao);
                    sessionStorage.setItem('status', response.data.status);

                    console.log(response.data);

                    //verificarPermissao();

                    toast.success('Login realizado com sucesso!');
                    navigate('/products')
                }
            })
            .catch(error => {
                if (error.response.status === 401 || error.response.status === 403) {
                    console.log("Entrei na validação de status do catch-> Login")
                    alertaErro()

                } else {
                    console.log("STATUS DO ERRO: " + error.response.status)
                    console.log(error.response)
                    console.error(error.message);

                    alertaErroInterno()
                }
            })
    }
 

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={(e) => {
                setEmail(e.target.value);
            }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Senha"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={(e) => {
                setSenha(e.target.value);
            }}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Lembre-me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Entrar
            </Button>
            <Grid container>
              <Grid item xs>
                <Link to="/singup" className="nav-link" variant="body2">
                  Esqueceu a senha?
                </Link>
              </Grid>
              <Grid item>
                <Link to="/singup" className="nav-link" variant="body2">
                  Não possui uma conta? Cadastre-se
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
