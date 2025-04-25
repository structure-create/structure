import { Header } from "@/components/header"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"

export default function ContactUs() {

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <Contact />
      <Footer />
    </div>
  )
}