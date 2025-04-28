import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Feedback } from "@/components/feedback"

export default function ContactUs() {

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <Feedback />
      <Footer />
    </div>
  )
}