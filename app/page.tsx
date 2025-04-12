import { Metadata } from "next";
import dynamic from "next/dynamic";

// Import the client component dynamically to keep this page a server component
const PassportApplicationForm = dynamic(() => import('../components/PassportApplicationForm'), {
  ssr: false, // Disable SSR for this component
  loading: () => (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  ),
});

export const metadata: Metadata = {
  title: "Passport Application Form | Step-by-Step Guide",
  description: "Complete your passport application with our easy-to-use online form. Follow our step-by-step process to submit all required information securely.",
};

export default function Home() {
  return (
    <div className="py-8">
      <h1 className="sr-only">Passport Application Form</h1>
      {/* Load the client-side form component */}
      <PassportApplicationForm />
    </div>
  );
}
