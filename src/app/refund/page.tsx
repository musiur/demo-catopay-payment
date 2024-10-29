"use client"

import { useEffect } from "react";
import { useState } from "react";
import RefundForm from "./_utils/refund.form";
import { A__GET__PaymentMethods } from "../_utils/action";
import { toast } from "sonner";



const Page = () => {
  const [data, setData] = useState([]);

  const getData = async (apiKey: string) => {
    const result = await A__GET__PaymentMethods(apiKey);
    console.log(result)
    if (result?.success) {
      const methods = result.data.map((item: any) => {
        return {
          value: item?.id,
          label: item?.providerName,
          subLabel: item?.providerType,
          image: item?.icon,
        };
      });
      setData(methods);
    } else {
      toast.error(result?.message);
    }
  };
  useEffect(() => {
    if (typeof window !== "undefined") {
      const apiKey = localStorage.getItem("api-modal-state") || "";
      apiKey?.length && getData(apiKey);
    }
  }, []);
  return <RefundForm methods={data || []} />;
};

export default Page;
