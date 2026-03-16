import { MessageCircle, Phone, Mail, ChevronUp, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const FloatingButtons = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Contact Methods Popup */}
      {contactOpen && (
        <div className="fixed bottom-24 right-6 z-50 bg-background rounded-lg shadow-xl border p-4 w-80 animate-fade-in">
          <button
            onClick={() => setContactOpen(false)}
            className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
          >
            <X size={20} />
          </button>
          
          <div className="space-y-3 pr-4">
            {/* Chat Messenger */}
            <a
              href="https://www.facebook.com/unicoffeeroastery"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-white fill-current">
                  <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.936 1.444 5.544 3.683 7.226V22l3.358-1.85c.893.248 1.84.383 2.828.383l.131-.001C17.523 20.532 22 16.387 22 11.243S17.523 2 12 2zm1.197 12.517l-2.758-2.944-5.38 2.944 5.916-6.274 2.827 2.944 5.31-2.944-5.915 6.274z"/>
                </svg>
              </div>
              <span className="font-medium text-foreground">Chat Messenger</span>
            </a>

            {/* Chat Zalo */}
            <a
              href="https://zalo.me/0909429323"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">Zalo</span>
              </div>
              <span className="font-medium text-foreground">Chat Zalo</span>
            </a>

            {/* Register & Leave Message */}
            {/* <Link
              to="/guest/contact"
              onClick={() => setContactOpen(false)}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <span className="font-medium text-foreground">Đăng kí thông tin và để lại lời nhắn</span>
            </Link> */}

            {/* Call Now */}
            <a
              href="tel:0909429323"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium text-foreground">Gọi ngay</span>
            </a>
          </div>
        </div>
      )}

      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {/* Contact Button / Close Button */}
        <button
          onClick={() => setContactOpen(!contactOpen)}
          className={`floating-btn ${contactOpen ? 'bg-primary' : 'bg-primary'} text-primary-foreground`}
          title="Liên hệ"
        >
          {contactOpen ? (
            <X size={24} />
          ) : (
            <div className="text-center">
              <MessageCircle size={18} />
              <span className="text-[8px] block mt-0.5">Liên hệ</span>
            </div>
          )}
        </button>

        {/* Scroll to Top */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="floating-btn bg-foreground text-background animate-fade-in"
            title="Lên đầu trang"
          >
            <ChevronUp size={24} />
          </button>
        )}
      </div>
    </>
  );
};

export default FloatingButtons;
