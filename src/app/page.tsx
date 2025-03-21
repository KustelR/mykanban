import AuthForm from "@/components/ui/AuthForm";
import ProjectList from "@/components/ProjectList";
import Image from "next/image";
import TextButton from "@/shared/TextButton";
import Link from "next/link";

export default function Home() {
  return (
    <div className="p-4 space-y-2">
      <ProjectList></ProjectList>
      <TextButton className="">
        <Link href="/project">Create new</Link>
      </TextButton>
    </div>
  );
}
