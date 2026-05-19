"use client";

import Image from "next/image";
import Link from "next/link";

const steps = [
  { label: "Carrito", icon: "/stepper/cart.svg", href: "/carrito" },
  { label: "Datos", icon: "/stepper/file.svg", href: "/checkout/datos" },
  { label: "Envio", icon: "/stepper/truck.svg", href: "/checkout/envio" },
  { label: "Pago", icon: "/stepper/card.svg", href: "/checkout/pago" },
];

export default function Stepper({ currentStep }: { currentStep: number }) {
  return (
    <div className="mx-auto mt-4 w-full max-w-4xl sm:mt-8 lg:mt-10">
      <div className="relative rounded-2xl bg-[#B6A999] px-3 py-5 sm:px-10 sm:py-10">
        <div className="absolute left-8 right-8 top-[2.75rem] h-[2px] bg-black sm:left-[3.25rem] sm:right-[3.25rem] sm:top-[4.1rem]" />

        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const active = stepNumber === currentStep;
            const clickable = stepNumber <= currentStep;

            const content = (
              <div
                className={[
                  "z-10 flex flex-col items-center gap-1 sm:gap-2",
                  clickable ? "cursor-pointer" : "cursor-not-allowed opacity-100",
                ].join(" ")}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full bg-white sm:h-12 sm:w-12 ${
                    active ? "border-3 border-[#5C5149]" : "border border-transparent"
                  }`}
                >
                  <Image
                    src={step.icon}
                    alt={step.label}
                    width={22}
                    height={22}
                    className="h-5 w-5 sm:h-[22px] sm:w-[22px]"
                  />
                </div>

                <span className="text-[11px] font-medium text-black sm:text-sm">{step.label}</span>
              </div>
            );

            return clickable ? (
              <Link key={step.label} href={step.href} className="z-10">
                {content}
              </Link>
            ) : (
              <div key={step.label} className="z-10">
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
