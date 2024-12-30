import { Models } from 'node-appwrite'
import React from 'react'
import Thumbnail from './Thumbnail'
import FormattedDate from './FormattedDate'
import { convertFileSize, formatDateTime } from '@/lib/utils'

const ImageThumbnail = ({file} : {file : Models.Document}) => {
    return (
      <div className='file-details-thumbnail'>
        <Thumbnail type={file.type} extension={file.extension} url={file.url}/>
        <div className='flex flex-col'>
          <p className='subtitle-2 mb-1'>{file.name}</p>
          <FormattedDate date={file.$createdAt} className="caption"/>
        </div>
      </div>
    )
}

const DeatailRow = ({label , value} : {label : string ; value : string}) => (
   <div className='flex'>
    <p className='file-details-label'>{label}</p>
    <p className='file-details-value'>{value}</p>
   </div>
)

export const FileDetails = ({file} : {file : Models.Document}) => {
  return (
    <>
      <ImageThumbnail file={file}/>
      <DeatailRow label='format:' value={file.extension}/>
      <DeatailRow label='szie:' value={convertFileSize(file.size)}/>
      <DeatailRow label='Owner:' value={file.owner.fullName}/>
      <DeatailRow label='Last edit:' value={formatDateTime(file.$updatedAt)}/>
    </>
  )
}


