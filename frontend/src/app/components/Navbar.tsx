import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return <nav></nav>;
}

function SignIn() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google");
      }}
    >
      <Button type="submit">Signin with Google</Button>
    </form>
  );
}
