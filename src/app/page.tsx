import { Suspense } from "react";
import Payment from "./_utils/payment";

const Home = () => {
  return (
    <Suspense fallback={<>Please wait...</>}>
      <Payment />
    </Suspense>
  );
};

export default Home;
