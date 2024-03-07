'use client'
import HelpText from "@/components/Help";
import Navbar from "@/components/Navbar";
import { useToast } from "@/components/ui/use-toast"
import { TextArea } from "@/components/TextArea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react"
import { getAllSourceMaps, getWebPageContent } from "@/lib/actions";
import { useState } from "react";
import JSZip from 'jszip';
import FileSaver from 'file-saver';


export default function Home() {
  const { toast } = useToast()
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  async function generateFileFromSourceMap(urls) {
    const sourceCode = await Promise.all(urls.map(async (url) => {
      const content = JSON.parse(await getWebPageContent(url))
      return content
    }))

    // this will contains the source code and the file name
    // {file: 'File name', content: 'File content'}
    const files = {}

    sourceCode.forEach((content, index) => {
      // check if the content is a source map
      if (!content.sources) return

      // content is mapping file which contains
      // sources -> array of source files
      // sourcesContent -> array of source files content
      const sources = content.sources
      const sourcesContent = content.sourcesContent

      sources.forEach((source, index) => {
        // ignores node_modules or webpac
        if (source.includes('node_modules') || source.includes('webpack')) return

        // remove all ../ from the source
        var fileName = source.replace(/\.\.\//g, '')
        files[fileName] = sourcesContent[index]
      })
    })

    // log all file names
    console.log(`Got ${Object.keys(files).length} files`)

    return files
  }

  const handleGenerateSourceCode = async () => {
    if (!input) {
      toast({
        title: "No input",
        description: "Please provide an input",
        status: "error",
      })

      return
    }
    setLoading(true)
    console.log('Generating source code')
    const allSourceMaps = await getAllSourceMaps(input)
    toast({
      title: "Source Code",
      description: `Found ${allSourceMaps.length} source maps`,
    })
    console.log('All source maps', allSourceMaps)
    const files = await generateFileFromSourceMap(allSourceMaps)
    toast({
      title: "Source Code",
      description: `Generated ${Object.keys(files).length} files`,
    })

    // Generate a zip file that contains all the source code and file name
    const zip = new JSZip();
    Object.keys(files).forEach((fileName) => {
      zip.file(fileName, files[fileName]);
    });

    zip.generateAsync({ type: "blob" })
      .then(function (content) {
        toast({
          title: "Source Code",
          description: `Downloaded ${Object.keys(files).length} files`,
        })
        FileSaver.saveAs(content, "source-code.zip");
        var fileSize = content.size / 1000
        var humanReadableSize = fileSize > 1000 ? `${fileSize / 1000} MB` : `${fileSize} KB`
        toast({
          title: "Source Code Downloaded",
          description: `Downloaded ${Object.keys(files).length} files and file size is ${humanReadableSize}`,
        })
      });

    setLoading(false)
  }

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
          {!loading ?
            (<Button className="text-white bg-cyan-600" variant="primary" onClick={handleGenerateSourceCode}>
              Generate Source Code
            </Button>) : (<Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>)}
        </div>
        <HelpText />
      </div>
    </>
  );
}
