import React from 'react'

export default function HelpText() {
    return (
        < div className="w-full max-w-md mt-8 mx-auto" >
            {/* possible  inputs notice .map file, web url, js code, */}
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Possible inputs for above</h2>
            <div className="space-y-4">
                <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
                    <div>
                        <p className="text-sm text-gray-900 dark:text-white mb-1">https://example.com</p>
                        <p className="text-xs text-gray-500">web url</p>
                    </div>
                </div>
                <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
                    <div>
                        <p className="text-sm text-gray-900 dark:text-white mb-1">https://example.com/bundle.js.map</p>
                        <p className="text-xs text-gray-500">.map file url </p>
                    </div>
                </div>

                <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
                    <div>
                        <p className="text-sm text-gray-900 dark:text-white mb-1">{JSON.stringify({
                            version: 3,
                            file: "bundle.js",
                            sources: '...',
                            names: [],
                            mappings: "...",
                            sourceRoot: "..."
                        })}</p>
                        <p className="text-xs text-gray-500">source map code</p>
                    </div>
                </div>
            </div>
        </div >
    )
}
