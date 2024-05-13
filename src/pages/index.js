import { Seo } from 'src/components/seo';
import { usePageView } from 'src/hooks/use-page-view';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import {useEffect} from 'react'
import {useRouter} from "next/router";
const Page = () => {
    const router = useRouter()
    useEffect(()=>{
        router.push("/dashboard/leads")
    },[])
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
