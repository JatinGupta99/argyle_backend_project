"use client"

import { useState } from "react"
import { Heart, MessageCircle, Send } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Header } from "../layout/Header/Page"

interface Update {
  id: string
  author: {
    name: string
    role: string
    avatar: string
    initials: string
  }
  timestamp: string
  content: string
  likes: number
  comments: number
  liked: boolean
}

const SAMPLE_UPDATES: Update[] = [
  {
    id: "1",
    author: {
      name: "Nia B.",
      role: "Organizer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nia",
      initials: "NB",
    },
    timestamp: "a few seconds ago",
    content:
      "We're looking forward to a great event today! Our Opening Keynote is titled Beyond Numbers - How AI & Automation Are Redefining Finance Leadership and will begin at 11AM ET. We look forward to seeing you there!",
    likes: 0,
    comments: 0,
    liked: false,
  },
]

export function EventUpdates() {
  const [updates, setUpdates] = useState<Update[]>(SAMPLE_UPDATES)
  const [commentText, setCommentText] = useState("")

  const handleLike = (id: string) => {
    setUpdates(
      updates.map((update) =>
        update.id === id
          ? {
              ...update,
              liked: !update.liked,
              likes: update.liked ? update.likes - 1 : update.likes + 1,
            }
          : update,
      ),
    )
  }

  const handleComment = () => {
    if (commentText.trim()) {
      setCommentText("")
    }
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden">
           <Header />
      {/* Event Banner */}

  <div className="w-[700px] h-[220px] mt-[20px] ml-5 bg-gray-200 rounded shadow-md overflow-hidden">
                <img
                  src="/office.jpg"
                  alt="Event"
                  className="w-full h-full object-cover"
                />
              </div>
<h2 className="text-xl font-bold text-foreground mt-6 mb-6 ml-5">EVENT UPDATES</h2>


      {/* Updates Feed */}
      <div className="flex-1 overflow-y-auto p-6">
      

        {/* Updates List */}
        <div className="space-y-6">
          {updates.map((update) => (
            <div key={update.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              {/* Post Header */}
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={update.author.avatar || "/placeholder.svg"} alt={update.author.name} />
                  <AvatarFallback>{update.author.initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">{update.author.name}</span>
                    <span className="text-sm text-orange-500 font-medium">({update.author.role})</span>
                  </div>
                  <span className="text-xs text-gray-500">{update.timestamp}</span>
                </div>
              </div>

              {/* Post Content */}
              <p className="text-gray-700 mb-4 leading-relaxed">{update.content}</p>

              {/* Post Actions */}
              <div className="flex items-center gap-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleLike(update.id)}
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors"
                >
                  <Heart size={18} className={update.liked ? "fill-blue-500 text-blue-500" : ""} />
                  <span className="text-sm">Like</span>
                </button>
                <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors">
                  <MessageCircle size={18} />
                  <span className="text-sm">Comments {update.comments > 0 ? update.comments : ""}</span>
                </button>
              </div>
               <div className=" border-gray-200 bg-white p-6">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=User" />
            <AvatarFallback>NB</AvatarFallback>
          </Avatar>
          <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2">
            <input
              type="text"
              placeholder="Write your Comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleComment()}
              className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder-gray-500"
            />
            <button
              onClick={handleComment}
              disabled={!commentText.trim()}
              className="text-blue-500 hover:text-blue-600 disabled:text-gray-300 transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comment Input */}
     
    </div>
  )
}
