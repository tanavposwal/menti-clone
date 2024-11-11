import { auth, signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Menti Clone",
  description: "menti clone build with SocketIO/NextJS",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

    const session = await auth();

    // if (session) {
      return children;
// }
//     else {
//         return (
//             <div className="w-full h-screen flex flex-col items-center justify-center gap-2">
//                 <h1 className="text-6xl font-black">M3nti</h1>
//                 <h1 className="text-3xl font-black">Login to make quizes</h1>
//                 <p>click below to login</p>
//                 <SignIn />
//             </div>
//         )
//     }
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
  