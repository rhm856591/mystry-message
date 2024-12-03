'use client'
import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Link from "next/link"
import { useDebounceValue } from 'usehooks-ts'
import { useToast } from "@/hooks/use-toast"
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'


const page = () => {
  const { toast } = useToast()
  const [username, setUsername] = useState('')
  const [usernameMessage, setUsernameMessage] = useState('')
  const [isCheckingUsername, setCheckingUsername] = useState(false)
  const [isSubmitting, setSubmitting] = useState(false)
  const debouncedValueUsername = useDebounceValue(username, 300)
  const router = useRouter()

//   zod implemention


  return (
    <Button
      onClick={() => {
        toast({
          title: "Scheduled: Catch up",
          description: "Friday, February 10, 2023 at 5:57 PM",
        })
      }}
    >Show Toast
    </Button>
  )
}

export default page