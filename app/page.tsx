import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
       <p>home</p>
      <Link href={"/dashboard"} >dashboard</Link>
    </div>
  );
}
