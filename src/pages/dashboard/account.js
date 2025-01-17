import { useCallback, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import { Seo } from "src/components/seo";
import { Layout as DashboardLayout } from "src/layouts/dashboard";
import { AccountGeneralSettings } from "src/sections/dashboard/account/account-general-settings";
import { AccountSecuritySettings } from "src/sections/dashboard/account/account-security-settings";
import {useAuth} from "../../hooks/use-auth";
import { AccountNotificationsSettings } from "src/sections/dashboard/account/account-notifications-settings";

const tabs = [
  { label: "General", value: "general" },
  { label: "Security", value: "security" },
  { label: "Notifications", value: "notifications" }
];

const Page = () => {
  const [currentTab, setCurrentTab] = useState("general");
  const { user } = useAuth();

  const handleTabsChange = useCallback((event, value) => {
    setCurrentTab(value);
  }, []);

  return (
    <>
      <Seo title="Dashboard: Account" />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="xl">
          <Stack
            spacing={3}
            sx={{ mb: 3 }}
          >
            <Typography variant="h4">
              Account
            </Typography>
            <div>
              <Tabs
                indicatorColor="primary"
                onChange={handleTabsChange}
                scrollButtons="auto"
                textColor="primary"
                value={currentTab}
                variant="scrollable"
              >
                {tabs.map((tab) => (
                  <Tab
                    key={tab.value}
                    label={tab.label}
                    value={tab.value}
                  />
                ))}
              </Tabs>
              <Divider />
            </div>
          </Stack>
          {currentTab === "general" && (
            <AccountGeneralSettings
             user={user}
            />
          )}
          
          {currentTab === "security" && (
            <AccountSecuritySettings
              user={user}
            />
          )}

          {currentTab === "notifications" && (
            <AccountNotificationsSettings
              user={user}
            />
          )}
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
