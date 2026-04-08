"use client";

import { useState, type ComponentType, type KeyboardEvent, type SyntheticEvent } from 'react';
import { Facebook, Twitter, Linkedin, MessageCircle, Send, Link as LinkIcon, Pin } from 'lucide-react';
import { handleCopy, handleShare, type Post, type SharePlatform } from '../utils/share';

interface BlogShareControlsProps {
  post: Post;
  compact?: boolean;
}

type PlatformItem = {
  key: SharePlatform;
  label: string;
  Icon: ComponentType<{ className?: string }>;
  className: string;
};

const PLATFORMS: PlatformItem[] = [
  { key: 'facebook', label: 'Facebook', Icon: Facebook, className: 'hover:bg-[#1877f2] hover:text-white hover:border-[#1877f2]' },
  { key: 'twitter', label: 'Twitter / X', Icon: Twitter, className: 'hover:bg-[#1da1f2] hover:text-white hover:border-[#1da1f2]' },
  { key: 'linkedin', label: 'LinkedIn', Icon: Linkedin, className: 'hover:bg-[#0a66c2] hover:text-white hover:border-[#0a66c2]' },
  { key: 'whatsapp', label: 'WhatsApp', Icon: MessageCircle, className: 'hover:bg-[#25d366] hover:text-white hover:border-[#25d366]' },
  { key: 'telegram', label: 'Telegram', Icon: Send, className: 'hover:bg-[#26a5e4] hover:text-white hover:border-[#26a5e4]' },
  { key: 'pinterest', label: 'Pinterest', Icon: Pin, className: 'hover:bg-[#bd081c] hover:text-white hover:border-[#bd081c]' },
  { key: 'reddit', label: 'Reddit', Icon: MessageCircle, className: 'hover:bg-[#ff4500] hover:text-white hover:border-[#ff4500]' },
];

function onSpaceOrEnter(fn: () => void) {
  return (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      fn();
    }
  };
}

function stopCardNavigation(e: SyntheticEvent) {
  e.preventDefault();
  e.stopPropagation();
}

export default function BlogShareControls({ post, compact = false }: BlogShareControlsProps) {
  const [copied, setCopied] = useState(false);

  const runAction = async (e: SyntheticEvent, fn: () => Promise<void> | void) => {
    stopCardNavigation(e);
    await fn();
  };

  const copyLink = async () => {
    const ok = await handleCopy(post.id);
    if (!ok) return;
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {!compact && <span className="text-gray-500 text-sm font-medium">Share via</span>}
      <div className="flex items-center gap-1.5 flex-wrap">
        {PLATFORMS.map(({ key, label, Icon, className }) => (
          <button
            key={key}
            type="button"
            role="button"
            tabIndex={0}
            aria-label={`Share on ${label}`}
            onClick={(e) => runAction(e, () => handleShare(key, post))}
            onKeyDown={onSpaceOrEnter(() => handleShare(key, post))}
            className={`rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 transition-all ${className} ${
              compact ? 'w-7 h-7' : 'w-8 h-8'
            }`}
          >
            <Icon className={compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
          </button>
        ))}
        <button
          type="button"
          role="button"
          tabIndex={0}
          aria-label="Copy blog link"
          onClick={(e) => runAction(e, copyLink)}
          onKeyDown={onSpaceOrEnter(copyLink)}
          className={`rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-[#0a2240] hover:text-white hover:border-[#0a2240] transition-all relative ${
            compact ? 'w-7 h-7' : 'w-8 h-8'
          }`}
        >
          <LinkIcon className={compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
          {copied && (
            <span className="absolute -top-9 left-1/2 -translate-x-1/2 bg-[#0a2240] text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              Link copied!
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
