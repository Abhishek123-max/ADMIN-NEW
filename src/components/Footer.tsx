"use client";

import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  Clock,
  MessageSquare,
} from "lucide-react";
import { useSiteSettings } from "../hooks/useSiteSettings";

function PinterestIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
    </svg>
  );
}

function ThreadsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.028-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.689-2.051 1.6-1.72 1.894-4.166 1.894-5.768l-5.586-.002c-.005 0-.005-1.999 0-2H22l.003 2.002c.005 2.454-.494 5.542-2.587 7.793C17.724 23.231 15.354 24 12.187 24z" />
    </svg>
  );
}

export default function Footer() {
  const { settings } = useSiteSettings();

  const siteName = settings.site_name || "WesternProperties";
  const words = siteName
    .replace(/([A-Z])/g, " $1")
    .trim()
    .split(" ");

  const SOCIAL = [
    { Icon: Facebook, href: settings.facebook_url, label: "Facebook" },
    { Icon: Instagram, href: settings.instagram_url, label: "Instagram" },
    { Icon: Twitter, href: settings.twitter_url, label: "Twitter / X" },
    { Icon: Linkedin, href: settings.linkedin_url, label: "LinkedIn" },
    { Icon: Youtube, href: settings.youtube_url, label: "YouTube" },
    { Icon: MessageSquare, href: settings.whatsapp_url, label: "WhatsApp" },
    { Icon: PinterestIcon, href: settings.pinterest_url, label: "Pinterest" },
    { Icon: ThreadsIcon, href: settings.threads_url, label: "Threads" },
  ].filter((s) => s.href);

  return (
    <footer className="bg-[#0a2240] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              {settings.logo_url ? (
                <img
                  src={settings.logo_url}
                  alt={settings.site_name}
                  className="h-10 w-auto object-contain"
                />
              ) : (
                <div className="w-9 h-9 bg-[#c9a84c] rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
              )}
              <div className="leading-none">
                <span className="text-yellow-500 font-bold text-xl block">
                  {words[0]}
                </span>

                <span className="text-white uppercase font-bold text-md block">
                  {words.slice(1).join(" ")}
                </span>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-5">
              {settings.tagline ||
                "Your trusted partner in finding the perfect property across Goa and India."}
            </p>
            {SOCIAL.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {SOCIAL.map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    title={label}
                    className="w-9 h-9 bg-white/10 hover:bg-[#c9a84c] rounded-lg flex items-center justify-center transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Property Types
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "Land for Sale", path: "/land" },
                { label: "Room for Rent", path: "/rent?type=room_rent" },
                { label: "Land for Rent", path: "/properties?type=land_rent" },
                {
                  label: "Commercial Rent",
                  path: "/properties?type=commercial_rent",
                },
                { label: "Lease Properties", path: "/properties?type=lease" },
              ].map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className="text-white/60 hover:text-[#c9a84c] text-sm transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "Home", path: "/" },
                { label: "All Properties", path: "/properties" },
                {
                  label: "Featured Properties",
                  path: "/properties?featured=true",
                },
                { label: "Contact Us", path: "/contact" },
                { label: "Privacy Policy", path: "/privacy-policy" },
                { label: "Terms & Conditions", path: "/terms-and-conditions" },
              ].map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className="text-white/60 hover:text-[#c9a84c] text-sm transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#c9a84c] mt-0.5 flex-shrink-0" />
                <span className="text-white/60 text-sm">
                  {settings.address}
                </span>
              </li>
              <li>
                <a
                  href={`tel:${settings.phone_raw}`}
                  className="flex items-center gap-3 text-white/60 hover:text-[#c9a84c] text-sm transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#c9a84c] flex-shrink-0" />
                  +91 {settings.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${settings.email}`}
                  className="flex items-center gap-3 text-white/60 hover:text-[#c9a84c] text-sm transition-colors"
                >
                  <Mail className="w-4 h-4 text-[#c9a84c] flex-shrink-0" />
                  {settings.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#c9a84c] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white/40 text-xs mb-0.5">Business Hours</p>
                  <p className="text-white/80 text-sm whitespace-pre-line">
                    {settings.business_hours}
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">
            &copy; {new Date().getFullYear()} {settings.site_name}. All rights
            reserved.
          </p>
          <div className="flex gap-4">
            <Link
              href="/privacy-policy"
              className="text-white/30 hover:text-white/60 text-xs transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-and-conditions"
              className="text-white/30 hover:text-white/60 text-xs transition-colors"
            >
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
