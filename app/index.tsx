import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import { useState } from "react";

const Page = () => {
  // const {isSignedInLotus, setIsSignedInLotus} = useReadio();
  const number = 1;
  const { isSignedIn } = useAuth();

  if (isSignedIn === true) {
    return <Redirect href="/(tabs)/home" />;
  } 

  return <Redirect href="/(tabs)/home" />;
  
};

export default Page;