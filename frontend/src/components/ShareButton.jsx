import { useState } from 'react';
import { FiShare2, FiCopy, FiCheck } from 'react-icons/fi';

function ShareButton({ profile }) {
  const [copied, setCopied] = useState(false);

  const generateText = () => {
    const lines = [
      `📋 *Matrimonial Profile*`,
      `━━━━━━━━━━━━━━━━━━`,
      `👤 *Name:* ${profile.name || 'N/A'}`,
      `🎂 *Age:* ${profile.age || 'N/A'}`,
    ];

    if (profile.height && profile.height !== 'NA') {
      lines.push(`📏 *Height:* ${profile.height}`);
    }

    if (profile.education && profile.education !== 'NA') {
      lines.push(`📚 *Education:* ${profile.education}`);
    }

    // Marital Status (First/Second Marriage + Kids if second)
    if (profile.maritalStatus) {
      if (profile.maritalStatus === 'Second Marriage') {
        const kidsCount = profile.numberOfKids || 0;
        lines.push(`💍 *Marital Status:* Second Marriage (${kidsCount} Kids)`);
      } else {
        lines.push(`💍 *Marital Status:* First Marriage`);
      }
    }

    // Job / Occupation & Salary (only if they work)
    const works = profile.occupation &&
                  profile.occupation !== 'NA' &&
                  profile.occupation.toLowerCase() !== 'none' &&
                  profile.occupation.toLowerCase() !== 'unemployed' &&
                  profile.occupation.toLowerCase() !== 'housewife' &&
                  profile.occupation.toLowerCase() !== 'no job';

    if (works) {
      lines.push(`💼 *Occupation:* ${profile.occupation}`);
      if (profile.organization && profile.organization !== 'NA') {
        lines.push(`🏢 *Company:* ${profile.organization}`);
      }
      if (profile.salary && profile.salary !== 'NA') {
        lines.push(`💰 *Salary:* ₹${profile.salary} (${profile.salaryType || 'Monthly'})`);
      }
    }

    // Father and Mother Details
    const fatherName = profile.fatherName && profile.fatherName !== 'NA' ? profile.fatherName : '';
    const fatherOcc = profile.fatherOccupation && profile.fatherOccupation !== 'NA' ? ` (${profile.fatherOccupation})` : '';
    if (fatherName) {
      lines.push(`👨 *Father:* ${fatherName}${fatherOcc}`);
    }

    const motherName = profile.motherName && profile.motherName !== 'NA' ? profile.motherName : '';
    const motherOcc = profile.motherOccupation && profile.motherOccupation !== 'NA' ? ` (${profile.motherOccupation})` : '';
    if (motherName) {
      lines.push(`👩 *Mother:* ${motherName}${motherOcc}`);
    }

    // Siblings Details
    const siblingDetails = [];
    if (profile.numberOfBrothers > 0) {
      const brotherStatuses = profile.brothers ? profile.brothers.map(b => b.status).join(', ') : '';
      siblingDetails.push(`${profile.numberOfBrothers} Brother(s)${brotherStatuses ? ` [${brotherStatuses}]` : ''}`);
    }
    if (profile.numberOfSisters > 0) {
      const sisterStatuses = profile.sisters ? profile.sisters.map(s => s.status).join(', ') : '';
      siblingDetails.push(`${profile.numberOfSisters} Sister(s)${sisterStatuses ? ` [${sisterStatuses}]` : ''}`);
    }
    if (siblingDetails.length > 0) {
      lines.push(`👥 *Siblings:* ${siblingDetails.join(' & ')}`);
    }

    // Assets Info
    if (profile.assets && profile.assets !== 'NA') {
      lines.push(`🏠 *Assets:* ${profile.assets}`);
    }

    lines.push(`━━━━━━━━━━━━━━━━━━`);
    return lines.join('\n');
  };

  const handleWhatsAppShare = async () => {
    const text = generateText();

    // Check if browser supports sharing files (primarily mobile)
    if (navigator.share && navigator.canShare && profile.photos && profile.photos.length > 0) {
      try {
        const filePromises = profile.photos.slice(0, 4).map(async (photo, idx) => {
          // Cache-busting query to avoid CORS issues
          const response = await fetch(`${photo.url}?t=${Date.now()}`);
          const blob = await response.blob();
          const extension = blob.type.split('/')[1] || 'jpg';
          return new File([blob], `photo_${idx + 1}.${extension}`, { type: blob.type });
        });

        const files = await Promise.all(filePromises);

        if (navigator.canShare({ files })) {
          await navigator.share({
            files: files,
            title: `Matrimonial Profile - ${profile.name}`,
            text: text
          });
          return; // Shared successfully with files!
        }
      } catch (err) {
        console.error('File sharing failed, falling back to text-only share:', err);
      }
    }

    // Fallback: Share as text on WhatsApp (without photo links)
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  const handleCopy = async () => {
    const text = generateText();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="d-flex gap-2">
      <button className="btn btn-gold" onClick={handleWhatsAppShare}>
        <FiShare2 /> WhatsApp
      </button>
      <button className="btn btn-secondary btn-sm" onClick={handleCopy}>
        {copied ? <><FiCheck /> Copied!</> : <><FiCopy /> Copy</>}
      </button>
    </div>
  );
}

export default ShareButton;
