'use client'
import HelpText from "@/components/Help";
import Navbar from "@/components/Navbar";
import { TextArea } from "@/components/TextArea";
import { Button } from "@/components/ui/button";
import { useState } from "react";


export default function Home() {
  const [input, setInput] = useState('')

  return (
    <>
      <Navbar />
      <div className="container mx-auto my-4">
        <h1 className="text-4xl font-bold text-center text-cyan-600">
          Welcome to Source Mapper
        </h1>
        <p className="text-center text-gray-600">
          A tool to map source maps to source code. <br />Please Paste the code or put the url of the site you want to reverse engineer.
        </p>
        {/* possible  inputs notice .map file, web url, js code, */}
        <TextArea value={input} setValue={setInput} />
        <div className="flex justify-center">
          <Button className="text-white bg-cyan-600" variant="primary">
            Generate Source Code
          </Button>
        </div>
       <HelpText />
      </div>
    </>
  );
}
