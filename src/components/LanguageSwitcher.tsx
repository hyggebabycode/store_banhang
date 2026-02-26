import { Globe } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2 bg-zinc-100 hover:bg-zinc-200 rounded-xl px-3 py-2 transition-colors border border-zinc-200">
      <Globe className="w-4 h-4 text-zinc-600" />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as "en" | "vi")}
        className="bg-transparent text-zinc-700 text-sm font-bold border-none outline-none cursor-pointer"
      >
        <option value="en">🇺🇸 EN</option>
        <option value="vi">🇻🇳 VI</option>
      </select>
    </div>
  );
};
