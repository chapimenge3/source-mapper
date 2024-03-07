'use client'
import HelpText from "@/components/Help";
import Navbar from "@/components/Navbar";
import { useToast } from "@/components/ui/use-toast"
import { TextArea } from "@/components/TextArea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react"
import { getAllSourceMaps, getWebPageContent } from "@/lib/actions";
import { useEffect, useState } from "react";
import JSZip from 'jszip';
import FileSaver from 'file-saver';
import TermOfService from "@/components/TermsOfService";


export default function Home() {
  const { toast } = useToast()
  const [userAgreement, setUserAgreement] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const parseFilesFromSourceMap = (sourceMaps) => {
    const files = []
    for (let i = 0; i < sourceMaps.length; i++) {
      let content;
      if (typeof sourceMaps[i] === 'string') {
        content = JSON.parse(sourceMaps[i])
      } else {
        content = sourceMaps[i]
      }
      const sources = content.sources
      const sourcesContent = content.sourcesContent

      for (let j = 0; j < sources.length; j++) {
        // ignores node_modules or webpack
        if (sources[j].includes('node_modules') || sources[j].includes('webpack')) continue

        // remove all ../ from the source
        var fileName = sources[j].replace(/\.\.\//g, '')
        files.push({ file: fileName, content: sourcesContent[j] })
      }
    }

    return files
  }

  async function generateFileFromSourceMap(urls) {
    const sourceCode = await Promise.all(urls.map(async (url) => {
      const content = JSON.parse(await getWebPageContent(url))
      return content
    }))

    // this will contains the source code and the file name
    // {file: 'File name', content: 'File content'}
    console.log('Source code', sourceCode)
    const files = parseFilesFromSourceMap(sourceCode)

    // log all file names
    console.log(`Got ${Object.keys(files).length} files`)

    return files
  }

  const isMappingFile = (content) => {
    try {
      JSON.parse(content)
      return true
    }
    catch (e) {
      console.error('Error parsing content', e)
      return false
    }
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
    var files = []
    try {
      if (!isMappingFile(input)) {
        const allSourceMaps = await getAllSourceMaps(input)
        toast({
          title: "Source Code",
          description: `Found ${allSourceMaps.length} source maps`,
        })
        console.log('All source maps', allSourceMaps)
        files = await generateFileFromSourceMap(allSourceMaps)
        toast({
          title: "Source Code",
          description: `Generated ${Object.keys(files).length} files`,
        })
      } else if (isMappingFile(input)) {
        files = parseFilesFromSourceMap([input])
        toast({
          title: "Source Code",
          description: `Generated ${Object.keys(files).length} files`,
        })
      }
    } catch (e) {
      console.error('Error generating source code', e)
      toast({
        title: "Error",
        description: "Error generating source code",
        variant: "destructive"
      })
      setLoading(false)
      return
    }

    // Generate a zip file that contains all the source code and file name
    const zip = new JSZip();
    // Object.keys(files).forEach((fileName) => {
    //   zip.file(fileName, files[fileName]);
    // });
    files.forEach((file) => {
      zip.file(file.file, file.content)
    })

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

  console.log('userAgreement', userAgreement, userAgreement === false)

  useEffect(() => {
    // get user agreement from local storage
    const userAgreement = localStorage.getItem('userAgreement')
    if (userAgreement === 'true') {
      setUserAgreement(true)
    }
  }, [])


  return (
    <>
      {
        userAgreement === false ? (<TermOfService userAgreement={userAgreement} setUserAgreement={setUserAgreement} />) : null
      }
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
      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800">
        <div className="container mx-auto py-8">
          <p className="text-center text-gray-500 dark:text-gray-300">
            &copy; {new Date().getFullYear()} Source Mapper. All rights reserved. Made with ❤️ by <a href="https://chapimenge.com" target="_blank" className="text-cyan-600">Chapi Menge</a>
          </p>
        </div>
      </footer>
    </>
  );
}
