'use client'

import React, {MouseEvent, useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import { Button } from './ui/button'
import { cn, convertFileToUrl, getFileType } from '@/lib/utils'
import Image from 'next/image'
import Thumbnail from './Thumbnail'
import { MAX_FILE_SIZE } from '@/constants'
import { toast } from '@/hooks/use-toast'
import { uploadFile } from '@/lib/actions/file.action'
import { usePathname } from 'next/navigation'

interface Props {
  ownerId: string;
  accountId: string;
  className?: string
}

const FileUploader = ({ownerId , accountId , className} : Props) => {
  const [files , setFiles] = useState<File[]>([])
  const path = usePathname()

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setFiles(acceptedFiles)
    const uploadPromise = acceptedFiles.map(async (file) => {
      if(file.size > MAX_FILE_SIZE) {
        setFiles((prevFiles) => prevFiles.filter((f) => f.name !== file.name))
        return (
          toast({
            description: (
              <p className='body-2 text-white'><span className='font-semibold'>
                {file.name}    
              </span> is too large. Max file size is 50MB.
              </p>
            ), className: 'error-toast',
          })
        )
      }
      return uploadFile({file , ownerId , accountId , path})
            .then((uploadFile) => {
              if(uploadFile) {
                 setFiles((prevFile) => prevFile.filter((f) => f.name !== file.name))
              }
            })
    })
     await Promise.all(uploadPromise)
  }, [accountId , ownerId , path])

  const {getRootProps, getInputProps} = useDropzone({onDrop})

  const handleRemoveFile = (e: React.MouseEvent<HTMLImageElement> , fileName : string) => {
    e.stopPropagation()
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName))
  }

  return (
    <div {...getRootProps()} className='cursor-pointer'>
      <input {...getInputProps()} />
        <Button type='button' className={cn('uploader-button')}>
          <Image src="/assets/icons/upload.svg" alt='upload' width={24} height={24}/>
          <p>Upload</p>
        </Button>
        {
          files.length > 0 && (
            <ul className='uploader-preview-list'>
              <h4 className='h4 text-light-100'>Uploading</h4> 
              {
                files.map((files , index) => {
                  const {type , extension} = getFileType(files.name)
                  return (
                    <li key={`${files.name}-${index}`} className='uploader-preview-item'>
                      <div className='flex items-center gap-3'>
                        <Thumbnail
                          type={type}
                          extension={extension}
                          url={convertFileToUrl(files)}
                        />
                        <div className='preview-item-name'>
                          {files.name}
                          <Image src="/assets/icons/file-loader.gif" width={80} height={26} alt='loader'/>
                        </div>
                      </div>
                      <Image src='/assets/icons/remove.svg' width={24} height={24} alt='remove' onClick={(e) => handleRemoveFile(e, files.name)} />
                    </li>
                  )
                })
              }  
            </ul>
          ) 
        }
    </div>
  )
}

export default FileUploader
