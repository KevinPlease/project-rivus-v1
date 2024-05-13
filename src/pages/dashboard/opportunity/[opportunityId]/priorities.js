
import { Layout as DashboardLayout } from "src/layouts/dashboard";
import OpportunityCreatePriorities from "src/sections/dashboard/opportunity/opportunity-create-priorities";

const Page = () => {
  return (
      <>
        <OpportunityCreatePriorities />
      </>
  );
};

Page.getLayout = (page) => (
    <DashboardLayout>
      {page}
    </DashboardLayout>
);

export default Page;
