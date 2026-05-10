import { useEffect, useRef, useState } from "react";
import {
  XMarkIcon,
  LinkIcon,
  ClipboardDocumentIcon,
  ClipboardDocumentCheckIcon,
  EnvelopeIcon,
  QrCodeIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";
import { FaWhatsapp } from "react-icons/fa";

const ShareEventModal = ({ eventId, eventName, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [qrVisible, setQrVisible] = useState(false);
  const modalRef = useRef(null);
  // Convert eventId to string to ensure consistency
  const shareUrl = `${window.location.origin}/events/${String(eventId)}?ref=share`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title: eventName,
        text: `Join us for ${eventName}!`,
        url: shareUrl,
      }).catch(err => {
        console.error("Share failed:", err);
      });
    } else {
      handleCopy();
    }
  };
  useEffect(()=>{
    const handleClickOutside=(event)=>{
      if(modalRef.current && !modalRef.current.contains(event.target)){
        onClose()
      }
    };
    // Handle escape key press
     const handleEscKey = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    }
    const timeoutId = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscKey);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
    };
  },[onClose])

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`Join us for ${eventName}: ${shareUrl}`)}`;
  const mailUrl = `mailto:?subject=${encodeURIComponent(eventName)}&body=${encodeURIComponent(`Hi! Here's the event link: ${shareUrl}`)}`;
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(shareUrl)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div  ref={modalRef} className="bg-base-100 rounded-3xl shadow-2xl border border-base-200 w-full max-w-md p-6 relative">

        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-semibold text-base-content">Share this event</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-base-200 transition-colors text-base-content/60 hover:text-base-content"
            aria-label="Close"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sm text-base-content/60 mb-5">
          Anyone with the link can view the event details and payment status.
        </p>

        {/* Link box */}
        <div className="flex items-center gap-2 bg-base-200 rounded-2xl px-4 py-3 mb-4">
          <LinkIcon className="w-4 h-4 text-base-content/40 shrink-0" />
          <span className="flex-1 text-xs font-mono text-base-content/70 truncate">
            {shareUrl}
          </span>
          <button
            onClick={handleCopy}
            className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 flex items-center gap-1 ${
              copied
                ? "bg-success text-success-content"
                : "bg-base-100 border border-base-300 hover:bg-base-300 text-base-content"
            }`}
          >
            {copied ? (
              <>
                <ClipboardDocumentCheckIcon className="w-3.5 h-3.5" />
                Copied!
              </>
            ) : (
              <>
                <ClipboardDocumentIcon className="w-3.5 h-3.5" />
                Copy
              </>
            )}
          </button>
        </div>

        {/* Share methods */}
        <p className="text-xs text-base-content/40 uppercase tracking-widest font-medium mb-3">
          Share via
        </p>
        <div className="grid grid-cols-2 gap-3 mb-2">
          <a
            href={mailUrl}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-base-200 hover:bg-base-200 transition-colors text-sm text-base-content"
          >
            <span className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <EnvelopeIcon className="w-4 h-4" />
            </span>
            Email
          </a>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-base-200 hover:bg-base-200 transition-colors text-sm text-base-content"
          >
            <span className="w-8 h-8 rounded-xl bg-green-100 text-green-600 flex items-center justify-center shrink-0">
              <FaWhatsapp className="w-4 h-4" />
            </span>
            WhatsApp
          </a>

          <button
            onClick={() => setQrVisible(!qrVisible)}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-colors text-sm text-base-content ${
              qrVisible ? "border-primary bg-primary/5" : "border-base-200 hover:bg-base-200"
            }`}
          >
            <span className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
              <QrCodeIcon className="w-4 h-4" />
            </span>
            QR Code
          </button>

          <button
            onClick={handleNativeShare}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-base-200 hover:bg-base-200 transition-colors text-sm text-base-content"
          >
            <span className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
              <ShareIcon className="w-4 h-4" />
            </span>
            More options
          </button>
        </div>

        {/* QR Code panel */}
        {qrVisible && (
          <div className="flex flex-col items-center gap-3 mt-4 pt-4 border-t border-base-200">
            <img
              src={qrApiUrl}
              alt="QR code for event link"
              className="w-44 h-44 rounded-2xl border border-base-200"
            />
            <p className="text-xs text-base-content/50">Scan to open the event</p>
            <a
              href={qrApiUrl}
              download={`event-${eventId}-qr.png`}
              className="text-xs text-primary hover:underline"
            >
              Download QR image
            </a>
          </div>
        )}

        {/* Success toast */}
        {copied && (
          <div className="mt-4 flex items-center gap-2 bg-success/10 text-success rounded-2xl px-4 py-3 text-sm font-medium">
            <ClipboardDocumentCheckIcon className="w-4 h-4" />
            Link copied to clipboard!
          </div>
        )}
      </div>
    </div>
  );
};

export default ShareEventModal;