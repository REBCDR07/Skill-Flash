import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import QRCode from 'qrcode';
import { Certification } from '@/types/course';

export const generateCertificatePDF = async (cert: Certification, userName: string) => {
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
    // Outer Border (Subtle #2c1810 with 5% opacity simulated)
    doc.setDrawColor(44, 24, 16);
    doc.setLineWidth(16 / (72 / 25.4)); // ~5.6mm border
    doc.rect(0, 0, pageWidth, pageHeight, 'S');

    // Inner Gold Borders
    doc.setDrawColor(210, 153, 20); // Gold-600 approx
    doc.setLineWidth(0.5);
    doc.rect(8, 8, pageWidth - 16, pageHeight - 16);
    doc.setLineWidth(0.2);
    doc.rect(12, 12, pageWidth - 24, pageHeight - 24);

    // --- Branding Section ---
    const centerX = pageWidth / 2;

    // Zap Icon in Navy Circle
    doc.setFillColor(30, 41, 59); // Navy (#1e293b)
    doc.circle(centerX, 30, 10, 'F');
    doc.setDrawColor(250, 200, 50); // Gold-400 approx
    doc.setLineWidth(1);
    doc.circle(centerX, 30, 10, 'S');

    // Icon (Simple Polylines for Zap)
    doc.setDrawColor(250, 204, 21); // Gold-400
    doc.setLineWidth(0.8);
    doc.line(centerX - 3, 30 + 1, centerX + 1, 30 - 4);
    doc.line(centerX + 1, 30 - 4, centerX, 30);
    doc.line(centerX, 30, centerX + 3, 30 - 1);
    doc.line(centerX + 3, 30 - 1, centerX - 1, 30 + 4);
    doc.line(centerX - 1, 30 + 4, centerX, 30 + 1);
    doc.line(centerX, 30 + 1, centerX - 2, 30 + 1);

    // Branding Text
    doc.setTextColor(100, 116, 139); // Slate-500
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('SKILLFLASH INTERNATIONAL ACADEMY', centerX, 50, { align: 'center', charSpace: 1.5 });

    doc.setTextColor(44, 24, 16); // #2c1810
    doc.setFont('times', 'bold');
    doc.setFontSize(38);
    doc.text('CERTIFICAT D\'ACHÈVEMENT', centerX, 68, { align: 'center' });

    doc.setDrawColor(210, 153, 20);
    doc.setLineWidth(0.8);
    doc.line(centerX - 20, 75, centerX + 20, 75);

    // --- Body Section ---
    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(14);
    doc.text('Ce document atteste solennellement que', centerX, 92, { align: 'center' });

    doc.setTextColor(15, 23, 42); // slate-900
    doc.setFont('times', 'bolditalic');
    doc.setFontSize(48);
    doc.text(userName.toUpperCase(), centerX, 115, { align: 'center' });

    doc.setDrawColor(210, 153, 20);
    doc.setLineWidth(0.3);
    doc.line(centerX - 60, 120, centerX + 60, 120);

    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(14);
    doc.text('a validé avec distinction l\'intégralité du programme d\'expertise', centerX, 135, { align: 'center' });

    doc.setTextColor(37, 99, 235); // Blue-600
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(28);
    doc.text(cert.course_title.toUpperCase(), centerX, 152, { align: 'center' });

    // --- Footer Section ---
    const footerY = pageHeight - 35;

    // Left: Date
    doc.setTextColor(148, 163, 184); // slate-400
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
    doc.text('SkillFlash Certificat', 35, footerY + 18);

    // Right: QR Code & Verification ID
    doc.setTextColor(148, 163, 184);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.text('VÉRIFICATION NUMÉRIQUE', pageWidth - 70, footerY);

    // Generate QR Code
    const verificationUrl = `${window.location.origin}/verify/${cert.verification_code}`;
    try {
        const qrDataUrl = await QRCode.toDataURL(verificationUrl, {
            margin: 0,
            width: 80,
            color: {
                dark: '#1e293b',
                light: '#ffffff'
            }
        });
        doc.addImage(qrDataUrl, 'PNG', pageWidth - 70, footerY + 2, 20, 20);
    } catch (err) {
        console.error('QR Code generation failed', err);
    }

    doc.setTextColor(148, 163, 184);
    doc.setFont('courier', 'bold');
    doc.setFontSize(6);
    doc.text(cert.verification_code, pageWidth - 70, footerY + 24);

    doc.setTextColor(148, 163, 184);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7);
    doc.text('SkillFlash Digital Ledger', pageWidth - 70, footerY + 28);

    // Save with professional filename
    doc.save(`CERTIFICATE_SKILLFLASH_${cert.course_id.toUpperCase()}_${userName.toUpperCase().replace(/\s+/g, '_')}.pdf`);
};

