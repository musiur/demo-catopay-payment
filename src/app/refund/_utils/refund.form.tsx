"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form } from "@/components/ui/form";
import InputX from "@/components/molecules/input.x";
import SubmitX from "@/components/molecules/submit.x";
import { toast } from "sonner";
import { createRefund } from "./actions";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { A__GET__PaymentMethods } from "@/app/_utils/action";

const FormSchema = z.object({
  amount: z.number().min(1, { message: "Amount is required" }),
  paymentMethodId: z.string().min(1),
  referenceTxnId: z.string().min(1),
  refundReason: z.string().min(1),
  accountType: z.enum([
    "PERSONAL_ACCOUNT",
    "BUSINESS_ACCOUNT",
    "AGENT_ACCOUNT",
    "MERCHANT_ACCOUNT",
  ]),
  bankNumberOrAddress: z.string().min(1),
});

const RefundForm = () => {
  const [apiKey, setApiKey] = useState("");
  const [paymentMethods, setPaymentMethods] = useState([]);

  const getData = async (apiKey: string) => {
    const result = await A__GET__PaymentMethods(apiKey);
    
    if (result?.success) {
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
      toast.error(result?.message);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const apiKeyOnLS = localStorage.getItem("api-modal-state");
      if (apiKeyOnLS?.length) {
        setApiKey(apiKeyOnLS || "");
        apiKeyOnLS?.length && getData(apiKeyOnLS);
      }
    }
  }, []);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      amount: 0,
      paymentMethodId: "",
      referenceTxnId: "",
      refundReason: "",
      accountType: "PERSONAL_ACCOUNT",
      bankNumberOrAddress: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const result = await createRefund(data, apiKey);

    if (result?.success) {
      toast.success(result?.message);
      form.reset();
      setTimeout(() => {
        window.location.reload()
      }, 4000);
    } else {
      toast.error(result?.message);
    }
  }

  return (
    <div className="flex justify-center items-center w-full h-screen bg-primary">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="max-w-[450px] w-full space-y-6 bg-white p-4 md:p-8 rounded-2xl"
        >
          <InputX
            name="amount"
            label="Amount"
            type="number"
            placeholder="e.g. 10"
            form={form}
          />
          <InputX
            name="paymentMethodId"
            label="Payment Method"
            form={form}
            type="select"
            options={paymentMethods || []}
          />
          <InputX
            name="referenceTxnId"
            label="Reference Transaction ID"
            form={form}
          />
          <InputX name="refundReason" label="Refund Reason" form={form} />
          <InputX
            name="accountType"
            label="Account Type"
            type="select"
            form={form}
            options={[
              { label: "Personal Account", value: "PERSONAL_ACCOUNT" },
              { label: "Business Account", value: "BUSINESS_ACCOUNT" },
              { label: "Agent Account", value: "AGENT_ACCOUNT" },
              { label: "Merchant Account", value: "MERCHANT_ACCOUNT" },
            ]}
          />
          <InputX
            name="bankNumberOrAddress"
            label="Bank Number or Address"
            form={form}
          />
          <SubmitX
            text="Create Refund"
            pending={form.formState.isSubmitting}
            disabled={form.formState.isSubmitting}
            className="w-full"
          />
          <Link
            href="/"
            className="pt-10 flex items-center justify-start gap-3"
          >
            <ArrowUpRight className="w-4 h-4" /> Back to Create Payment Request
          </Link>
        </form>
      </Form>
    </div>
  );
};

export default RefundForm;
