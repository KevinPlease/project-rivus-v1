import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";

import { Layout as DashboardLayout } from "src/layouts/dashboard";
import EditCreateClient from "src/sections/dashboard/client/edit-create-client";

const Page = () => {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth="xl">
        <Stack spacing={4}>
          <EditCreateClient current="Edit" />
        </Stack>
      </Container>
    </Box>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
