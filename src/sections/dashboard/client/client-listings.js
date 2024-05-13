import { useCallback, useState } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";

import { ClientProperties } from "src/sections/dashboard/client/client-properties";
import { ClientOpportunities } from "src/sections/dashboard/client/client-opportunities";


const TABS = [
  {
    label: "Properties",
    value: "properties"
  },
  {
    label: "Opportunities",
    value: "opportunities"
  }
];


export const ClientListings = ({ clientData, clientId }) => {
  const [currentTab, setCurrentTab] = useState("properties");

  const handleTabsChange = useCallback((event, value) => {
    setCurrentTab(value);
  }, []);


  return (
    <Box component="main" display="flex" flexDirection="column" overflow="hidden" flex="1 1 auto">
      {/*  <div className="w-fit relative bottom-8 ">
                <Tabs
                    indicatorColor="primary"
                    onChange={handleTabsChange}
                    scrollButtons="auto"
                    sx={{px: 1, maxWidth: "fit", borderBottom:"1px #2D3649 solid", mx: 0}}
                    textColor="primary"
                    value={currentTab}
                    variant="scrollable"
                >
                    <Tab
                        label={TABS[0].label}
                        value={TABS[0].value}
                        sx={{px:1}}
                    />
                    <div className="w-[1.5px] bg-[#17B264] h-14"/>
                    <Tab
                        label={TABS[1].label}
                        value={TABS[1].value}
                        sx={{px:1}}
                    />
                </Tabs>
            </div>
*/}
      <Tabs
        indicatorColor="primary"
        onChange={handleTabsChange}
        scrollButtons="auto"
        sx={{ px: 4 }}
        textColor="primary"
        value={currentTab}
        variant="scrollable"
      >
        {TABS.map((tab) => (
          <Tab
            key={tab.value}
            label={tab.label}
            value={tab.value}
          />
        ))}
      </Tabs>
      <Divider sx={{ mb: 4 }} />

      {currentTab === "properties" && <ClientProperties clientData={clientData} clientId={clientId} />}
      {currentTab === "opportunities" && <ClientOpportunities clientData={clientData} clientId={clientId} />}
    </Box>
  );

};
