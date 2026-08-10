import React, { useState } from 'react';
import { Lock, KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
  currentPin: string;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  currentPin,
}) => {
  const [pinInput, setPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === currentPin) {
      setErrorMsg('');
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setPinInput('');
        onLoginSuccess();
      }, 600);
    } else {
      setErrorMsg('PIN Pentadbir tidak sah! Sila semak semula PIN anda.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#2D241E]/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#E8E2D9] space-y-6 animate-in fade-in zoom-in duration-200">
        
        {/* Header Icon & Title */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-[#3E2723] text-amber-300 rounded-2xl mx-auto flex items-center justify-center shadow-md">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#2D241E]">
            Sahkan Akses Pentadbir (Admin Only)
          </h2>
          <p className="text-xs text-[#8D6E63]">
            Sistem pengurusan keseluruhan kedai (CMS, pesanan, kos & laporan) hanya boleh diakses oleh Admin yang sah.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#3E2723] uppercase tracking-wider mb-1.5 text-center">
              Masukkan PIN Pentadbir / Admin PIN
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-[#8D6E63] absolute left-3.5 top-3" />
              <input
                type="password"
                maxLength={8}
                autoFocus
                placeholder="****"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setErrorMsg('');
                }}
                className="w-full pl-10 pr-4 py-2.5 text-center font-mono font-bold text-lg tracking-widest border border-[#E8E2D9] rounded-xl focus:ring-2 focus:ring-[#5D4037] focus:outline-none bg-[#FAF9F6]"
              />
            </div>
            <p className="text-[11px] text-[#8D6E63] text-center mt-1.5">
              💡 PIN Laluan Laluan Admin: <span className="font-mono font-bold text-[#3E2723]">1234</span>
            </p>
          </div>

          {errorMsg && (
            <div className="bg-red-50 text-red-700 text-xs p-3 rounded-xl border border-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {isSuccess && (
            <div className="bg-emerald-50 text-emerald-800 text-xs p-3 rounded-xl border border-emerald-200 flex items-center gap-2 font-bold justify-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Akses Sah! Membuka Portal Admin...</span>
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl border border-[#E8E2D9] text-xs font-bold text-[#8D6E63] hover:bg-[#EFEBE9] transition-colors"
            >
              Batal / Mod Pelanggan
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#3E2723] hover:bg-[#5D4037] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
            >
              Log Masuk Admin
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
