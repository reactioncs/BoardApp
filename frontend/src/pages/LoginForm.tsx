import { Box, Button, TextField, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Formik, FormikHelpers } from "formik";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { setLogin } from "../state/authSlice";
import { User } from "../types/authTypes";
import axios from "axios";

type PageType = "login" | "register";

interface AuthType {
    username: string;
    password: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    location?: string;
    occupation?: string;
}

const registerSchema = yup.object().shape({
    username: yup.string().required("required"),
    password: yup.string().required("required"),
    email: yup.string().email("invalid email").required("required"),
    firstName: yup.string().required("required"),
    lastName: yup.string().required("required"),
    location: yup.string(),
    occupation: yup.string(),
});

const loginSchema = yup.object().shape({
    username: yup.string().required("required"),
    password: yup.string().required("required"),
});

const initialValuesRegister: AuthType = {
    username: "",
    password: "",
    email: "",
    firstName: "",
    lastName: "",
    location: "",
    occupation: "",
};

const initialValuesLogin: AuthType = {
    username: "",
    password: "",
};

function LoginForm() {
    const { palette } = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isNonMobile = useMediaQuery("(min-width:600px)");

    const [pageType, setPageType] = useState<PageType>("login");
    const isLogin = pageType === "login";
    const isRegister = pageType === "register";

    const login = async (values: AuthType, onSubmitProps: FormikHelpers<AuthType>) => {
        const credential = {
            username: values.username,
            password: values.password,
        };

        const loginUrl = `${import.meta.env.VITE_API_URL}/api/user/login/`;
        await axios.post(loginUrl, credential, {
            timeout: 60000,
            withCredentials: true,
            xsrfCookieName: 'csrftoken',
            xsrfHeaderName: 'X-CSRFToken',
            withXSRFToken: true,
            headers: {
                Accept: "application/json",
            },
        });

        const userUrl = `${import.meta.env.VITE_API_URL}/api/user/`;
        const userApiResponse = await fetch(userUrl, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });

        if (userApiResponse.status !== 200)
            throw Error("log in failed.");

        const user: User = await userApiResponse.json();

        console.log(user);

        dispatch(setLogin({ user }));

        onSubmitProps.resetForm();
        navigate("/");
    }

    const register = async (values: AuthType, onSubmitProps: FormikHelpers<AuthType>) => {
        const credential = {
            username: values.username,
            password: values.password,
            email: values.email,
            firstName: values.firstName,
            lastName: values.lastName,
            location: values.location,
        };

        const registerUrl = `${import.meta.env.VITE_API_URL}/api/user/register/`;
        await axios.post(registerUrl, credential, {
            timeout: 60000,
            headers: {
                Accept: "application/json",
            },
        });

        onSubmitProps.resetForm();

        setPageType("login");
    }

    const handleFormSubmit = async (values: AuthType, onSubmitProps: FormikHelpers<AuthType>) => {
        if (isLogin) await login(values, onSubmitProps);
        if (isRegister) await register(values, onSubmitProps);
    };

    return (
        <Formik
            onSubmit={handleFormSubmit}
            initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
            validationSchema={isLogin ? loginSchema : registerSchema}
        >
            {({
                values,
                errors,
                touched,
                handleBlur,
                handleChange,
                handleSubmit,
                // setFieldValue,
                resetForm,
            }) => (
                <form onSubmit={handleSubmit}>
                    <Box
                        display="grid"
                        gap="30px"
                        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                        sx={{
                            "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                        }}
                    >
                        <TextField
                            label="Username"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.username}
                            name="username"
                            error={Boolean(touched.username) && Boolean(errors.username)}
                            helperText={touched.username && errors.username}
                            sx={{ gridColumn: "span 4" }}
                        />
                        <TextField
                            label="Password"
                            type="password"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.password}
                            name="password"
                            error={Boolean(touched.password) && Boolean(errors.password)}
                            helperText={touched.password && errors.password}
                            sx={{ gridColumn: "span 4" }}
                        />
                        {isRegister && (
                            <>
                                <TextField
                                    label="First Name"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.firstName}
                                    name="firstName"
                                    error={Boolean(touched.firstName) && Boolean(errors.firstName)}
                                    helperText={touched.firstName && errors.firstName}
                                    sx={{ gridColumn: "span 2" }}
                                />
                                <TextField
                                    label="Last Name"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.lastName}
                                    name="lastName"
                                    error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                                    helperText={touched.lastName && errors.lastName}
                                    sx={{ gridColumn: "span 2" }}
                                />
                                <TextField
                                    label="Email"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.email}
                                    name="email"
                                    error={Boolean(touched.email) && Boolean(errors.email)}
                                    helperText={touched.email && errors.email}
                                    sx={{ gridColumn: "span 4" }}
                                />
                                <TextField
                                    label="Location"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.location}
                                    name="location"
                                    error={Boolean(touched.location) && Boolean(errors.location)}
                                    helperText={touched.location && errors.location}
                                    sx={{ gridColumn: "span 4" }}
                                />
                                <TextField
                                    label="Occupation"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.occupation}
                                    name="occupation"
                                    error={Boolean(touched.occupation) && Boolean(errors.occupation)}
                                    helperText={touched.occupation && errors.occupation}
                                    sx={{ gridColumn: "span 4" }}
                                />
                            </>
                        )}
                        <Box sx={{ gridColumn: "span 4" }}>
                            <Button
                                fullWidth
                                type="submit"
                                sx={{
                                    m: "2rem 0",
                                    p: "1rem",
                                    backgroundColor: palette.primary.main,
                                    color: palette.background.alt,
                                    "&:hover": { color: palette.primary.main },
                                }}
                            >
                                {isLogin ? "LOGIN" : "REGISTER"}
                            </Button>
                            <Typography
                                onClick={() => {
                                    setPageType(isLogin ? "register" : "login");
                                    resetForm();
                                }}
                                sx={{
                                    textDecoration: "underline",
                                    color: palette.primary.main,
                                    "&:hover": {
                                        cursor: "pointer",
                                        color: palette.primary.light,
                                    },
                                }}
                            >
                                {isLogin
                                    ? "Don't have an account? Sign Up here."
                                    : "Already have an account? Login here."}
                            </Typography>
                        </Box>
                    </Box>
                </form>
            )}
        </Formik>
    );
}

export default LoginForm;