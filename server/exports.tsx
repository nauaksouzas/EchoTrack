import React from 'react';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, BorderStyle } from 'docx';
import { renderToStream } from '@react-pdf/renderer';
import { Document as PdfDocument, Page as PdfPage, Text as PdfText, View as PdfView, StyleSheet } from '@react-pdf/renderer';

export async function generateDocx(report: any): Promise<Buffer> {
    const doc = new Document({
        sections: [
            {
                properties: {},
                children: [
                    new Paragraph({
                        text: "Weekly Status Report",
                        heading: HeadingLevel.HEADING_1,
                    }),
                    new Paragraph({
                        text: `EchoTrack / KSP Dominion Group · ${report.cycle?.name || 'Cycle'} · ${new Date(report.submittedAt || new Date()).toLocaleDateString()}`,
                    }),
                    new Paragraph({ text: "" }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "Good afternoon, ", bold: true }),
                            new TextRun(report.student?.coach?.name || 'Coach'),
                            new TextRun(",\n\nI hope you're having a wonderful day. I am eager to chat with you about "),
                            new TextRun({ text: report.weeklyTopic || 'my week', bold: true }),
                            new TextRun("."),
                        ],
                    }),
                    new Paragraph({ text: "" }),
                    new Paragraph({ text: "Highlights:", heading: HeadingLevel.HEADING_2 }),
                    ...(report.highlights ? report.highlights.split('\n').map((h: string) => new Paragraph({ text: `• ${h}` })) : []),
                    new Paragraph({ text: "" }),
                    new Paragraph({ text: "Academic Progress:", heading: HeadingLevel.HEADING_2 }),
                    new Paragraph({ text: report.academicProgress || '' }),
                    new Paragraph({ text: "" }),
                    new Paragraph({ text: "Class Experience:", heading: HeadingLevel.HEADING_2 }),
                    new Paragraph({ text: report.classExperience || '' }),
                    new Paragraph({ text: "" }),
                    new Paragraph({ text: "Challenges:", heading: HeadingLevel.HEADING_2 }),
                    new Paragraph({ text: `Tags: ${report.challengesTags}` }),
                    new Paragraph({ text: report.challengesText || '' }),
                    new Paragraph({ text: "" }),
                    new Paragraph({ text: "Support Needed:", heading: HeadingLevel.HEADING_2 }),
                    new Paragraph({ text: report.supportNeeded || 'None' }),
                    new Paragraph({ text: "" }),
                    new Paragraph({ text: "In Closing:", heading: HeadingLevel.HEADING_2 }),
                    new Paragraph({ text: report.reflection || '' }),
                    new Paragraph({ text: "" }),
                    new Paragraph({ text: "Goals for Next Week:", heading: HeadingLevel.HEADING_2 }),
                    new Paragraph({ text: report.goals || '' }),
                    new Paragraph({ text: "" }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: `Name: ${report.student?.name}`, break: 1 }),
                            new TextRun({ text: `Email: ${report.student?.email}`, break: 1 }),
                        ]
                    })
                ],
            },
        ],
    });

    return await Packer.toBuffer(doc);
}

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica' },
  heading: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  subheading: { fontSize: 14, marginBottom: 20, color: '#6B7280' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  text: { fontSize: 12, marginBottom: 5 },
  bold: { fontWeight: 'bold' }
});

export const ReportPdf = ({ report }: { report: any }) => (
  <PdfDocument>
    <PdfPage size="A4" style={styles.page}>
      <PdfText style={styles.heading}>Weekly Status Report</PdfText>
      <PdfText style={styles.subheading}>EchoTrack / KSP Dominion Group</PdfText>

      <PdfText style={styles.text}>Good afternoon,</PdfText>
      <PdfText style={styles.text}>I am eager to chat with you about {report.weeklyTopic}.</PdfText>
      
      <PdfText style={styles.sectionTitle}>Highlights</PdfText>
      <PdfText style={styles.text}>{report.highlights}</PdfText>
      
      <PdfText style={styles.sectionTitle}>Class Experience</PdfText>
      <PdfText style={styles.text}>{report.classExperience}</PdfText>
      
      <PdfText style={styles.sectionTitle}>In Closing</PdfText>
      <PdfText style={styles.text}>{report.reflection}</PdfText>
      
      <PdfText style={styles.text}>{'\n'}Name: {report.student?.name}</PdfText>
      <PdfText style={styles.text}>Email: {report.student?.email}</PdfText>
    </PdfPage>
  </PdfDocument>
);

export async function generatePdf(report: any) {
  return await renderToStream(<ReportPdf report={report} />);
}
