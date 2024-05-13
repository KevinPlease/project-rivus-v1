
import { Layout as DashboardLayout } from "src/layouts/dashboard";
import EditCreateOpportunity from "src/sections/dashboard/opportunity/edit-create-opportunity";

const Page = () => {

  return (
    <>
      <EditCreateOpportunity current="Create"/>
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
