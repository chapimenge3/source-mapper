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

  const parseFilesFromSourceMap = (sourceMaps) => {
    const files = []
    // sourceMaps.forEach((sourceMap) => {
    //   const content = JSON.parse(sourceMap)
    //   const sources = content.sources
    //   const sourcesContent = content.sourcesContent

    //   sources.forEach((source, index) => {
    //     // ignores node_modules or webpack
    //     if (source.includes('node_modules') || source.includes('webpack')) return

    //     // remove all ../ from the source
    //     var fileName = source.replace(/\.\.\//g, '')
    //     files.push({ file: fileName, content: sourcesContent[index] })
    //   })
    // })
    for (let i = 0; i < sourceMaps.length; i++) {
      const content = JSON.parse(sourceMaps[i])
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
    const files = parseFilesFromSourceMap(sourceCode)

    // sourceCode.forEach((content, index) => {
    //   // check if the content is a source map
    //   if (!content.sources) return

    //   // content is mapping file which contains
    //   // sources -> array of source files
    //   // sourcesContent -> array of source files content
    //   const sources = content.sources
    //   const sourcesContent = content.sourcesContent

    //   sources.forEach((source, index) => {
    //     // ignores node_modules or webpac
    //     if (source.includes('node_modules') || source.includes('webpack')) return

    //     // remove all ../ from the source
    //     var fileName = source.replace(/\.\.\//g, '')
    //     // files[fileName] = sourcesContent[index]
    //     files.push({ file: fileName, content: sourcesContent[index] })
    //   })
    // })


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
      console.log('isMappingFile', isMappingFile(input))
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
