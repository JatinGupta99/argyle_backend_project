'use client';

import React, { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Smile, Send, LucideIcon } from 'lucide-react';
import emojiData from '@emoji-mart/data';

const Picker = dynamic(() => import('@emoji-mart/react'), { ssr: false });

interface SocialInputProps {
    value: string;
    onChange: (value: string) => void;
    onSend: () => void;
    placeholder?: string;
    disabled?: boolean;
    maxHeight?: number;
    minHeight?: number;
    className?: string;
    icon?: LucideIcon;
    variant?: 'chat' | 'comment' | 'broadcast';
    hideAvatar?: boolean;
    avatarText?: string;
}

export function SocialInput({
    value,
    onChange,
    onSend,
    placeholder = "Write something...",
    disabled = false,
    maxHeight = 120,
    className = "",
    variant = 'chat',
    hideAvatar = true,
    avatarText = "U",
}: SocialInputProps) {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const triggerRef = useRef<HTMLDivElement>(null);
    const pickerRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            const newHeight = Math.min(textarea.scrollHeight, maxHeight);
            textarea.style.height = `${newHeight}px`;
        }
    }, [value, maxHeight]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                pickerRef.current && !pickerRef.current.contains(event.target as Node) &&
                triggerRef.current && !triggerRef.current.contains(event.target as Node)
            ) {
                setShowEmojiPicker(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleEmojiSelect = (emoji: any) => {
        onChange(value + emoji.native);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSend();
        }
    };

    const isBroadcast = variant === 'broadcast';
    const isComment = variant === 'comment';

    return (
        <div className={`relative ${className}`}>
            { }
            <div
                ref={pickerRef}
                className={`absolute z-[100] transition-all duration-300 transform shadow-2xl rounded-2xl overflow-x-auto border border-slate-100 ${isBroadcast ? 'top-full left-0 mt-2 origin-top-left' : 'bottom-full right-0 mb-2 origin-bottom-right'
                    } w-[calc(100vw-64px)] sm:w-[320px] max-w-[280px] ${showEmojiPicker ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
                    }`}
            >
                <Picker
                    data={emojiData}
                    onEmojiSelect={handleEmojiSelect}
                    theme="light"
                    set="native"
                    previewPosition="none"
                    skinTonePosition="none"
                    width="100%"
                />
            </div>

            <div className={`flex items-start gap-3 ${isBroadcast ? 'max-w-3xl mx-auto' : ''}`}>
                {!hideAvatar && (
                    <div className={`${isBroadcast ? 'w-10 h-10 bg-blue-600' : 'w-8 h-8 bg-sky-500'} rounded-full text-white flex items-center justify-center font-bold shrink-0 mt-1`}>
                        {avatarText.slice(0, 1).toUpperCase()}
                    </div>
                )}

                <div className={`flex-1 flex flex-col transition-all duration-300 ${isBroadcast
                    ? 'bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/50 p-4 md:p-6 shadow-inner focus-within:ring-2 focus-within:ring-blue-500/20'
                    : 'bg-background rounded-2xl border border-border shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-sky-500/20'
                    }`}>
                    <textarea
                        ref={textareaRef}
                        placeholder={placeholder}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onKeyDown={handleKeyPress}
                        disabled={disabled}
                        rows={1}
                        className={`w-full bg-transparent border-none outline-none font-medium resize-none custom-scrollbar ${isBroadcast
                            ? 'text-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 min-h-[80px]'
                            : 'text-[14px] text-slate-900 placeholder-slate-400 px-5 py-3'
                            }`}
                    />

                    <div className={`flex items-center justify-between ${isBroadcast ? 'pt-4 border-t border-slate-200/60 mt-4' : 'px-4 py-2 bg-slate-50/50 border-t border-slate-50'
                        }`}>
                        <div className="flex items-center gap-4">
                            <div
                                ref={triggerRef}
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                className={`p-1.5 rounded-lg cursor-pointer transition-all ${showEmojiPicker
                                    ? 'bg-blue-100 text-blue-600'
                                    : 'text-slate-400 hover:text-blue-500 hover:bg-blue-50'
                                    }`}
                            >
                                <Smile size={isBroadcast ? 20 : 18} />
                            </div>
                            {isBroadcast && (
                                <span className="text-xs text-slate-400 font-medium italic hidden xs:block">
                                    Visible to all event attendees
                                </span>
                            )}
                        </div>

                        <button
                            onClick={onSend}
                            disabled={!value.trim() || disabled}
                            className={`flex items-center gap-2 transition-all disabled:opacity-30 ${isBroadcast
                                ? 'bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-500/30'
                                : 'text-sky-500 hover:bg-sky-50 p-1.5 rounded-lg'
                                }`}
                        >
                            {isBroadcast && <Send size={18} />}
                            <span className={isBroadcast ? "" : "sr-only"}>
                                {isBroadcast ? "Post Update" : "Send"}
                            </span>
                            {!isBroadcast && <Send size={18} className={variant === 'chat' ? '-rotate-45' : ''} />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
