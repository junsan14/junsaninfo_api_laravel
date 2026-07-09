//import Contact from "@/components/Contact";
import HomeHero from "@/components/home/HomeHero";
import HomeAbout from "@/components/home/HomeAbout";
import FeaturedWorks from "@/components/home/FeaturedWorks";
import HomeBlog from "@/components/home/HomeBlog";



export default function Home() {
  return (
    <>
      <HomeHero />
      <HomeAbout />
      <FeaturedWorks />
      <HomeBlog />
    </>
  );
}