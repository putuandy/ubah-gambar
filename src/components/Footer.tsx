import { useTheme } from "./theme-provider";

export default function Footer() {
    const { theme } = useTheme();
    return (
        <footer className={`border-t ${theme === "dark" ? "border-gray-800" : "border-gray-200"} py-6 fixed bottom-0 left-0 w-full bg-card`}>
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-center md:justify-between items-center text-sm text-gray-400">
                    <div className="flex gap-6 mb-4 md:mb-0">
                    <a href="/how-to-use" className={`${theme === "dark" ? "hover:text-white" : "hover:text-gray-900"}`}>
                        How to use?
                    </a>
                    <a href="/terms-and-conditions" className={`${theme === "dark" ? "hover:text-white" : "hover:text-gray-900"}`}>
                        Terms & Conditions
                    </a>
                    <a href="/privacy-policy" className={`${theme === "dark" ? "hover:text-white" : "hover:text-gray-900"}`}>
                        Privacy Policy
                    </a>
                    {/* <a href="#" className={`${theme === "dark" ? "hover:text-white" : "hover:text-gray-900"}`}>
                        Status
                    </a> */}
                    </div>
                    <div className="flex items-center gap-1">
                    <span>© 2025 All rights reserved</span>
                    <span className="flex items-center">
                        Created by Artyupit Studio
                    </span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

;