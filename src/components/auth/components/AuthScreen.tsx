import { SignInFlow } from "@/components/types";
import SignInComponent from "./signInComponent";
import SignUpComponent from "./signUpComponent";
import { useState } from "react";

export default function AuthScreen() {
  const [state, setState] = useState<SignInFlow>("signIn");
      return (
          <div>
              {
                  state === "signIn" ? <SignInComponent setState={setState} /> : <SignUpComponent setState={setState} />
              }
          </div>
      )
}
