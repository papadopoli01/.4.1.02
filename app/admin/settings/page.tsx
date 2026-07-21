'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { Save, Image as ImageIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

interface AppSettings {
  companyName: string;
  logoUrl?: string;
  faviconUrl?: string;
  whatsapp: string;
  instagram: string;
  linkedin: string;
  email: string;
  address: string;
  businessHours: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
}

const defaultSettings: AppSettings = {
  companyName: '', whatsapp: '', instagram: '', linkedin: '', email: '', 
  address: '', businessHours: '', seoTitle: '', seoDescription: '', seoKeywords: ''
};

export default function SettingsAdmin() {
  const { userData } = useAuth();
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const docRef = doc(db, 'settings', userData?.companyId || 'default');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSettings({ ...defaultSettings, ...docSnap.data() } as AppSettings);
        }
      } catch (error) {
        toast.error('Erro ao buscar configurações');
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, [userData]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', userData?.companyId || 'default'), settings);
      toast.success('Configurações salvas com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'favicon') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'logo') setUploadingLogo(true);
    else setUploadingFavicon(true);

    try {
      const fileRef = ref(storage, `${userData?.companyId || 'default'}/settings/${type}_${Date.now()}_${file.name}`);
      const uploadTask = await uploadBytesResumable(fileRef, file);
      const url = await getDownloadURL(uploadTask.ref);
      
      setSettings(prev => ({
        ...prev,
        [type === 'logo' ? 'logoUrl' : 'faviconUrl']: url
      }));
      toast.success(`${type === 'logo' ? 'Logo' : 'Favicon'} atualizado!`);
    } catch (err) {
      toast.error(`Erro ao fazer upload do ${type}`);
    } finally {
      if (type === 'logo') setUploadingLogo(false);
      else setUploadingFavicon(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Configurações do Site</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Gerencie informações gerais, redes sociais e SEO.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Identidade Visual */}
        <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h3 className="text-lg font-bold border-b border-slate-200 dark:border-slate-800 pb-4">Identidade Visual</h3>
          
          <div className="space-y-4">
            <label className="text-sm font-medium">Nome da Empresa</label>
            <input 
              value={settings.companyName} 
              onChange={e => setSettings({...settings, companyName: e.target.value})} 
              className="w-full p-3 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-xl outline-none focus:border-blue-500 transition-colors" 
              placeholder="Ex: Nexora Studios"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="text-sm font-medium block">Logo</label>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center relative overflow-hidden shrink-0">
                  {settings.logoUrl ? (
                    <Image src={settings.logoUrl} alt="Logo" fill className="object-contain p-2" />
                  ) : (
                    <ImageIcon className="text-slate-400" />
                  )}
                </div>
                <label className="cursor-pointer px-4 py-2 border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:text-blue-500 rounded-lg text-sm font-medium transition-colors">
                  <input type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, 'logo')} disabled={uploadingLogo} />
                  {uploadingLogo ? 'Carregando...' : 'Alterar Logo'}
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-medium block">Favicon</label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center relative overflow-hidden shrink-0">
                  {settings.faviconUrl ? (
                    <Image src={settings.faviconUrl} alt="Favicon" fill className="object-contain p-2" />
                  ) : (
                    <ImageIcon className="text-slate-400" />
                  )}
                </div>
                <label className="cursor-pointer px-4 py-2 border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:text-blue-500 rounded-lg text-sm font-medium transition-colors">
                  <input type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, 'favicon')} disabled={uploadingFavicon} />
                  {uploadingFavicon ? 'Carregando...' : 'Alterar Favicon'}
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Contato & Localização */}
        <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h3 className="text-lg font-bold border-b border-slate-200 dark:border-slate-800 pb-4">Contato & Localização</h3>
          
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">WhatsApp</label>
              <input value={settings.whatsapp} onChange={e => setSettings({...settings, whatsapp: e.target.value})} className="w-full p-3 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-xl outline-none focus:border-blue-500 transition-colors" placeholder="+55 11 99999-9999" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">E-mail</label>
              <input value={settings.email} onChange={e => setSettings({...settings, email: e.target.value})} className="w-full p-3 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-xl outline-none focus:border-blue-500 transition-colors" placeholder="contato@empresa.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Instagram</label>
              <input value={settings.instagram} onChange={e => setSettings({...settings, instagram: e.target.value})} className="w-full p-3 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-xl outline-none focus:border-blue-500 transition-colors" placeholder="@empresa" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">LinkedIn</label>
              <input value={settings.linkedin} onChange={e => setSettings({...settings, linkedin: e.target.value})} className="w-full p-3 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-xl outline-none focus:border-blue-500 transition-colors" placeholder="linkedin.com/company/empresa" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Endereço</label>
            <textarea value={settings.address} onChange={e => setSettings({...settings, address: e.target.value})} className="w-full p-3 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-xl outline-none focus:border-blue-500 transition-colors resize-none" rows={2} placeholder="Rua Exemplo, 123 - São Paulo, SP" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Horário de Atendimento</label>
            <input value={settings.businessHours} onChange={e => setSettings({...settings, businessHours: e.target.value})} className="w-full p-3 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-xl outline-none focus:border-blue-500 transition-colors" placeholder="Seg a Sex, 09h às 18h" />
          </div>
        </div>

        {/* SEO */}
        <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h3 className="text-lg font-bold border-b border-slate-200 dark:border-slate-800 pb-4">Otimização de Buscas (SEO)</h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Título da Página Inicial</label>
              <input value={settings.seoTitle} onChange={e => setSettings({...settings, seoTitle: e.target.value})} className="w-full p-3 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-xl outline-none focus:border-blue-500 transition-colors" placeholder="Nome da Empresa | Frase de Efeito" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Descrição (Meta Description)</label>
              <textarea value={settings.seoDescription} onChange={e => setSettings({...settings, seoDescription: e.target.value})} className="w-full p-3 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-xl outline-none focus:border-blue-500 transition-colors resize-none" rows={3} placeholder="Breve descrição dos serviços da empresa (aparece no Google)." />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Palavras-chave</label>
              <input value={settings.seoKeywords} onChange={e => setSettings({...settings, seoKeywords: e.target.value})} className="w-full p-3 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-xl outline-none focus:border-blue-500 transition-colors" placeholder="Criação de sites, marketing digital, agência (separadas por vírgula)" />
            </div>
          </div>
        </div>

        <div className="flex justify-end sticky bottom-6 z-10">
          <button 
            type="submit" 
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-blue-500/25 disabled:opacity-70"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Salvar Configurações
          </button>
        </div>
      </form>
    </div>
  );
}
