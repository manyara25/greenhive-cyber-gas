import {
  ArrowRight,
  CheckCircle,
  Clock,
  FileText,
  Flame,
  Globe,
  MapPin,
  MessageCircle,
  Phone,
  Printer,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import RequestService from "./pages/RequestService";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import RequestStatus from "./pages/RequestStatus";
function App() {
  if (window.location.pathname === "/request-status") {
  return <RequestStatus />;
}
  if (window.location.pathname === "/request") {
    return <RequestService />;
  }

  if (window.location.pathname === "/admin/login") {
    return <AdminLogin />;
  }
if (window.location.pathname === "/admin/dashboard") {
  return <AdminDashboard />;
}
  const whatsappNumber = "254796967815";

  const whatsappMessage = encodeURIComponent(
    "Hello GreenHive Cyber & Gas, I would like to enquire about your services."
  );

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-extrabold tracking-tight">
              GREENHIVE
            </h1>
            <p className="text-xs font-semibold text-green-700">
              CYBER & GAS
            </p>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            <a href="#home" className="text-sm font-medium hover:text-green-700">
              Home
            </a>

            <a
              href="#cyber"
              className="text-sm font-medium hover:text-green-700"
            >
              Cyber Services
            </a>

            <a href="#gas" className="text-sm font-medium hover:text-green-700">
              Gas
            </a>
<a
  href="/request-status"
  className="font-semibold text-green-700 hover:text-green-800"
>
  Track Request
</a>
            <a
              href="#contact"
              className="text-sm font-medium hover:text-green-700"
            >
              Contact
            </a>
          </nav>

          <a
            href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-green-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-green-700"
          >
            WhatsApp Us
          </a>
          <a
  href="/admin/login"
  className="rounded-xl bg-slate-800 px-5 py-3 font-bold text-white transition hover:bg-slate-900"
>
  Admin Login
</a>
        </div>
      </header>

      {/* Hero */}
      <section id="home" className="bg-slate-50">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-800">
              <CheckCircle size={16} />
              Reliable services in Rongo
            </div>

            <h2 className="text-4xl font-black leading-tight tracking-tight md:text-6xl">
              Cyber Services.
              <br />
              <span className="text-green-600">Quality Gas.</span>
            </h2>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Welcome to GreenHive Cyber & Gas. We provide convenient cyber,
              online and document services together with reliable gas
              solutions for students, households and businesses.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="/request"
                className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3.5 font-bold text-white hover:bg-green-700"
              >
                Request a Service
                <ArrowRight size={18} />
              </a>
<a
  href="/request-status"
  className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-bold text-slate-700 transition hover:border-green-600 hover:text-green-700"
>
  Track Existing Request
</a>
              <a
                href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 font-bold hover:bg-slate-100"
              >
                <MessageCircle size={18} />
                Chat on WhatsApp
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-6 text-sm text-slate-600">
              <span className="flex items-center gap-2">
                <MapPin size={17} className="text-green-600" />
                Magenta Shops – Rongo University
              </span>

              <span className="flex items-center gap-2">
                <Clock size={17} className="text-green-600" />
                7:00 AM – 9:00 PM
              </span>
            </div>
          </div>

          <div className="rounded-3xl bg-green-700 p-8 text-white shadow-xl md:p-10">
            <p className="text-sm font-bold uppercase tracking-widest text-green-200">
              What we offer
            </p>

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-white/10 p-5">
                <Printer className="mb-3" />
                <h3 className="font-bold">Printing</h3>
                <p className="mt-1 text-sm text-green-100">
                  Fast and convenient document printing.
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-5">
                <FileText className="mb-3" />
                <h3 className="font-bold">HELB & HEF</h3>
                <p className="mt-1 text-sm text-green-100">
                  Assistance with online applications.
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-5">
                <Globe className="mb-3" />
                <h3 className="font-bold">Online Services</h3>
                <p className="mt-1 text-sm text-green-100">
                  KRA, eCitizen, NTSA and more.
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-5">
                <Flame className="mb-3" />
                <h3 className="font-bold">Gas</h3>
                <p className="mt-1 text-sm text-green-100">
                  Gas exchange, sets and delivery.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cyber Services */}
      <section id="cyber" className="mx-auto max-w-7xl px-6 py-20">
        <div className="max-w-2xl">
          <p className="font-bold uppercase tracking-widest text-green-600">
            Cyber Services
          </p>

          <h2 className="mt-3 text-3xl font-black md:text-4xl">
            Everything you need in one place
          </h2>

          <p className="mt-4 text-slate-600">
            Get assistance with everyday online, academic and document
            services without the hassle.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["HELB & HEF", "Application assistance and online services.", FileText],
            ["eCitizen", "Government online services and applications.", Globe],
            ["KRA & NTSA", "KRA, NTSA and related online services.", ShieldCheck],
            ["Printing", "Printing, photocopying, scanning and lamination.", Printer],
            ["Typing", "Document typing and formatting services.", FileText],
            ["CV Services", "Professional CV preparation and editing.", Smartphone],
            ["Online Applications", "Assistance with various online applications.", Globe],
            ["Other Cyber Services", "Ask us about the service you need.", MessageCircle],
          ].map(([title, description, Icon]) => {
            const ServiceIcon = Icon as typeof FileText;

            return (
              <div
                key={title as string}
                className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-5 inline-flex rounded-xl bg-green-100 p-3 text-green-700">
                  <ServiceIcon size={22} />
                </div>

                <h3 className="text-lg font-bold">{title as string}</h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {description as string}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Gas */}
      <section id="gas" className="bg-slate-900 text-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-2 md:items-center">
          <div>
            <p className="font-bold uppercase tracking-widest text-green-400">
              Gas Services
            </p>

            <h2 className="mt-3 text-3xl font-black md:text-5xl">
              Your reliable gas partner
            </h2>

            <p className="mt-5 max-w-xl leading-7 text-slate-300">
              Get gas cylinders, complete sets and essential cooking
              accessories. Delivery is also available around the campus area.
            </p>

            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                "Hello GreenHive Cyber & Gas, I would like to order gas."
              )}`}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-green-500 px-6 py-3.5 font-bold text-white hover:bg-green-600"
            >
              <MessageCircle size={18} />
              Order Gas on WhatsApp
            </a>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Gas Cylinder Exchange",
              "6kg & Other Sizes",
              "Gas Complete Sets",
              "Regulators",
              "Burners & Grills",
              "Cookers",
              "Gas Delivery",
              "Other Accessories",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-800 p-4"
              >
                <CheckCircle className="text-green-400" size={20} />
                <span className="font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="mx-auto max-w-7xl px-6 py-20">
        <div className="rounded-3xl bg-green-50 p-8 md:p-12">
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <p className="font-bold uppercase tracking-widest text-green-700">
                Contact GreenHive
              </p>

              <h2 className="mt-3 text-3xl font-black">
                Need a service? Talk to us.
              </h2>

              <p className="mt-4 text-slate-600">
                Contact us for cyber services, online assistance, printing or
                gas orders.
              </p>
            </div>

            <div className="space-y-4">
              <a
                href="tel:+254796967815"
                className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm"
              >
                <Phone className="text-green-600" />
                <div>
                  <p className="text-sm text-slate-500">Call us</p>
                  <p className="font-bold">0796 967 815</p>
                </div>
              </a>

              <a
                href="tel:+254738892946"
                className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm"
              >
                <Phone className="text-green-600" />
                <div>
                  <p className="text-sm text-slate-500">Call us</p>
                  <p className="font-bold">0738 892 946</p>
                </div>
              </a>

              <div className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm">
                <MapPin className="text-green-600" />
                <div>
                  <p className="text-sm text-slate-500">Location</p>
                  <p className="font-bold">Magenta Shops – Rongo University</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-bold text-slate-900">
              GREENHIVE CYBER & GAS
            </p>

            <p>Smart. Reliable. Affordable.</p>
          </div>

          <p>© 2026 GreenHive Cyber & Gas. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;