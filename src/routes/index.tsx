import { createFileRoute } from '@tanstack/react-router'
import { useTheme } from '@/components/theme-provider'
import { useState, useRef, useCallback, useEffect } from 'react'
import { Upload, Download, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Toaster } from '@/components/ui/sonner'
import { toast } from "sonner"
import { convert } from '@/lib/converter'
import JSZip from "jszip";
import { LoadingOverlay } from '@/components/HelperUI'

export const Route = createFileRoute('/')({
  component: App,
})

type UploadedFile = {
  id: string
  name: string
  size: number
  url: string
  type: string
  outputFormat: string
  sourceType: string
  fileBuffer: ArrayBuffer
}

type ConvertedFile = {
  id: string
  name: string
  originalSize: number
  convertedSize: number
  url: string
  savedPercentage: number
  outputFormat: string
}

function App() {
  const { theme } = useTheme();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [convertedFiles, setConvertedFiles] = useState<ConvertedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [globalOutputFormat, setGlobalOutputFormat] = useState("webp")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [downloadAllLoading, setDownloadAllLoading] = useState(false);
  const [convertLoading, setConvertLoading] = useState(false);

  useEffect(() => {
    return () => {
      convertedFiles.forEach(file => URL.revokeObjectURL(file.url));
    };
  }, [convertedFiles]);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const droppedFiles = Array.from(e.dataTransfer.files)
    if (droppedFiles.length === 0) return

    processUploadedFiles(droppedFiles)
  }, [])

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return

    const selectedFiles = Array.from(e.target.files)
    processUploadedFiles(selectedFiles)

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }, [])

  const processUploadedFiles = useCallback(
    (newFiles: File[]) => {
      // Filter for image files
      const imageFiles = newFiles.filter((file) => file.type.startsWith("image/") && supportedFormat.some(format => file.type.endsWith(format)))
      if (imageFiles.length === 0) {
        toast.error("Please upload valid image files.", {
          description: "Only image files with supported formats are allowed.",
        });
        return;
      }

      imageFiles.map((file) =>{
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);

        reader.onload = () => {
          setUploadedFiles((prev) => [...prev, {
            id: crypto.randomUUID(),
            name: file.name,
            size: file.size,
            url: URL.createObjectURL(file),
            type: file.type,
            sourceType: file.type.replace('image/', ''),
            outputFormat: globalOutputFormat,
            fileBuffer: reader.result as ArrayBuffer,
          }])
        }
      })
    },
    [globalOutputFormat],
  )

  const handleRemoveUploadedFile = useCallback((id: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== id))
  }, [])

  const handleRemoveConvertedFile = useCallback((id: string) => {
    const fileToRemove = convertedFiles.find((file) => file.id === id);
    if (fileToRemove) {
      URL.revokeObjectURL(fileToRemove.url);
    }
    setConvertedFiles((prev) => prev.filter((file) => file.id !== id));
  }, [convertedFiles]);

  const handleOutputFormatChange = useCallback((id: string, format: string) => {
    setUploadedFiles((prev) => prev.map((file) => (file.id === id ? { ...file, outputFormat: format } : file)))
  }, [])

  const handleGlobalOutputFormatChange = useCallback((format: string) => {
    setGlobalOutputFormat(format)
    // Apply to all uploaded files that haven't been converted yet
    setUploadedFiles((prev) => prev.map((file) => ({ ...file, outputFormat: format })))
  }, [])

  const handleConvertFiles = useCallback(async () => {
    if (uploadedFiles.length === 0) return

    setConvertLoading(true)
    const newConvertedFiles = await Promise.all(
      uploadedFiles.map(async (file) => {
        try {
          const convertedBuffer = await convert(file.sourceType, file.outputFormat, file.fileBuffer);
          const blob = new Blob([convertedBuffer], { type: file.outputFormat });
          const url = URL.createObjectURL(blob);
          const reduction = (file.size - blob.size) / file.size;
          const convertedSize = Math.floor(file.size * (1 - reduction));
          const fileNameParts = file.name.split(".");
          fileNameParts.pop(); // Remove extension
          const newFileName = `${fileNameParts.join(".")}.${file.outputFormat}`;

          return {
            id: file.id,
            name: newFileName,
            originalSize: file.size,
            convertedSize,
            url: url,
            savedPercentage: Math.floor(reduction * 100),
            outputFormat: file.outputFormat,
          };
        } catch (error) {
          console.error("Error converting file:", error);
          return null;
        }
      })
    );

    setConvertedFiles((prev) => [...prev, ...newConvertedFiles.filter((file) => file !== null)]);
    setUploadedFiles([])
    setConvertLoading(false)
    toast.success("Files converted successfully!", {
      description: "You can now download the converted files.",
    });
  }, [uploadedFiles])

  const downloadFile = (url: string, fileName: string) => {
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();
  };

  const downloadAllFilesAsZip = async (files: ConvertedFile[]) => {
    const zip = new JSZip();
    setDownloadAllLoading(true);
    // Add each file to the ZIP
    for (const file of files) {
      const response = await fetch(file.url); // Fetch the file from the URL
      const blob = await response.blob(); // Convert the response to a Blob
      zip.file(file.name, blob); // Add the file to the ZIP
    }

    // Generate the ZIP file
    const zipBlob = await zip.generateAsync({ type: "blob" });

    // Create a download link for the ZIP file
    const zipUrl = URL.createObjectURL(zipBlob);
    const anchor = document.createElement("a");
    anchor.href = zipUrl;
    anchor.download = "converted-images.zip";
    anchor.click();

    // Clean up the object URL
    URL.revokeObjectURL(zipUrl);
    setDownloadAllLoading(false);
    toast.success("ZIP file downloaded successfully!", {
      description: "All converted files are packed into a ZIP file.",
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB"
    return (bytes / (1024 * 1024)).toFixed(2) + " MB"
  }

  const totalSaved = convertedFiles.reduce((acc, file) => acc + (file.originalSize - file.convertedSize), 0)

  const supportedFormat = ["webp", "jpeg", "png", "avif"]

  return (
    <>
      <main className="flex-1 container mx-auto px-4 py-12 pb-24 flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-2">Convert Images Effortlessly!</h1>
        <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"} mb-10`}>
          Convert images to any format instantly and easily!
        </p>

        {/* Upload Area */}
        <div
          className={`w-full max-w-3xl ${theme === "dark" ? "bg-[#1a2234]" : "bg-card"} rounded-lg p-4 mb-6`}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div
            className={`border-2 border-dashed ${
              isDragging ? "border-blue-500 bg-opacity-50" : theme === "dark" ? "border-gray-600" : "border-gray-300"
            }
            rounded-lg p-12 flex flex-col items-center justify-center cursor-pointer transition-colors`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-12 h-12 text-blue-500 mb-4" />
            <h3 className="text-xl font-medium mb-1">Drop your images here</h3>
            <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-500"} mb-4`}>or click to browse</p>

            <div className="flex flex-wrap gap-2 justify-center">
              {supportedFormat.map((format) => (
                <span
                  key={format}
                  className={`px-3 py-1 text-sm rounded ${
                    theme === "dark" ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {format.toUpperCase()}
                </span>
              ))}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFileInputChange}
            />
          </div>
        </div>

        {/* Uploaded Files Section */}
        {uploadedFiles.length > 0 && (
          <div
            className={`relative w-full max-w-3xl ${theme === "dark" ? "bg-[#1a2234]" : "bg-card"} rounded-lg p-6 ${theme === "dark" ? "" : "border border-border"} mb-6`}
          >
            {convertLoading && <LoadingOverlay />}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <h2 className="text-xl font-semibold">Files to Convert</h2>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className={`${theme === "dark" ? "text-gray-400" : "text-gray-500"} text-sm whitespace-nowrap`}>
                    Output format:
                  </span>
                  <Select value={globalOutputFormat} onValueChange={handleGlobalOutputFormatChange}>
                    <SelectTrigger
                      className={`w-full sm:w-24 ${theme === "dark" ? "bg-gray-800 border-gray-700" : ""}`}
                    >
                      <SelectValue placeholder="Format" />
                    </SelectTrigger>
                    <SelectContent className={theme === "dark" ? "bg-gray-800 border-gray-700" : ""}>
                      {supportedFormat.map((format) => (
                        <SelectItem
                          key={format}
                          value={format}
                          className={theme === "dark" ? "text-gray-200 focus:bg-gray-700" : ""}
                        >
                          {format.toUpperCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={handleConvertFiles}
                  className={`w-full sm:w-auto ${
                    theme === "dark"
                      ? "bg-gray-800 hover:bg-gray-700 text-white border border-gray-700"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                  }`}
                >
                  Convert All
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  className={`flex items-center justify-between p-3 border rounded-lg ${
                    theme === "dark" ? "border-gray-700" : "border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"} rounded flex items-center justify-center`}
                    >
                      <img
                        src={file.url || "/placeholder.svg"}
                        width={40}
                        height={40}
                        alt={file.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select
                      value={file.outputFormat}
                      onValueChange={(value) => handleOutputFormatChange(file.id, value)}
                    >
                      <SelectTrigger className={`w-24 ${theme === "dark" ? "bg-gray-800 border-gray-700" : ""}`}>
                        <SelectValue placeholder="Format" />
                      </SelectTrigger>
                      <SelectContent className={theme === "dark" ? "bg-gray-800 border-gray-700" : ""}>
                        {supportedFormat.map((format) => (
                          <SelectItem
                            key={format}
                            value={format}
                            className={theme === "dark" ? "text-gray-200 focus:bg-gray-700" : ""}
                          >
                            {format.toUpperCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <button
                      onClick={() => handleRemoveUploadedFile(file.id)}
                      className={`p-2 ${theme === "dark" ? "text-gray-400 hover:text-red-400" : "text-gray-500 hover:text-red-500"}`}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Converted Files Section */}
        {convertedFiles.length > 0 && (
          <div
            className={`w-full max-w-3xl ${theme === "dark" ? "bg-[#1a2234]" : "bg-card"} rounded-lg p-6 ${theme === "dark" ? "" : "border border-border"}`}
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <h2 className="text-xl font-semibold">Converted Images</h2>
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <span className={`${theme === "dark" ? "text-gray-400" : "text-gray-500"} text-sm`}>
                  Total space saved: {formatFileSize(totalSaved)}
                </span>
                {convertedFiles.length > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadAllFilesAsZip(convertedFiles)}
                    className={`${
                      theme === "dark"
                        ? "bg-gray-800 text-gray-200 border-gray-700 hover:bg-gray-700"
                        : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200"
                    } ${downloadAllLoading ? "cursor-progress" : "cursor-pointer"}`}
                  >
                    <Download size={16} className="mr-2" />
                    {downloadAllLoading ? "Downloading...." : "Download All as ZIP"}
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {convertedFiles.map((file) => (
                <div
                  key={file.id}
                  className={`flex items-center justify-between p-3 border rounded-lg ${
                    theme === "dark" ? "border-gray-700" : "border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"} rounded flex items-center justify-center`}
                    >
                      <img
                        src={file.url || "/placeholder.svg"}
                        width={40}
                        height={40}
                        alt={file.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <div
                        className={`flex items-center text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                      >
                        <span>{formatFileSize(file.originalSize)}</span>
                        <span className="mx-2">→</span>
                        <span>{formatFileSize(file.convertedSize)}</span>
                        {file.savedPercentage > 0 && (
                          <span className="ml-2 text-green-400">({file.savedPercentage}% saved)</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRemoveConvertedFile(file.id)}
                      className={`p-2 ${theme === "dark" ? "text-gray-400 hover:text-red-400" : "text-gray-500 hover:text-red-500"}`}
                    >
                      <Trash2 size={18} />
                    </button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadFile(file.url, file.name)}
                      className={`${
                        theme === "dark"
                          ? "bg-gray-800 text-gray-200 border-gray-700 hover:bg-gray-400"
                          : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200"
                      } cursor-pointer`}
                    >
                      <Download size={16} className="mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      <Toaster/>
    </>
  )
}
