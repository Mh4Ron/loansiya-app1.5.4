import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Buffer } from 'buffer';

export default function SignedAgreementPreview({ route }) {
  const { clientData, signatureBase64 } = route.params;

  useEffect(() => {
    (async () => {
      try {
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([595, 842]);
        const { width, height } = page.getSize();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const today = new Date().toLocaleDateString();

        const text = `
Signed Agreement

Client Name: ${clientData.name}
Client ID: ${clientData.cid}
Date Signed: ${today}

I, ${clientData.name}, hereby acknowledge the following:

• I have submitted all required documents.
• I understand this is not a final loan agreement.
• I confirm all information is true.
• I consent to credit scoring and evaluation.
• I allow contact for updates and clarifications.
• I intend to proceed with the application process.

Signature:
        `;

        page.drawText(text.trim(), {
          x: 50,
          y: height - 100,
          size: 12,
          font,
          color: rgb(0, 0, 0),
          lineHeight: 14,
        });

        // ✅ Embed Signature from Base64
        const pngImage = await pdfDoc.embedPng(signatureBase64);
        page.drawImage(pngImage, {
          x: 100,
          y: 200,
          width: 200,
          height: 80,
        });

        const pdfBytes = await pdfDoc.save();
        const base64Pdf = Buffer.from(pdfBytes).toString('base64');
        const filePath = FileSystem.documentDirectory + `SignedAgreement_${clientData.cid}.pdf`;

        await FileSystem.writeAsStringAsync(filePath, base64Pdf, {
          encoding: FileSystem.EncodingType.Base64,
        });

        await Sharing.shareAsync(filePath, {
          mimeType: 'application/pdf',
          dialogTitle: 'Signed Agreement',
        });
      } catch (error) {
        console.error('PDF generation failed:', error);
        Alert.alert('❌ PDF Error', 'Failed to generate or share the PDF.');
      }
    })();
  }, []);

  return null;
}
