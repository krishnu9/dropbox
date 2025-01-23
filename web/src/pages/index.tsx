import Head from "next/head";
import Link from "next/link";
import FileDashboard from "~/pages/(components)/FileDashboard/FileDashboard";
import Header from "~/pages/(components)/Header";
import Layout from "~/pages/(components)/Layout";
import SideBar from "~/pages/(components)/Sidebar";

export default function Home() {
  return (
    <>
      <FileDashboard />
    </>
  );
}
// function IntroText() {
//   return <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
//     My<span className="text-[hsl(280,100%,70%)]">Box</span>
//   </h1>;
// }

