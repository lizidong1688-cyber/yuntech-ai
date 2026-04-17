import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import PromptGenerator from "@/components/PromptGenerator";
import Portfolio from "@/components/Portfolio";
import Pricing from "@/components/Pricing";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <PromptGenerator />
        <Portfolio />
        <Pricing />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
