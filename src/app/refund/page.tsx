import { getPaymentMethods } from "./_utils/actions";
import RefundForm from "./_utils/refund.form";

const Page = async () => {
  const { data } = await getPaymentMethods();
  return <RefundForm methods={data || []} />;
};

export default Page;
