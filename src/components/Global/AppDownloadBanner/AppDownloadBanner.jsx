import { useState, useEffect } from "react";
import { X, Download, Smartphone } from "lucide-react";

const AppDownloadBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if user is on mobile device
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
        userAgent.toLowerCase()
      );
      setIsMobile(isMobileDevice);
    };

    checkMobile();

    // Check if banner was previously dismissed (permanently)
    const bannerDismissed = localStorage.getItem("appDownloadBannerDismissed");

    if (!bannerDismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("appDownloadBannerDismissed", "true");
  };

  const handleDownload = () => {
    // Replace with your actual APK download URL
    const apkUrl = "https://api.cmdanigeria.net/downloads/cmda-mobile.apk";
    window.open(apkUrl, "_blank");
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg animate-slideDown">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Icon and Content */}
          <div className="flex items-center gap-3 flex-1">
            <div className="hidden sm:flex items-center justify-center w-12 h-12 bg-white/20 rounded-full flex-shrink-0">
              <Smartphone className="w-6 h-6" />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm sm:text-base mb-0.5">Get the CMDA Nigeria Mobile App</h3>
              <p className="text-xs sm:text-sm text-blue-100 line-clamp-1">
                {isMobile ? "Download now for a better mobile experience" : "Access CMDA on-the-go with our mobile app"}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold text-sm whitespace-nowrap"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download APK</span>
              <span className="sm:hidden">Download</span>
            </button>

            <button
              onClick={handleDismiss}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Dismiss banner"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppDownloadBanner;
