"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form } from "@/components/ui/form";
import InputX from "@/components/molecules/input.x";
import SubmitX from "@/components/molecules/submit.x";
import { toast } from "sonner";
import { createRefund } from "./actions";

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

const RefundForm = ({ methods }: { methods: any }) => {
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
    const result = await createRefund(data);

    toast(result?.message || "Refund not created!");
    form.reset();
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
            options={methods.map((method: any) => ({
              label: method.providerName,
              value: method.id,
            }))}
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
          <SubmitX text="Create Refund" pending={false} />
        </form>
      </Form>
    </div>
  );
};

export default RefundForm;
