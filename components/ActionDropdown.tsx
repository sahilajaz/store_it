'use client'

import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import Image from 'next/image';
import { Models } from 'node-appwrite';
import { actionsDropdownItems } from '@/constants';
import Link from 'next/link';
import { constructDownloadUrl, constructFileUrl } from '@/lib/utils';
  
  

const ActionDropdown = ({file} : {file : Models.Document}) => {
    const [isModelOpen , setIsModelOpen] = useState(false)
    const [isDropDownOpen , setIsDropDownOpen] = useState(false)
    const [action , setAction] = useState<ActionType | null>(null)
    
    

  return (
    <Dialog open={isModelOpen} onOpenChange={setIsModelOpen}>
     <DropdownMenu open={isDropDownOpen} onOpenChange={setIsDropDownOpen}>
    <DropdownMenuTrigger className='shad-no-focus'>
        <Image src="/assets/icons/dots.svg" alt='dots' width={34} height={34} />
    </DropdownMenuTrigger>
    <DropdownMenuContent>
        <DropdownMenuLabel className='max-w-[200px] truncate'>{file.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {
    actionsDropdownItems.map((actionItem) => (
        <DropdownMenuItem 
            key={actionItem.value} 
            className='shad-dropdown-item' 
            onClick={() => {
                setAction(actionItem);
                if (['rename', 'share', 'delete', 'details'].includes(actionItem.value)) {
                    setIsModelOpen(true);
                }
            }}>
            {actionItem.value === 'download' ? (
                <a 
                    href={constructDownloadUrl(file.bucketFiledId)} 
                    download={file.name} 
                    className='flex items-center gap-2'>
                    <Image src={actionItem.icon} alt={actionItem.label} width={30} height={30} />
                    {actionItem.label}
                </a>
            ) : (
                <div className='flex items-center gap-2'>
                    <Image src={actionItem.icon} alt={actionItem.label} width={30} height={30} />
                    {actionItem.label}
                </div>
            )}
        </DropdownMenuItem>
    ))
}

    </DropdownMenuContent>
   </DropdownMenu>
    </Dialog>
  )
}

export default ActionDropdown
