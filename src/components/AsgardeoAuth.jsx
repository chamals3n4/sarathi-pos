import React, { useEffect } from "react";
import { useAuthContext } from "@asgardeo/auth-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

export default function AsgardeoAuth() {
  const { signIn, state } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (state?.isAuthenticated) {
      navigate(`/`);
    }
  }, [state?.isAuthenticated, navigate]);
  return (
    <section className="text-center flex flex-col pt-[200px] justify-center items-center h-96">
      <Button onClick={() => signIn()}>Login with Asgardeo</Button>
    </section>
  );
}
