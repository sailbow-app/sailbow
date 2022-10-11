import { ChangeEvent, FC, useState } from 'react';

import { Box, Button, FormControl, Link, VStack } from '@chakra-ui/react';
import { Form, Formik, FormikProps } from 'formik';
import * as Yup from 'yup';

import { SbMailIcon, SbPasswordIcon, SbUserIcon } from 'shared/icons/Icons';
import { Input } from 'shared/input/Input';

interface FormValues {
    name: string;
    email: string;
    password1: string;
    password2: string;
}

const FormSchema = Yup.object().shape({
    name: Yup.string().required('Required').length(2),
    email: Yup.string().email('Invalid email').required('Required'),
    password1: Yup.string().required('Please enter your password.').min(8, 'Your password is too short.'),
    password2: Yup.string()
        .required('Please enter your password.')
        .min(8, 'Your password is too short.')
        .oneOf([Yup.ref('password1')], 'Your passwords do not match.'),
});

export const SignUpForm: FC = () => {
    const [signUpForm, setSignUpForm] = useState<FormValues>({ email: '', password1: '', name: '', password2: '' });

    const setForm = (e: ChangeEvent<HTMLInputElement>) => {
        setSignUpForm({
            ...signUpForm,
            [e.target.name]: e.target.value,
        });
    };

    const onSubmit = () => {
        console.log('logged in', signUpForm);
    };

    return (
        <Box w="100%">
            <Formik initialValues={signUpForm} onSubmit={onSubmit} validationSchema={FormSchema}>
                {({ errors, touched, getFieldProps }: FormikProps<FormValues>) => (
                    <Form style={{ width: '100%' }}>
                        <VStack w="100%" spacing="6">
                            <FormControl isInvalid={Boolean(errors.name && touched.name)} onChange={setForm}>
                                <Input
                                    label="Full Name"
                                    field={{ ...getFieldProps('name') }}
                                    error={Boolean(errors.name && touched.name)}
                                    errorLabel={errors.name}
                                    required
                                    name="name"
                                    id="name"
                                    placeholder="What do we call you?"
                                    leftIcon={<SbUserIcon />}
                                />
                            </FormControl>
                            <FormControl isInvalid={Boolean(errors.email && touched.email)} onChange={setForm}>
                                <Input
                                    label="Email"
                                    field={{ ...getFieldProps('email') }}
                                    error={Boolean(errors.email && touched.email)}
                                    errorLabel={errors.email}
                                    required
                                    name="email"
                                    id="email"
                                    placeholder="Enter your email"
                                    leftIcon={<SbMailIcon />}
                                />
                            </FormControl>
                            <FormControl isInvalid={Boolean(errors.password1 && touched.password1)} onChange={setForm}>
                                <Input
                                    type="password"
                                    label="Password"
                                    field={{ ...getFieldProps('password1') }}
                                    error={Boolean(errors.password1 && touched.password1)}
                                    errorLabel={errors.password1}
                                    required
                                    name="password1"
                                    id="password1"
                                    placeholder="Enter password"
                                    leftIcon={<SbPasswordIcon />}
                                />
                            </FormControl>
                            <FormControl isInvalid={Boolean(errors.password2 && touched.password2)} onChange={setForm}>
                                <Input
                                    type="password"
                                    label="Confirm Password"
                                    field={{ ...getFieldProps('password2') }}
                                    error={Boolean(errors.password2 && touched.password2)}
                                    errorLabel={errors.password2}
                                    required
                                    name="password2"
                                    id="password2"
                                    placeholder="Retype password"
                                    leftIcon={<SbPasswordIcon />}
                                />
                            </FormControl>
                            <Button w="100%" size="lg" type="submit">
                                Sign Up
                            </Button>
                        </VStack>
                    </Form>
                )}
            </Formik>
        </Box>
    );
};
