import AuthForm from "@/ui/AuthForm";
import Image from "next/image";

export default function Home() {
  return (
    <div className="grid place-center md:grid-cols-6">
      <AuthForm className="h-full w-full mx-2 my-2 md:mx-0 md:col-start-3 md:col-span-2"></AuthForm>
    </div>
  );
}
