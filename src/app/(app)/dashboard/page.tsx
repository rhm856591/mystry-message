'use client'
import { useToast } from '@/hooks/use-toast'
import { Message } from '@/model/user'
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { User } from 'next-auth'
import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

const page = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)

  const {toast} = useToast()

  const handleDeleteMessage = (messageid: string) =>{
    setMessages(messages.filter((message)=> message._id !== messageid))
  }

  const {data: session} = useSession()

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema)
  })

  const {register, watch, setValue} = form;

  const acceptMessages = watch('acceptMessages')

  const fetchAcceptMessage = useCallback(async ()=>{
    setIsSwitchLoading(true)
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages')
      setValue('acceptMessages', response.data.isAcceptingMessage)

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: "Error",
        description: axiosError.response?.data.message || "Error while fetching accept messages",
        variant: "destructive",
      })
    } finally {
      setIsSwitchLoading(false)
    }
  },[setValue])

  const fetchMessages = useCallback(async (refresh: boolean = false) =>{
    setIsLoading(true)
    setIsSwitchLoading(true)
    try {
      const response = await axios.get('/api/accept-message')
      setMessages(response.data.messages||[])
      if(refresh) {
        toast({
          title: "Refresh Message",
          description: "Showing latest message",
        })
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: "Error",
        description: axiosError.response?.data.message || "Error while fetching messages",
        variant: "destructive",
      })
      
    } finally{
      setIsLoading(false)
      setIsSwitchLoading(false)
    }
  },[setIsLoading, setMessages])

  useEffect(()=>{
    if(!session || !session.user) return 
    fetchMessages()
    fetchAcceptMessage()
  },[session, setValue, fetchAcceptMessage,fetchMessages])

  const handleSwitchChange = async ()=>{
    setIsSwitchLoading(true)
    try {
      const response = await axios.post('/api/accept-message', {acceptMessages:!acceptMessages})
      setValue('acceptMessages', !acceptMessages)
      toast({
        title: "Switch Accept Message",
        description: `Accept message is now ${response.data.isAcceptingMessage? 'ON' : 'OFF'}`,
      })
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: "Error",
        description: axiosError.response?.data.message || "Error while switching accept messages",
        variant: "destructive",
      })
    } finally {
      setIsSwitchLoading(false)
    }
  }

  const {username} = session?.user as User
  const baseURL = `${window.location.protocol}//${window.location.host}`
  const profileURL = `${baseURL}/u/${username}`

  const copyToClipboard = ()=>{
    navigator.clipboard.writeText(profileURL)
    toast({
      title: "Copy URL",
      description: "URL copied to clipboard",
    })
  }

  if(!session || !session.user){
    return <div>Please login</div>
  }


  return (
    <div>Dashboard</div>
  )
}

export default page