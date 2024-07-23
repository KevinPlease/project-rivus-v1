import * as Yup from "yup";
import { useFormik } from "formik";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { Seo } from "src/components/seo";
import { GuestGuard } from "src/guards/guest-guard";
import { IssuerGuard } from "src/guards/issuer-guard";
import { useAuth } from "src/hooks/use-auth";
import { useMounted } from "src/hooks/use-mounted";
import { usePageView } from "src/hooks/use-page-view";
import { useRouter } from "src/hooks/use-router";
import { useSearchParams } from "src/hooks/use-search-params";
import { Layout as AuthLayout } from "src/layouts/auth/modern-layout";
import { paths } from "src/paths";
import { Issuer } from "src/utils/auth";
import toast from "react-hot-toast";

const initialValues = {
  username: "",
  password: "",
  submit: null
};

const validationSchema = Yup.object({
  username: Yup
    .string()
    .max(255)
    .required("Username is required"),
  password: Yup
    .string()
    .max(255)
    .required("Password is required")
});



const Page = () => {
  const isMounted = useMounted();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") || "/";
  const { signIn } = useAuth();
  
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, helpers) => {
      try {
        await signIn(values.username, values.password);

        if (isMounted()) {
          const pathToReturnTo = returnTo !== "/" ? returnTo : paths.dashboard.customers;
          router.push(pathToReturnTo);
        }
      } catch (err) {
        console.error(err);

        if (isMounted()) {
          helpers.setStatus({ success: false });
          helpers.setErrors({ submit: err.message });
          helpers.setSubmitting(false);
          toast.error("No user found with those credentials!");
        }
      }
    }
  });

  usePageView();

  return (
    <>
      <Seo title="Login" />
      <div>
        <Stack
          sx={{ mb: 4 }}
          spacing={1}
        >
          <Typography variant="h5">
            Log in
          </Typography>
        </Stack>
        <form
          noValidate
          onSubmit={formik.handleSubmit}
        >
          <Stack spacing={3}>
            <TextField
              autoFocus
              error={!!(formik.touched.username && formik.errors?.username)}
              fullWidth
              helperText={formik.touched.username && formik.errors?.username}
              label="Username"
              name="username"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="text"
              value={formik.values.username}
            />
            <TextField
              error={!!(formik.touched.password && formik.errors?.password)}
              fullWidth
              helperText={formik.touched.password && formik.errors?.password}
              label="Password"
              name="password"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="password"
              value={formik.values.password}
            />
          </Stack>
          <Button
            fullWidth
            sx={{ mt: 3 }}
            size="large"
            type="submit"
            disabled={formik.isSubmitting}
            variant="contained"
          >
            Continue
          </Button>
          {/* <Box sx={{ mt: 3 }}>
            <Link
              href="#"
              underline="hover"
              variant="subtitle2"
            >
              Forgot password?
            </Link>
          </Box> */}
        </form>
      </div>
    </>
  );
};

Page.getLayout = (page) => (
  <IssuerGuard issuer={Issuer.USER}>
    <GuestGuard>
      <AuthLayout>
        {page}
      </AuthLayout>
    </GuestGuard>
  </IssuerGuard>
);

export default Page;
