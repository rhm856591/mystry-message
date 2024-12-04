'use client'
import React, { useState } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from './ui/button'
import { X } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Message } from '@/model/user'
import axios from 'axios'
import { ApiResponse } from '@/types/ApiResponse'


type MessageCardProps = {
    message: Message;
    onMessageDelete: (messageId: string) => void
}

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
    const { toast } = useToast()
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDeleteConfirm = async () => {
        try {
            setIsDeleting(true)
            const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
            toast({
                title: response.data.message,
            })
            onMessageDelete(message._id)
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to delete message',
                variant: 'destructive',
            })
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>{message.title || 'No Title'}</CardTitle>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="destructive"
                                aria-label="Delete message"
                                disabled={isDeleting}
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. The message will be permanently deleted.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDeleteConfirm}
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? 'Deleting...' : 'Continue'}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    <CardDescription>{message.description || 'No Description'}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>{message.content || 'No Content'}</p>
                </CardContent>
                <CardFooter>
                    <p>Posted at: {new Date(message.createdAt).toLocaleString()}</p>
                </CardFooter>
            </Card>
        </div>
    )
}

export default MessageCard
