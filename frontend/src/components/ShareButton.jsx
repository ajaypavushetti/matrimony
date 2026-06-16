import { useState } from 'react';
import { FiShare2, FiCopy, FiCheck } from 'react-icons/fi';

function ShareButton({ profile }) {
  const [copied, setCopied] = useState(false);

  const generateText = () => {
    const lines = [
      `📋 *Marriage Profile*`,
      `━━━━━━━━━━━━━━━`,
      `👤 Name: ${profile.name || 'N/A'}`,
      `🎂 Age: ${profile.age || 'N/A'}`,
    ];

    if (profile.education && profile.education !== 'NA') {
      lines.push(`📚 Education: ${profile.education}`);
    }
    if (profile.occupation && profile.occupation !== 'NA') {
      const org = profile.organization && profile.organization !== 'NA' ? ` at ${profile.organization}` : '';
      lines.push(`💼 Job: ${profile.occupation}${org}`);
    }
    if (profile.salary && profile.salary !== 'NA') {
      lines.push(`💰 Salary: ₹${profile.salary} (${profile.salaryType || 'Monthly'})`);
    }
    if (profile.village && profile.village !== 'NA') {
      const dist = profile.district && profile.district !== 'NA' ? `, ${profile.district}` : '';
      lines.push(`🏘️ Village: ${profile.village}${dist}`);
    }

    const fatherName = profile.fatherName && profile.fatherName !== 'NA' ? profile.fatherName : '';
    const motherName = profile.motherName && profile.motherName !== 'NA' ? profile.motherName : '';
    if (fatherName || motherName) {
      lines.push(`👨‍👩‍👧 Family: ${fatherName ? `Father - ${fatherName}` : ''}${fatherName && motherName ? ', ' : ''}${motherName ? `Mother - ${motherName}` : ''}`);
    }

    if (profile.assets && profile.assets !== 'NA') {
      lines.push(`🏠 Assets: ${profile.assets}`);
    }
    if (profile.maritalStatus) {
      lines.push(`💍 Marriage Type: ${profile.maritalStatus}`);
    }

    lines.push(`━━━━━━━━━━━━━━━`);
    return lines.join('\n');
  };

  const handleWhatsAppShare = () => {
    const text = generateText();
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
