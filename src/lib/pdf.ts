import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import QRCode from 'qrcode';

interface LocalCertInfo {
    course_id: string;
    course_title: string;
    final_score: number;
    verification_code: string;
    issued_at: string;
}

export const generateCertificatePDF = async (cert: LocalCertInfo, userName: string) => {
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // --- Background Layer ---
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // --- Luxury Borders ---
    doc.setDrawColor(44, 24, 16);
    doc.setLineWidth(5);
    doc.rect(0, 0, pageWidth, pageHeight, 'S');

    doc.setDrawColor(210, 153, 20);
    doc.setLineWidth(0.5);
    doc.rect(8, 8, pageWidth - 16, pageHeight - 16);
    doc.setLineWidth(0.2);
    doc.rect(12, 12, pageWidth - 24, pageHeight - 24);

    // --- Branding Section ---
    const centerX = pageWidth / 2;

    doc.setFillColor(30, 41, 59);
    doc.circle(centerX, 30, 10, 'F');
    doc.setDrawColor(250, 200, 50);
    doc.setLineWidth(1);
    doc.circle(centerX, 30, 10, 'S');

    // Branding Text
    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('SKILLFLASH INTERNATIONAL ACADEMY', centerX, 50, { align: 'center', charSpace: 1.5 });

    doc.setTextColor(44, 24, 16);
    doc.setFont('times', 'bold');
    doc.setFontSize(38);
    doc.text('CERTIFICAT D\'ACHÈVEMENT', centerX, 68, { align: 'center' });

    // --- Body Section ---
    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(14);
    doc.text('Ce document atteste solennellement que', centerX, 92, { align: 'center' });

    doc.setTextColor(15, 23, 42);
    doc.setFont('times', 'bolditalic');
    doc.setFontSize(48);
    doc.text(userName.toUpperCase(), centerX, 115, { align: 'center' });

    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(14);
    doc.text('a validé avec distinction l\'intégralité du programme d\'expertise', centerX, 135, { align: 'center' });

    doc.setTextColor(37, 99, 235);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(28);
    doc.text(cert.course_title.toUpperCase(), centerX, 152, { align: 'center' });

    // --- Footer Section ---
    const footerY = pageHeight - 35;

    doc.setTextColor(148, 163, 184);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.text('DATE DE DÉLIVRANCE', 35, footerY);

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(10);
    const date = new Date(cert.issued_at).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    doc.text(date, 35, footerY + 6);
    doc.text('SkillFlash Certificat Offline', 35, footerY + 18);

    // Right: QR Code & Verification ID
    doc.setTextColor(148, 163, 184);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.text('VÉRIFICATION NUMÉRIQUE', pageWidth - 70, footerY);

    const verificationUrl = `${window.location.origin}/catalog`;
    try {
        const qrDataUrl = await QRCode.toDataURL(verificationUrl, {
            margin: 0,
            width: 80,
            color: { dark: '#1e293b', light: '#ffffff' }
        });
        doc.addImage(qrDataUrl, 'PNG', pageWidth - 70, footerY + 2, 20, 20);
    } catch (err) {
        console.error('QR Code generation failed', err);
    }

    doc.setTextColor(148, 163, 184);
    doc.setFont('courier', 'bold');
    doc.setFontSize(6);
    doc.text(cert.verification_code, pageWidth - 70, footerY + 24);

    doc.save(`CERT_SF_${cert.course_id}_${userName.replace(/\s+/g, '_')}.pdf`);
};
