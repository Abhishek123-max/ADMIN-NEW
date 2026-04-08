"use client";

import { Share2, Facebook, Twitter, Linkedin, Link, MessageCircle, Instagram } from 'lucide-react';
import { useState } from 'react';
import { useSiteSettings } from '../hooks/useSiteSettings';

interface Props {
  url?: string;
  title: string;
  description?: string;
  proxyUrl?: string;
}

function RedditIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
    </svg>
  );
}

function normalizeUrlForPublicSharing(raw: string): string {
  const target = (
    process.env.NEXT_PUBLIC_PUBLIC_SITE_URL ||
    ''
  ).trim();
  if (!target) return raw;

  try {
    const source = new URL(raw, window.location.origin);
    const isLocal = source.hostname === 'localhost' || source.hostname === '127.0.0.1' || source.hostname === '0.0.0.0';
    if (!isLocal) return source.toString();

    const publicBase = new URL(target);
    source.protocol = publicBase.protocol;
    source.host = publicBase.host;
    return source.toString();
  } catch {
    return raw;
  }
}

function buildSafeShareUrl(candidateUrl?: string, proxyUrl?: string): string {
  const fallback = window.location.href;
  const source = (proxyUrl || candidateUrl || fallback).trim() || fallback;
  const normalized = normalizeUrlForPublicSharing(source);

  try {
    const parsed = new URL(normalized, window.location.origin);
    // Social sites need an absolute web URL and behave badly with hash-only values.
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return normalizeUrlForPublicSharing(fallback);
    }
    parsed.hash = '';
    return parsed.toString();
  } catch {
    return normalizeUrlForPublicSharing(fallback);
  }
}

export default function SocialShare({ url, title, description = '', proxyUrl }: Props) {
  const [copied, setCopied] = useState(false);
  const { settings } = useSiteSettings();

  const shareUrl = buildSafeShareUrl(url, proxyUrl);
  const shareText = description ? `${title}\n${description}` : title;

  const whatsappNumber = settings.phone_raw || '';
  const whatsappMsg = `${shareText}\n${shareUrl}`;
  const whatsappLink = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMsg)}`
    : `https://wa.me/?text=${encodeURIComponent(whatsappMsg)}`;

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const platforms = [
    {
      name: 'Facebook',
      Icon: Facebook,
      color: 'hover:bg-[#1877f2] hover:border-[#1877f2] hover:text-white',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(title)}`,
      onClick: null as null | (() => void),
    },
    {
      name: 'Instagram',
      Icon: Instagram,
      color: 'hover:bg-gradient-to-br hover:from-[#f09433] hover:via-[#e6683c] hover:to-[#dc2743] hover:border-[#e6683c] hover:text-white',
      href: null as null | string,
      onClick: () => {
        navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        const igUrl = settings.instagram_url || 'https://www.instagram.com/';
        window.open(igUrl, '_blank');
      },
    },
    {
      name: 'Twitter / X',
      Icon: Twitter,
      color: 'hover:bg-[#1da1f2] hover:border-[#1da1f2] hover:text-white',
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`,
      onClick: null as null | (() => void),
    },
    {
      name: 'LinkedIn',
      Icon: Linkedin,
      color: 'hover:bg-[#0a66c2] hover:border-[#0a66c2] hover:text-white',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      onClick: null as null | (() => void),
    },
    {
      name: 'Reddit',
      Icon: ({ className }: { className?: string }) => <RedditIcon className={className} />,
      color: 'hover:bg-[#ff4500] hover:border-[#ff4500] hover:text-white',
      href: `https://www.reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title)}`,
      onClick: null as null | (() => void),
    },
    {
      name: 'WhatsApp',
      Icon: MessageCircle,
      color: 'hover:bg-[#25d366] hover:border-[#25d366] hover:text-white',
      href: whatsappLink,
      onClick: null as null | (() => void),
    },
  ];

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="flex items-center gap-1.5 text-gray-500 text-sm font-medium">
        <Share2 className="w-4 h-4" />
        Share:
      </span>
      <div className="flex items-center gap-1.5 flex-wrap">
        {platforms.map(({ name, Icon, color, href, onClick }) => (
          onClick ? (
            <button
              key={name}
              onClick={onClick}
              aria-label={`Share on ${name}`}
              title={`Share on ${name} (link copied to clipboard)`}
              className={`w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 transition-all ${color}`}
            >
              <Icon className="w-4 h-4" />
            </button>
          ) : (
            <a
              key={name}
              href={href!}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Share on ${name}`}
              className={`w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 transition-all ${color}`}
            >
              <Icon className="w-4 h-4" />
            </a>
          )
        ))}
        <button
          onClick={copyLink}
          aria-label="Copy link"
          title="Copy link to clipboard"
          className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-[#0a2240] hover:border-[#0a2240] hover:text-white transition-all relative"
        >
          <Link className="w-4 h-4" />
          {copied && (
            <span className="absolute -top-9 left-1/2 -translate-x-1/2 bg-[#0a2240] text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              Copied!
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
