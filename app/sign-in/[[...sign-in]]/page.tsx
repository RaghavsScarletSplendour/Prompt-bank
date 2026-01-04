"use client";

import { SignIn } from "@clerk/nextjs";
import ParticlesBackground from "@/components/ParticlesBackground";

export default function SignInPage() {
  return (
    <>
      <ParticlesBackground particleCount={25} />
      <div className="min-h-screen flex items-center justify-center">
        <SignIn
          forceRedirectUrl="/dashboard"
          appearance={{
            variables: {
              colorPrimary: "#0891b2",
              colorBackground: "#0d1117",
              colorInputBackground: "#1f2937",
              colorInputText: "#f3f4f6",
              colorText: "#f3f4f6",
              colorTextSecondary: "#9ca3af",
              borderRadius: "0.75rem",
              colorDanger: "#dc2626",
            },
            elements: {
              card: "bg-[#0d1117] border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.4)]",
              formButtonPrimary:
                "bg-cyan-600 hover:bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)]",
              formFieldInput: "bg-gray-800/50 border border-white/10 text-white focus:border-cyan-500/50",
              formFieldLabel: "text-gray-300 font-medium",
              footerActionText: "text-gray-400",
              footerActionLink: "text-cyan-500 hover:text-cyan-400",
              headerTitle: "text-gray-100",
              headerSubtitle: "text-gray-400",
              socialButtons: "",
              socialButtonsBlockButton:
                "bg-gray-800/50 border border-white/10 hover:bg-gray-700/50 transition-colors relative",
              socialButtonsBlockButtonText: "!text-gray-100 font-medium",
              socialButtonsIconButton:
                "bg-gray-800/50 hover:bg-gray-700/50 transition-colors",
              socialButtonsProviderIcon__github: "brightness-0 invert",
              socialButtonsProviderIcon__notion: "brightness-100",
              socialButtonsBadge: "absolute -top-2 -right-2 bg-cyan-600 text-white text-[9px] font-bold uppercase px-1.5 py-0.5 rounded shadow-lg z-10 border border-cyan-400",
              dividerLine: "bg-gray-700",
              dividerText: "text-gray-500",
            },
          }}
        />
      </div>
    </>
  );
}
