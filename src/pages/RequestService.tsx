import { useState } from "react";
import type { FormEvent } from "react";
import { ArrowLeft, CheckCircle, Send } from "lucide-react";
function RequestService() {
  const [submitted, setSubmitted] = useState(false);
const [requestId, setRequestId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const requestData = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      service: formData.get("service"),
      message: formData.get("message"),
    };

    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit request");
      }

      setRequestId(data.id);
setSubmitted(true);
form.reset();
    } catch (err) {
      console.error(err);
      setError(
        "We could not submit your request. Please try again or contact us directly."
      );
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-xl rounded-3xl bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
            <CheckCircle size={34} />
          </div>

          <h1 className="mt-6 text-3xl font-black">
            Request Received
          </h1>
<p className="mt-4 leading-7 text-slate-600">
  Thank you for contacting GreenHive Cyber & Gas.
  We have received your request and will contact you shortly.
</p>

{requestId && (
  <div className="mt-6 rounded-xl bg-green-50 p-4">
    <p className="text-sm font-semibold text-green-700">
      Your Request Reference
    </p>

    <p className="mt-1 text-2xl font-black text-green-800">
      GH-{String(requestId).padStart(4, "0")}
    </p>

    <p className="mt-1 text-xs text-green-700">
      Keep this reference when contacting GreenHive about your request.
    </p>
  </div>
)}
          
          <a
            href="/"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-bold text-white hover:bg-green-700"
          >
            <ArrowLeft size={18} />
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-2xl">

        <a
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-green-700"
        >
          <ArrowLeft size={17} />
          Back to GreenHive
        </a>

        <div className="rounded-3xl bg-white p-8 shadow-sm md:p-10">

          <p className="font-bold uppercase tracking-widest text-green-600">
            GreenHive Cyber & Gas
          </p>

          <h1 className="mt-3 text-3xl font-black md:text-4xl">
            Request a Service
          </h1>

          <p className="mt-4 leading-7 text-slate-600">
            Tell us what you need and we will get back to you.
          </p>

          {error && (
            <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">

            <div>
              <label className="mb-2 block text-sm font-bold">
                Your Name
              </label>

              <input
                type="text"
                name="name"
                required
                placeholder="Enter your name"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-green-600"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold">
                Phone Number
              </label>

              <input
                type="tel"
                name="phone"
                required
                placeholder="07XXXXXXXX"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-green-600"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold">
                Service Required
              </label>

              <select
                name="service"
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-green-600"
              >
                <option value="">Select a service</option>

                <optgroup label="Cyber Services">
                  <option value="HELB / HEF Assistance">
                    HELB / HEF Assistance
                  </option>

                  <option value="eCitizen Services">
                    eCitizen Services
                  </option>

                  <option value="KRA Services">
                    KRA Services
                  </option>

                  <option value="NTSA Services">
                    NTSA Services
                  </option>

                  <option value="Printing">
                    Printing
                  </option>

                  <option value="Photocopying">
                    Photocopying
                  </option>

                  <option value="Scanning">
                    Scanning
                  </option>
  <option value="Report writing">Report writing</option>
                  <option value="Lamination">
                    Lamination
                  </option>

                  <option value="Typing">
                    Typing
                  </option>

                  <option value="CV Services">
                    CV Services
                  </option>

                  <option value="Other Cyber Service">
                    Other Cyber Service
                  </option>
                </optgroup>

                <optgroup label="Gas Services">
                  <option value="Gas Cylinder Exchange">
                    Gas Cylinder Exchange
                  </option>

                  <option value="Gas Complete Set">
                    Gas Complete Set
                  </option>

                  <option value="Gas Delivery">
                    Gas Delivery
                  </option>

                  <option value="Regulator">
                    Regulator
                  </option>

                  <option value="Burner / Grill">
                    Burner / Grill
                  </option>

                  <option value="Cooker">
                    Cooker
                  </option>

                  <option value="Other Gas Service">
                    Other Gas Service
                  </option>
                </optgroup>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold">
                Message
              </label>

              <textarea
                name="message"
                rows={5}
                placeholder="Tell us what you need..."
                className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-green-600"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-4 font-bold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Send size={18} />

              {loading ? "Sending..." : "Submit Request"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default RequestService;
