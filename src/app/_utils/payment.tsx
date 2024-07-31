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

const FormSchema = z.object({
  amount: z.number().min(1),
  paymentMethodId: z.string().min(1),
});

export default function Payment() {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [pending, setPending] = useState(true);
  const [message, setMessage] = useState("");
  const params = useSearchParams();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      amount: 10,
      paymentMethodId: "",
    },
  });

  const FetchMethodList = async () => {
    const result = await A__GET__PaymentMethods();

    if (result?.data?.length) {
      const methods = result.data.map((item: any) => {
        return {
          value: item?.id,
          label: item?.numberOrAddress,
          subLabel: item?.paymentMethod?.providerName,
          image: item?.paymentMethod?.icon,
        };
      });
      setPaymentMethods(methods);
    }
  };

  useEffect(() => {
    !paymentMethods?.length ? FetchMethodList() : setPending(false);
  }, [paymentMethods]);
  useEffect(() => {
    if (params.has("paymentId")) {
      setMessage("Payment Successful!");
    }
  }, []);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    // console.log(data);
    setMessage("Please wait. Payment request is being created...");
    setPending(true);
    const payload = {
      ...data,
      description: "Payment for services from DEMO App (NextJS/ReactJS)",
      redirect_url: "http://demo-catopay-payment.vercel.app",
      callback_url: "__my_callback_url__", // our API endpoint
    };
    const result = await A__POST__CreatePaymentRequest(payload);
    console.log(result);
    /**
     *
     * We have now a newly created payment request in the result;
     * There is id in result.data.id (Payment Request ID);
     * lets visit Catopay payment site with request ID
     */
    if (typeof window !== "undefined" && result?.data?.id) {
      window.location.href = `https://pay.catopay.com/payment?requestId=${result.data.id}`;
      setMessage(
        "We have successfully created a newly payment request. Let's complete the payment using CATOPAY. We are redirecting. Please wait..."
      );
    }
  }

  return (
    <div className="min-h-[100dvh] bg-gradient-to-tr from-blue-600 to-indigo-800 py-12 px-4">
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
            </>
          )}
        </form>
      </Form>
    </div>
  );
}
