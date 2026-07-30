'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function CardDesignerPage() {
  const [tier, setTier] = useState('Select'); // 'Signature', 'Preferred', 'Select'
  
  // Layout state
  const [textTranslateY, setTextTranslateY] = useState(560);
  const [textTranslateX, setTextTranslateX] = useState(130);
  const [qrTranslateY, setQrTranslateY] = useState(560);
  const [qrTranslateX, setQrTranslateX] = useState(590);

  // Color state
  const [signatureTextColor, setSignatureTextColor] = useState('#4a3b1a');
  const [signatureNameColor, setSignatureNameColor] = useState('#29200e');
  const [preferredTextColor, setPreferredTextColor] = useState('#3f3f46');
  const [preferredNameColor, setPreferredNameColor] = useState('#18181b');
  const [selectTextColor, setSelectTextColor] = useState('#1e293b');
  const [selectNameColor, setSelectNameColor] = useState('#0f172a');
  
  // Custom Backgrounds
  const [signatureBgUrl, setSignatureBgUrl] = useState('');
  const [preferredBgUrl, setPreferredBgUrl] = useState('');
  const [selectBgUrl, setSelectBgUrl] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function loadSettings() {
      try {
        const layoutRef = doc(db, 'settings', 'cardLayout');
        const layoutSnap = await getDoc(layoutRef);
        if (layoutSnap.exists()) {
          const layout = layoutSnap.data();
          if (layout.textTranslateY !== undefined) setTextTranslateY(Number(layout.textTranslateY));
          if (layout.textTranslateX !== undefined) setTextTranslateX(Number(layout.textTranslateX));
          if (layout.qrTranslateY !== undefined) setQrTranslateY(Number(layout.qrTranslateY));
          if (layout.qrTranslateX !== undefined) setQrTranslateX(Number(layout.qrTranslateX));
          
          if (layout.signatureTextColor) setSignatureTextColor(layout.signatureTextColor);
          if (layout.signatureNameColor) setSignatureNameColor(layout.signatureNameColor);
          if (layout.preferredTextColor) setPreferredTextColor(layout.preferredTextColor);
          if (layout.preferredNameColor) setPreferredNameColor(layout.preferredNameColor);
          if (layout.selectTextColor) setSelectTextColor(layout.selectTextColor);
          if (layout.selectNameColor) setSelectNameColor(layout.selectNameColor);

          if (layout.signatureBgUrl) setSignatureBgUrl(layout.signatureBgUrl);
          if (layout.preferredBgUrl) setPreferredBgUrl(layout.preferredBgUrl);
          if (layout.selectBgUrl) setSelectBgUrl(layout.selectBgUrl);
        }
      } catch (err) {
        console.error('Error loading settings', err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const layoutRef = doc(db, 'settings', 'cardLayout');
      await setDoc(layoutRef, {
        textTranslateY,
        textTranslateX,
        qrTranslateY,
        qrTranslateX,
        signatureTextColor,
        signatureNameColor,
        preferredTextColor,
        preferredNameColor,
        selectTextColor,
        selectNameColor,
        signatureBgUrl,
        preferredBgUrl,
        selectBgUrl
      }, { merge: true });
      setMessage('Settings saved successfully!');
    } catch (err) {
      console.error(err);
      setMessage('Error saving settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleRegenerate = async () => {
    setRegenerating(true);
    setMessage('');
    try {
      const res = await fetch('/api/membership/regenerate-cards');
      if (res.ok) {
        setMessage('Successfully regenerated all cards! Allow up to 5 minutes for CDN caches to clear.');
      } else {
        setMessage('Error regenerating cards.');
      }
    } catch (err) {
      console.error(err);
      setMessage('Error regenerating cards.');
    } finally {
      setRegenerating(false);
    }
  };

  const handleUploadBg = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMessage('Uploading template image...');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/cms/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setMessage('Upload successful! Remember to click Save.');
        if (tier === 'Signature') setSignatureBgUrl(data.url);
        if (tier === 'Preferred') setPreferredBgUrl(data.url);
        if (tier === 'Select') setSelectBgUrl(data.url);
      } else {
        setMessage('Upload failed.');
      }
    } catch (err) {
      console.error(err);
      setMessage('Upload error.');
    }
  };

  if (loading) return <div className="p-10 text-white">Loading...</div>;

  // Determine current colors based on selected tier preview
  const currentTextColor = tier === 'Signature' ? signatureTextColor : tier === 'Preferred' ? preferredTextColor : selectTextColor;
  const currentNameColor = tier === 'Signature' ? signatureNameColor : tier === 'Preferred' ? preferredNameColor : selectNameColor;
  
  let templateImage = tier === 'Signature' ? '/templates/signature.jpg' : tier === 'Preferred' ? '/templates/preferred.jpg' : '/templates/select.png';
  if (tier === 'Signature' && signatureBgUrl) templateImage = signatureBgUrl;
  if (tier === 'Preferred' && preferredBgUrl) templateImage = preferredBgUrl;
  if (tier === 'Select' && selectBgUrl) templateImage = selectBgUrl;

  return (
    <div className="min-h-screen bg-neutral-900 p-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
        
        {/* Left: Controls */}
        <div className="w-full lg:w-1/3 bg-neutral-800 rounded-2xl p-6 shadow-xl border border-white/10 text-white flex flex-col gap-6">
          <div>
            <h1 className="text-2xl font-bold">Card Designer</h1>
            <p className="text-sm text-neutral-400 mt-1">Adjust text and QR code placement for all custom background templates.</p>
          </div>

          <div className="flex bg-neutral-900 rounded-lg p-1 gap-1">
            {['Signature', 'Preferred', 'Select'].map(t => (
              <button 
                key={t}
                onClick={() => setTier(t)}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${tier === t ? 'bg-indigo-600 text-white' : 'text-neutral-400 hover:text-white'}`}
              >
                {t}
              </button>
            ))}
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold">Custom Background Image</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={handleUploadBg}
              className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-500 file:text-white hover:file:bg-indigo-600 cursor-pointer"
            />
            {tier === 'Signature' && signatureBgUrl && <div className="text-xs text-green-400 truncate">Using custom: {signatureBgUrl}</div>}
            {tier === 'Preferred' && preferredBgUrl && <div className="text-xs text-green-400 truncate">Using custom: {preferredBgUrl}</div>}
            {tier === 'Select' && selectBgUrl && <div className="text-xs text-green-400 truncate">Using custom: {selectBgUrl}</div>}
          </div>

          {/* Positioning */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold border-b border-white/10 pb-2">Positioning</h2>
            
            <div>
              <label className="text-sm flex justify-between mb-1">Text X Position <span>{textTranslateX}</span></label>
              <input type="range" min="0" max="800" value={textTranslateX} onChange={e => setTextTranslateX(Number(e.target.value))} className="w-full accent-indigo-500" />
            </div>
            <div>
              <label className="text-sm flex justify-between mb-1">Text Y Position <span>{textTranslateY}</span></label>
              <input type="range" min="0" max="800" value={textTranslateY} onChange={e => setTextTranslateY(Number(e.target.value))} className="w-full accent-indigo-500" />
            </div>
            
            <div className="pt-2">
              <label className="text-sm flex justify-between mb-1">QR Code X Position <span>{qrTranslateX}</span></label>
              <input type="range" min="0" max="800" value={qrTranslateX} onChange={e => setQrTranslateX(Number(e.target.value))} className="w-full accent-indigo-500" />
            </div>
            <div>
              <label className="text-sm flex justify-between mb-1">QR Code Y Position <span>{qrTranslateY}</span></label>
              <input type="range" min="0" max="800" value={qrTranslateY} onChange={e => setQrTranslateY(Number(e.target.value))} className="w-full accent-indigo-500" />
            </div>
          </div>

          {/* Colors */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold border-b border-white/10 pb-2">{tier} Colors</h2>
            
            <div className="flex items-center justify-between">
              <label className="text-sm">Main Text Color</label>
              <input 
                type="color" 
                value={tier === 'Signature' ? signatureTextColor : tier === 'Preferred' ? preferredTextColor : selectTextColor}
                onChange={e => {
                  if (tier === 'Signature') setSignatureTextColor(e.target.value);
                  if (tier === 'Preferred') setPreferredTextColor(e.target.value);
                  if (tier === 'Select') setSelectTextColor(e.target.value);
                }}
                className="w-10 h-10 rounded cursor-pointer bg-transparent border-0 p-0"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm">Name / Bold Text Color</label>
              <input 
                type="color" 
                value={tier === 'Signature' ? signatureNameColor : tier === 'Preferred' ? preferredNameColor : selectNameColor}
                onChange={e => {
                  if (tier === 'Signature') setSignatureNameColor(e.target.value);
                  if (tier === 'Preferred') setPreferredNameColor(e.target.value);
                  if (tier === 'Select') setSelectNameColor(e.target.value);
                }}
                className="w-10 h-10 rounded cursor-pointer bg-transparent border-0 p-0"
              />
            </div>
          </div>

          <div className="pt-4 flex flex-col gap-3 mt-auto">
            {message && <div className="text-sm text-green-400 p-2 bg-green-400/10 rounded">{message}</div>}
            <button 
              onClick={handleSave} 
              disabled={saving}
              className="w-full py-3 bg-white text-black font-semibold rounded-xl hover:bg-neutral-200 transition-colors"
            >
              {saving ? 'Saving...' : '1. Save Layout'}
            </button>
            <button 
              onClick={handleRegenerate} 
              disabled={regenerating}
              className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
            >
              {regenerating ? 'Regenerating...' : '2. Apply & Regenerate All Cards'}
            </button>
          </div>
        </div>

        {/* Right: Live Preview */}
        <div className="w-full lg:w-2/3 flex items-center justify-center bg-black/50 rounded-2xl p-8 border border-white/5 relative overflow-hidden">
          <div className="w-full max-w-[450px] relative">
            <div className="relative w-full aspect-[900/920] rounded-[22px] overflow-hidden shadow-2xl ring-1 ring-white/10">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 920" width="100%" height="100%" className="absolute inset-0 w-full h-full">
                <defs>
                  <clipPath id="cardClip">
                    <rect x="20" y="20" width="860" height="880" rx="44" />
                  </clipPath>
                  <style>
                    {`
                      .member-name { font-family: 'Georgia', 'Times New Roman', serif; font-weight: 500; font-size: 32px; fill: ${currentNameColor}; }
                      .member-plan { font-family: 'Georgia', 'Times New Roman', serif; font-weight: 400; font-size: 24px; fill: ${currentTextColor}; }
                      .lbl { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-weight: 500; font-size: 16px; fill: ${currentTextColor}; }
                      .val { font-family: 'Georgia', 'Times New Roman', serif; font-weight: 500; font-size: 20px; fill: ${currentNameColor}; }
                      .scan-lbl { font-family: 'Times New Roman', 'Georgia', serif; font-weight: 700; font-size: 13px; fill: ${currentNameColor}; letter-spacing: 1px; }
                    `}
                  </style>
                </defs>
                
                {/* Image background */}
                <image href={templateImage} x="20" y="20" width="860" height="880" preserveAspectRatio="xMidYMin slice" clipPath="url(#cardClip)" />
                
                {/* Details */}
                <g transform={`translate(${textTranslateX}, ${textTranslateY})`}>
                  <text x="0" y="0" className="member-name">Mukesh Laudya</text>
                  <text x="0" y="38" className="member-plan">{tier} Member</text>
                  <g transform="translate(0, 100)">
                    <text x="0" y="0" className="lbl">One ID</text>
                    <text x="0" y="28" className="val">AIRO1000001</text>
                    <text x="170" y="0" className="lbl">Valid Until</text>
                    <text x="170" y="28" className="val">July 28 2027</text>
                  </g>
                </g>

                {/* QR */}
                <g transform={`translate(${qrTranslateX}, ${qrTranslateY})`}>
                  <text x="50" y="-15" className="scan-lbl" textAnchor="middle">SCAN</text>
                  {/* Mock QR box */}
                  <rect x="-10" y="-10" width="120" height="120" fill="white" rx="8" />
                  <rect x="0" y="0" width="100" height="100" fill="black" />
                </g>
              </svg>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
