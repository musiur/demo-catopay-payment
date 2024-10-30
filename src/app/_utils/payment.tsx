/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form } from "@/components/ui/form";
import InputX from "@/components/molecules/input.x";
import { useEffect, useState } from "react";
import {
  A__GET__PaymentMethods,
  A__POST__CreatePaymentRequest,
} from "./action";
import SubmitX from "@/components/molecules/submit.x";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { toast } from "sonner";

const FormSchema = z.object({
  amount: z.number().min(1),
  paymentMethodId: z.string().min(1),
});

export default function Payment() {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [pending, setPending] = useState(true);
  const [message, setMessage] = useState("");
  const params = useSearchParams();

  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const apiKeyOnLS = localStorage.getItem("api-modal-state") || "";
      apiKeyOnLS?.length && setApiKey(apiKeyOnLS || "");
    }
  }, []);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      amount: 10,
      paymentMethodId: "",
    },
  });

  const FetchMethodList = async () => {
    const result = await A__GET__PaymentMethods(apiKey);

    if (result?.data?.length) {
      const methods = result.data.map((item: any) => {
        return {
          value: item?.id,
          label: item?.providerName,
          subLabel: item?.providerType,
          image: item?.icon,
        };
      });
      setPaymentMethods(methods);
    } else {
      toast.error(result?.message || "Failed to fetch payment methods");
    }
  };

  useEffect(() => {
    !paymentMethods?.length && apiKey?.length
      ? FetchMethodList()
      : setPending(false);
  }, [paymentMethods, apiKey]);
  useEffect(() => {
    if (params.has("paymentId")) {
      setMessage("Payment Successful!");
    }
  }, []);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setMessage("Please wait. Payment request is being created...");
    setPending(true);
    const payload = {
      ...data,
      description: "Payment for services from DEMO App (NextJS/ReactJS)",
      redirect_url: "http://demo-catopay-payment.vercel.app",
      // redirect_url: "http://localhost:3000",
      callback_url: "https://2aa1-103-10-195-26.ngrok-free.app/webhook", // our API endpoint
      note: "number=09123456789,name=john_doe,id=1234567890",
      /**
       *
       * @param
       * ?transactionId=asdfasdfa&status=success
       *
       */
    };
    const result = await A__POST__CreatePaymentRequest(payload, apiKey);
    /**
     *
     * We have now a newly created payment request in the result;
     * There is id in result.data.id (Payment Request ID);
     * lets visit Catopay payment site with request ID
     */
    
    if (typeof window !== "undefined" && result?.data?.payment_url) {
      window.location.href = `${result.data.payment_url}&numbers=+8801234567890,+8801234567891,+8801234567892`;
      setMessage(
        "We have successfully created a newly payment request. Let's complete the payment using CATOPAY. We are redirecting. Please wait..."
      );
    } else {
      const errorMessage = result?.message || "Failed to create payment request";
      setMessage(errorMessage);
      toast.error(errorMessage);
    }

    setPending(false);
  }

  return (
    <div className="min-h-[100dvh] bg-gradient-to-tr from-blue-400 to-indigo-800 py-12 px-4">
      {message ? (
        <div className="min-w-[280px] max-w-[420px] mx-auto my-4 bg-white px-4 py-2 text-center rounded-lg">
          {message}
        </div>
      ) : null}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="min-w-[280px] max-w-[420px] bg-white space-y-6 p-6 md:p-12 mx-auto rounded-[20px] md:rounded-[40px]"
        >
          {pending ? (
            <div className="grid grid-cols-1 gap-4 [&>*]:rounded-lg">
              <div className="min-h-8 w-full bg-gray-600 animate-pulse"></div>
              <div className="min-h-8 w-full bg-gray-600 animate-pulse"></div>
              <div className="min-h-8 w-full bg-gray-600 animate-pulse"></div>
              <div className="min-h-8 w-full bg-gray-600 animate-pulse"></div>
              <div className="min-h-8 w-full bg-gray-600 animate-pulse"></div>
              <div className="min-h-8 w-full bg-gray-600 animate-pulse"></div>
            </div>
          ) : (
            <>
              <h1 className="text-xl font-semibold text-center">
                Creating Payment with CATOPAY (DEMO)
              </h1>
              <InputX
                form={form}
                name="amount"
                label="Enter amount"
                type="number"
              />
              <InputX
                form={form}
                name="paymentMethodId"
                label="Select Payment Method"
                type="select"
                options={paymentMethods || []}
              />
              <SubmitX
                pending={form.formState.isSubmitting}
                className="w-full"
              />
              <div className="mt-4">
                <Link href="/refund" className="w-full">
                  <Button variant="outline" className="w-full gap-2">
                  <ArrowUpRight className="w-4 h-4" /> Create Refund 
                  </Button>
                </Link>
              </div>
            </>
          )}
        </form>
      </Form>
    </div>
  );
}
