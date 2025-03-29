"use client"

import { useEffect, useRef, useState } from "react"
import { Send, User, Wand2, Volume2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Message {
  id: string
  content: string
  sender: "user" | "assistant"
  timestamp: Date
}

// Sample initial messages
const initialMessages: Message[] = [
  {
    id: "1",
    content: "Hi there! I'm your Campus Finder assistant. How can I help you today?",
    sender: "assistant",
    timestamp: new Date(),
  },
]

// Sample suggested questions
const suggestedQuestions = [
  "How do I report a lost item?",
  "Where can I find my reported items?",
  "How does the matching system work?",
  "What information should I include in my report?",
]

export function ChatAssistant() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Simulate assistant typing
    setIsTyping(true)

    // Simulate assistant response after a delay
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: getAssistantResponse(input),
        sender: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleSuggestedQuestion = (question: string) => {
    setInput(question)
    handleSend()
  }

  // Simple response logic - in a real app, this would be connected to an AI service
  const getAssistantResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase()

    if (lowerMessage.includes("report") && lowerMessage.includes("lost")) {
      return "To report a lost item, click on the 'Report Item' button in the navigation bar. You'll need to provide details about the item, when and where you last saw it, and optionally upload a photo to help with identification."
    } else if (lowerMessage.includes("find") || lowerMessage.includes("search")) {
      return "You can search for items in the 'Find Items' section. Use filters to narrow down by category, location, or date. Our AI matching system will also suggest potential matches based on your reported lost items."
    } else if (lowerMessage.includes("match") || lowerMessage.includes("system")) {
      return "Our AI matching system compares newly found items with reported lost items using visual recognition and item descriptions. When a potential match is found, both parties are notified and can arrange for the item to be returned."
    } else if (lowerMessage.includes("information") || lowerMessage.includes("include")) {
      return "When reporting an item, try to include as much detail as possible: the item's appearance, any identifying marks, when and where it was lost/found, and a clear photo if available. The more information you provide, the better our matching system can work!"
    } else {
      return "I'm here to help with any questions about the Campus Finder system. You can ask about reporting items, searching for lost items, how our matching works, or any other features of the platform."
    }
  }

  // Function to convert text to speech
  const speakMessage = async (text: string) => {
    try {
      setIsSpeaking(true);
      console.log("Speaking message:", text);
      
      // Method 1: Try using the Web Speech API first (built into browsers)
      if ('speechSynthesis' in window) {
        console.log("Using Web Speech API");
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = (event) => {
          console.error("Speech synthesis error:", event);
          setIsSpeaking(false);
        };
        window.speechSynthesis.speak(utterance);
        return;
      }
      
      // Method 2: Fallback to Google TTS API
      console.log("Falling back to Google TTS API");
      const response = await fetch("https://texttospeech.googleapis.com/v1/text:synthesize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-User-Project": process.env.NEXT_PUBLIC_GOOGLE_PROJECT_ID || "",
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_GOOGLE_AUTH_TOKEN || ""}`,
        },
        body: JSON.stringify({
          input: {
            text: text
          },
          voice: {
            languageCode: "en-US", // Changed to en-US for better compatibility
            name: "en-US-Standard-D" // Changed to a standard voice that's widely available
          },
          audioConfig: {
            audioEncoding: "MP3" // Changed to MP3 for better browser compatibility
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Google TTS API error:", response.status, errorText);
        throw new Error(`API returned ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log("API response received:", data);
      
      // Convert base64 to audio
      if (data.audioContent) {
        const audioContent = data.audioContent;
        const audioBlob = convertBase64ToAudio(audioContent);
        const audioUrl = URL.createObjectURL(audioBlob);
        
        if (audioRef.current) {
          console.log("Playing audio");
          audioRef.current.src = audioUrl;
          
          // Add event listeners for debugging
          audioRef.current.onloadedmetadata = () => console.log("Audio metadata loaded");
          audioRef.current.oncanplay = () => console.log("Audio can play");
          audioRef.current.onerror = (e) => console.error("Audio error:", e);
          
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => console.log("Audio playback started"))
              .catch(error => {
                console.error("Audio playback error:", error);
                setIsSpeaking(false);
              });
          }
          
          audioRef.current.onended = () => {
            console.log("Audio playback ended");
            setIsSpeaking(false);
            URL.revokeObjectURL(audioUrl);
          };
        } else {
          console.error("Audio element reference is null");
          setIsSpeaking(false);
        }
      } else {
        console.error("No audio content in response:", data);
        setIsSpeaking(false);
      }
    } catch (error) {
      console.error("Error with text-to-speech:", error);
      setIsSpeaking(false);
    }
  };

  // Helper function to convert base64 to audio blob
  const convertBase64ToAudio = (base64: string) => {
    try {
      const binaryString = window.atob(base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return new Blob([bytes], { type: 'audio/mp3' }); // Changed to mp3
    } catch (error) {
      console.error("Error converting base64 to audio:", error);
      throw error;
    }
  };

  return (
    <div className="flex h-[500px] flex-col rounded-lg border">
      <audio ref={audioRef} className="hidden" controls />
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={cn("flex", message.sender === "user" ? "justify-end" : "justify-start")}
            >
              <div
                className={cn("flex max-w-[80%] items-start gap-2", message.sender === "user" && "flex-row-reverse")}
              >
                {message.sender === "assistant" ? (
                  <Avatar className="mt-1 h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Assistant" />
                    <AvatarFallback>
                      <Wand2 className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <Avatar className="mt-1 h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "rounded-lg px-4 py-2 text-sm",
                    message.sender === "assistant" ? "bg-muted" : "bg-primary text-primary-foreground",
                  )}
                >
                  {message.content}
                  {message.sender === "assistant" && (
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="ml-2 h-6 w-6 p-0" 
                      onClick={() => speakMessage(message.content)}
                      disabled={isSpeaking}
                    >
                      <Volume2 className="h-3 w-3" />
                      <span className="sr-only">Speak message</span>
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className="flex justify-start"
              >
                <div className="flex max-w-[80%] items-start gap-2">
                  <Avatar className="mt-1 h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Assistant" />
                    <AvatarFallback>
                      <Wand2 className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="rounded-lg bg-muted px-4 py-2 text-sm">
                    <div className="flex space-x-1">
                      <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50"></div>
                      <div
                        className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>
      </div>

      {messages.length === 1 && (
        <div className="mx-4 mb-4 grid grid-cols-2 gap-2">
          {suggestedQuestions.map((question, index) => (
            <Button
              key={index}
              variant="outline"
              className="justify-start text-left text-sm"
              onClick={() => handleSuggestedQuestion(question)}
            >
              {question}
            </Button>
          ))}
        </div>
      )}

      <div className="border-t p-4">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1"
          />
          <Button size="icon" onClick={handleSend} disabled={!input.trim() || isTyping}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

