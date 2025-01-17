import { Seo } from "src/components/seo";
import { Layout as DashboardLayout } from "src/layouts/dashboard";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { paths } from "src/paths";

const Page = () => {
  const router = useRouter();
  useEffect(() => {
    router.push(paths.dashboard.index);
  }, []);

  return (
    <>
      <Seo />
      <main>
        {/*<HomeHero />*/}
        {/*<HomeFeatures />*/}
        {/*<HomeReviews />*/}
        {/*<HomeCta />*/}
        {/*<HomeFaqs />*/}
        {/*<Leads/>*/}
      </main>
    </>
  );
};

Page.getLayout = (page) => (
  // <MarketingLayout>
  //   {page}
  // </MarketingLayout>
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
