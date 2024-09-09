import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { injectStyle } from "react-toastify/dist/inject-style";
import api from "./../../api/Api";
import { useNavigate } from "react-router-dom";

const validationSchema = Yup.object().shape({
  nome: Yup.string()
    .required("Insira o seu nome")
    .test("one-words", "Nome inválido", (value) => {
      const words = value ? value.split(" ") : [];
      return words.length === 1 && words[0].replace(/\W/g, "").length > 0;
    }),
  email: Yup.string().email("Email inválido").required("Insira o seu email"),
  telefone: Yup.string()
    .matches(/^\(\d{2}\) \d{5}-\d{4}$/, "Insira o seu telefone com o DDD")
    .required("Insira o seu telefone com o DDD"),
  senha: Yup.string()
    .required("Insira uma senha")
    .min(8, "A senha deve ter pelo menos 8 caracteres"),
  senhaConfirmacao: Yup.string()
    .oneOf([Yup.ref("senha"), null], "Senhas não coincidem")
    .required("Confirme a sua senha"),
  cpf: Yup.string()
    .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "Insira um CPF válido")
    .required("Insira o seu CPF"),
});

export default function SignUp() {
  injectStyle();
  const navigate = useNavigate();
  const defaultTheme = createTheme();
  const [inputCPF, setInputCPF] = useState("");
  const [inputTelefone, setInputTelefone] = useState("");

  const handleTelefoneChange = (event, setFieldValue) => {
    const telefone = event.target.value.replace(/\D/g, "");
    let telefoneFormatado = "";

    if (telefone.length > 0) {
      telefoneFormatado = `(${telefone.slice(0, 2)}`;
      if (telefone.length > 2) {
        telefoneFormatado += `) ${telefone.slice(2, 7)}`;
        if (telefone.length > 7) {
          telefoneFormatado += `-${telefone.slice(7, 11)}`;
        }
      }
    }
    setInputTelefone(telefoneFormatado);
    setFieldValue("telefone", telefoneFormatado);
  };

  const handleCPFChange = (event, setFieldValue) => {
    const cpf = event.target.value.replace(/\D/g, "");
    let cpfFormatado = "";

    if (cpf.length > 0) {
      cpfFormatado = `${cpf.slice(0, 3)}.`;
      if (cpf.length > 3) {
        cpfFormatado += `${cpf.slice(3, 6)}.`;
        if (cpf.length > 6) {
          cpfFormatado += `${cpf.slice(6, 9)}-`;
          if (cpf.length > 9) {
            cpfFormatado += `${cpf.slice(9, 11)}`;
          }
        }
      }
    }
    setInputCPF(cpfFormatado);
    setFieldValue("cpf", cpfFormatado);
  };

  const handleSubmit = (values) => {
    const cpfNumerico = inputCPF.replace(/\D/g, "");
    const telefoneNumerico = inputTelefone.replace(/\D/g, "");

    const corpoRequisicao = {
      nome: values.nome,
      sobrenome: values.sobrenome,
      email: values.email,
      senha: values.senha,
      telefone: telefoneNumerico,
      cpf: cpfNumerico,
    };

    api.post("/usuarios/cadastro", corpoRequisicao)
      .then((response) => {
        if (response.status === 201) {
          toast.success("Cadastro realizado com sucesso!");
          navigate("/login");
        }
      })
      .catch((error) => {
        Swal.fire({
          title: "Cadastro inválido ou já existente. Por favor tente novamente.",
          confirmButtonColor: "#F29311",
        });
      });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 2, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ m: 2 }}>
            Cadastrar
          </Typography>
          <Formik
            initialValues={{
              nome: "",
              sobrenome: "",
              email: "",
              cpf: "",
              telefone: "",
              senha: "",
              senhaConfirmacao: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            validateOnBlur={true}
            validateOnChange={true}
          >
            {({ setFieldValue, touched, errors }) => (
              <Form noValidate>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      name="nome"
                      fullWidth
                      label="Nome"
                      autoFocus
                      helperText={<ErrorMessage name="nome" />}
                      error={touched.nome && Boolean(errors.nome)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      name="sobrenome"
                      fullWidth
                      label="Sobrenome"
                      helperText={<ErrorMessage name="sobrenome" />}
                      error={touched.sobrenome && Boolean(errors.sobrenome)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      name="email"
                      fullWidth
                      label="Email"
                      helperText={<ErrorMessage name="email" />}
                      error={touched.email && Boolean(errors.email)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      name="cpf"
                      label="CPF"
                      value={inputCPF}
                      onChange={(e) => handleCPFChange(e, setFieldValue)}
                      helperText={<ErrorMessage name="cpf" />}
                      error={touched.cpf && Boolean(errors.cpf)}
                      inputProps={{ maxLength: 14 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      name="telefone"
                      label="Telefone"
                      value={inputTelefone}
                      onChange={(e) => handleTelefoneChange(e, setFieldValue)}
                      helperText={<ErrorMessage name="telefone" />}
                      error={touched.telefone && Boolean(errors.telefone)}
                      inputProps={{ maxLength: 15 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      name="senha"
                      fullWidth
                      type="password"
                      label="Senha"
                      helperText={<ErrorMessage name="senha" />}
                      error={touched.senha && Boolean(errors.senha)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      name="senhaConfirmacao"
                      fullWidth
                      type="password"
                      label="Confirmar Senha"
                      helperText={<ErrorMessage name="senhaConfirmacao" />}
                      error={touched.senhaConfirmacao && Boolean(errors.senhaConfirmacao)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={<Checkbox value="allowExtraEmails" color="primary" />}
                      label="Quero receber promoções e atualizações por WhatsApp."
                    />
                  </Grid>
                </Grid>
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                  Cadastrar
                </Button>
                <Grid container justifyContent="flex-end">
                  <Grid item>
                    <Link to="/login" className="nav-link" variant="body2">
                      Já possui uma conta? Entrar
                    </Link>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
