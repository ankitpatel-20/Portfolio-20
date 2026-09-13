import React, { useState, useEffect } from 'react';
import {
  SocialLinkItem,
  DEFAULT_SOCIAL_LINKS,
  loadSavedSocials,
  saveSocials,
} from '../utils/portfolioStorage';
import {
  ExternalLink,
  Copy,
  Check,
  Edit3,
  RotateCcw,
  Plus,
  Trash2,
  Share2,
  Globe,
  Github,
  Linkedin,
  Twitter,
  Mail,
  Award,
  Sparkles,
  Terminal,
  BookOpen,
  MessageSquare,
  Instagram,
  Send,
  X,
  Save,
} from 'lucide-react';
import { NavigationTab } from '../types';

interface SocialsSectionProps {
  setActiveTab: (tab: NavigationTab) => void;
}

export const SocialsSection: React.FC<SocialsSectionProps> = ({ setActiveTab }) => {
  const [socials, setSocials] = useState<SocialLinkItem[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);
  const [editList, setEditList] = useState<SocialLinkItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  useEffect(() => {
    setSocials(loadSavedSocials());
  }, []);

  const handleCopyHandle = (item: SocialLinkItem) => {
    navigator.clipboard.writeText(item.handle || item.url);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenEditModal = () => {
    setEditList(JSON.parse(JSON.stringify(socials)));
    setIsEditingModalOpen(true);
  };

  const handleSaveEdits = () => {
    setSocials(editList);
    saveSocials(editList);
    setIsEditingModalOpen(false);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all social links to default settings?')) {
      setSocials(DEFAULT_SOCIAL_LINKS);
      saveSocials(DEFAULT_SOCIAL_LINKS);
      setEditList(DEFAULT_SOCIAL_LINKS);
      setIsEditingModalOpen(false);
    }
  };

  const handleUpdateItem = (index: number, field: keyof SocialLinkItem, value: string) => {
    const updated = [...editList];
    updated[index] = { ...updated[index], [field]: value };
    setEditList(updated);
  };

  const handleAddNewLink = () => {
    const newItem: SocialLinkItem = {
      id: `custom-${Date.now()}`,
      platform: 'New Platform',
      handle: '@handle',
      url: 'https://',
      category: 'Professional',
      icon: 'globe',
      badge: 'Custom Link',
      description: 'Custom social or developer channel profile.',
    };
    setEditList([...editList, newItem]);
  };

  const handleDeleteItem = (index: number) => {
    const updated = editList.filter((_, idx) => idx !== index);
    setEditList(updated);
  };

  const getPlatformIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'github':
        return <Github className="w-5 h-5 text-black" />;
      case 'linkedin':
        return <Linkedin className="w-5 h-5 text-black" />;
      case 'twitter':
        return <Twitter className="w-5 h-5 text-black" />;
      case 'instagram':
        return <Instagram className="w-5 h-5 text-black" />;
      case 'telegram':
      case 'send':
        return <Send className="w-5 h-5 text-black" />;
      case 'mail':
        return <Mail className="w-5 h-5 text-black" />;
      case 'award':
        return <Award className="w-5 h-5 text-black" />;
      case 'book-open':
        return <BookOpen className="w-5 h-5 text-black" />;
      case 'message-square':
        return <MessageSquare className="w-5 h-5 text-black" />;
      case 'sparkles':
        return <Sparkles className="w-5 h-5 text-black" />;
      case 'terminal':
        return <Terminal className="w-5 h-5 text-black" />;
      default:
        return <Globe className="w-5 h-5 text-black" />;
    }
  };

  const categories = ['ALL', 'Professional', 'Code & Models', 'Writing & Content', 'Direct'];
  const filteredSocials =
    selectedCategory === 'ALL'
      ? socials
      : socials.filter((s) => s.category === selectedCategory);

  return (
    <section id="socials-screen" className="py-16 px-6 sm:px-12 max-w-[1280px] mx-auto min-h-screen relative">
      {/* Giant Watermark */}
      <div className="absolute top-10 right-10 text-[180px] sm:text-[240px] font-black opacity-[0.03] leading-none select-none pointer-events-none text-black">
        07
      </div>

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 relative z-10 border-b-2 border-black pb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[10px] uppercase tracking-[0.3em] font-black bg-[#00FF00] text-black px-2.5 py-1 border border-black">
              VOLUME 01 // 06. NETWORK
            </span>
            <span className="text-xs font-mono font-bold text-[#52525B]">SOCIAL HUB & CHANNELS</span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-black text-black tracking-tighter uppercase leading-none">
            Social & Direct Links
          </h2>
          <p className="text-[#52525B] text-base max-w-2xl font-medium mt-3">
            Connect with Ankit across developer communities, machine learning repositories, research writing, and professional networks. All links are live and customizable.
          </p>
        </div>

        {/* Customizer Action Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenEditModal}
            className="px-4 py-2.5 bg-black hover:bg-[#00FF00] hover:text-black text-white border-2 border-black text-xs font-mono font-black flex items-center gap-2 transition-all shadow-[4px_4px_0px_#000000] cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>EDIT / CUSTOMIZE LINKS</span>
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 mb-8 relative z-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 border-2 border-black text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-black text-white shadow-[2px_2px_0px_#000000]'
                : 'bg-white text-black hover:bg-[#F4F4F5]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Social Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10 mb-12">
        {filteredSocials.map((item) => (
          <div
            key={item.id}
            className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_#000000] hover:shadow-[8px_8px_0px_#000000] transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Card Top Row */}
              <div className="flex items-start justify-between gap-3 pb-4 mb-4 border-b-2 border-black">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 border-2 border-black bg-[#F9F9F9] flex items-center justify-center group-hover:bg-[#00FF00] transition-colors">
                    {getPlatformIcon(item.icon)}
                  </div>
                  <div>
                    <h3 className="font-black text-base uppercase text-black">{item.platform}</h3>
                    <span className="text-[10px] font-mono font-bold text-[#52525B] uppercase block">
                      {item.category}
                    </span>
                  </div>
                </div>
                {item.badge && (
                  <span className="text-[9px] font-mono font-bold px-2 py-0.5 bg-[#00FF00] border border-black uppercase text-black shrink-0">
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Handle Box */}
              <div className="p-2.5 bg-[#F9F9F9] border-2 border-black flex items-center justify-between mb-3">
                <span className="font-mono text-xs font-bold text-black truncate">{item.handle}</span>
                <button
                  onClick={() => handleCopyHandle(item)}
                  className="p-1 hover:bg-black hover:text-white border border-black transition-colors cursor-pointer text-xs shrink-0"
                  title="Copy Handle"
                >
                  {copiedId === item.id ? (
                    <Check className="w-3.5 h-3.5 text-[#00AA00]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-black" />
                  )}
                </button>
              </div>

              {/* Description */}
              <p className="text-xs text-[#52525B] font-medium leading-relaxed mb-4">
                {item.description}
              </p>
            </div>

            {/* Visit Link Button */}
            <a
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 bg-black text-white hover:bg-[#00FF00] hover:text-black border-2 border-black font-mono text-xs font-black uppercase flex items-center justify-center gap-2 transition-all shadow-[2px_2px_0px_#000000]"
            >
              <span>VISIT {item.platform.toUpperCase()}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        ))}
      </div>

      {/* Edit Social Links Modal */}
      {isEditingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white border-4 border-black w-full max-w-3xl max-h-[90vh] flex flex-col shadow-[12px_12px_0px_#000000] animate-fadeIn">
            {/* Modal Header */}
            <div className="p-6 border-b-2 border-black flex items-center justify-between bg-[#F9F9F9]">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-[#52525B]">
                  CUSTOMIZATION ENGINE
                </span>
                <h3 className="text-2xl font-black text-black uppercase">Edit Social Media & Channels</h3>
              </div>
              <button
                onClick={() => setIsEditingModalOpen(false)}
                className="p-1.5 bg-black text-white hover:bg-[#00FF00] hover:text-black border-2 border-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Form Rows */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              <p className="text-xs text-[#52525B] font-medium">
                Update your usernames, target profile URLs, and platform descriptions. Changes will be saved locally and reflected across all social cards.
              </p>

              <div className="space-y-4">
                {editList.map((item, idx) => (
                  <div key={item.id || idx} className="p-4 bg-[#F9F9F9] border-2 border-black space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-black text-black uppercase">
                        #{idx + 1} // {item.platform}
                      </span>
                      <button
                        onClick={() => handleDeleteItem(idx)}
                        className="text-red-500 hover:text-red-700 p-1 flex items-center gap-1 text-[11px] font-mono font-bold cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>REMOVE</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                      <div>
                        <label className="block font-bold text-black mb-1">PLATFORM NAME:</label>
                        <input
                          type="text"
                          value={item.platform}
                          onChange={(e) => handleUpdateItem(idx, 'platform', e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border-2 border-black font-bold focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-black mb-1">HANDLE / USERNAME:</label>
                        <input
                          type="text"
                          value={item.handle}
                          onChange={(e) => handleUpdateItem(idx, 'handle', e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border-2 border-black font-bold focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-black mb-1">FULL URL:</label>
                        <input
                          type="text"
                          value={item.url}
                          onChange={(e) => handleUpdateItem(idx, 'url', e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border-2 border-black font-bold focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-black mb-1">BADGE TEXT:</label>
                        <input
                          type="text"
                          value={item.badge || ''}
                          onChange={(e) => handleUpdateItem(idx, 'badge', e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border-2 border-black font-bold focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-mono text-xs font-bold text-black mb-1">DESCRIPTION:</label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleUpdateItem(idx, 'description', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border-2 border-black font-mono text-xs font-bold focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Link Button */}
              <button
                onClick={handleAddNewLink}
                className="w-full py-3 bg-white hover:bg-[#F9F9F9] border-2 border-dashed border-black font-mono text-xs font-black uppercase flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>ADD ANOTHER SOCIAL CHANNEL</span>
              </button>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-6 border-t-2 border-black bg-[#F9F9F9] flex flex-wrap items-center justify-between gap-4">
              <button
                onClick={handleResetDefaults}
                className="px-4 py-2 bg-white hover:bg-red-50 text-red-600 border-2 border-red-600 font-mono text-xs font-black uppercase flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>RESET ALL DEFAULTS</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsEditingModalOpen(false)}
                  className="px-4 py-2 bg-white border-2 border-black font-mono text-xs font-bold uppercase cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleSaveEdits}
                  className="px-6 py-2 bg-black hover:bg-[#00FF00] hover:text-black text-white border-2 border-black font-mono text-xs font-black uppercase flex items-center gap-2 shadow-[2px_2px_0px_#000000] cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>SAVE SOCIAL CHANGES</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
