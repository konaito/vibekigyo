Next.jsで日本語のMarkdownをPDFにダウンロードできるTypeScriptライブラリをご紹介いたします。

## 1. **md-to-pdf** (最推奨)

Next.jsとの相性が良く、日本語対応も優秀です。

**インストール:**
```bash
npm install md-to-pdf
```

**API Route作成例:**
```typescript
// pages/api/markdown-to-pdf.ts または app/api/markdown-to-pdf/route.ts
import { mdToPdf } from 'md-to-pdf';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { markdown } = req.body;
    
    const pdf = await mdToPdf(
      { content: markdown },
      {
        pdf_options: {
          format: 'A4',
          margin: '20mm',
          printBackground: true,
          preferCSSPageSize: true
        },
        stylesheet: [
          'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap'
        ],
        css: `
          body { 
            font-family: 'Noto Sans JP', sans-serif; 
            line-height: 1.6;
          }
        `
      }
    );

    if (pdf) {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="document.pdf"');
      res.send(pdf.content);
    }
  } catch (error) {
    res.status(500).json({ error: 'PDF生成に失敗しました' });
  }
}
```

**フロントエンド使用例:**
```typescript
// components/MarkdownToPdf.tsx
'use client';
import { useState } from 'react';

export default function MarkdownToPdf() {
  const [markdown, setMarkdown] = useState('# こんにちは、世界！\n\n日本語のテストです。');
  
  const downloadPdf = async () => {
    try {
      const response = await fetch('/api/markdown-to-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markdown })
      });
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'document.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('PDF生成エラー:', error);
    }
  };

  return (
    <div className="p-4">
      <textarea
        value={markdown}
        onChange={(e) => setMarkdown(e.target.value)}
        className="w-full h-64 p-2 border rounded"
        placeholder="Markdownを入力してください..."
      />
      <button
        onClick={downloadPdf}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        PDFダウンロード
      </button>
    </div>
  );
}
```

## 2. **React-PDF + react-markdown** (クライアントサイド)

ブラウザで完結するソリューションです。

**インストール:**
```bash
npm install @react-pdf/renderer react-markdown
```

**使用例:**
```typescript
// components/ReactPdfGenerator.tsx
'use client';
import { Document, Page, Text, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import ReactMarkdown from 'react-markdown';
import { useState } from 'react';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 20,
    fontFamily: 'Helvetica'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  }
});

const MyDocument = ({ markdown }: { markdown: string }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.section}>
        {markdown}
      </Text>
    </Page>
  </Document>
);

export default function ReactPdfGenerator() {
  const [markdown, setMarkdown] = useState('# 日本語テスト\n\nこれは日本語のテストです。');
  
  return (
    <div className="p-4">
      <textarea
        value={markdown}
        onChange={(e) => setMarkdown(e.target.value)}
        className="w-full h-64 p-2 border rounded"
      />
      <PDFDownloadLink
        document={<MyDocument markdown={markdown} />}
        fileName="document.pdf"
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 inline-block"
      >
        {({ blob, url, loading, error }) =>
          loading ? '生成中...' : 'PDFダウンロード'
        }
      </PDFDownloadLink>
    </div>
  );
}
```

## 3. **jsPDF + markdown-it** (軽量ソリューション)

**インストール:**
```bash
npm install jspdf markdown-it
npm install @types/markdown-it
```

**使用例:**
```typescript
// utils/markdownToPdf.ts
import jsPDF from 'jspdf';
import MarkdownIt from 'markdown-it';

export const generatePdfFromMarkdown = (markdown: string, filename: string = 'document.pdf') => {
  const md = new MarkdownIt();
  const html = md.render(markdown);
  
  // HTMLからテキストを抽出（簡易版）
  const text = html.replace(/<[^>]*>/g, '');
  
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  // 日本語フォント設定（必要に応じて）
  doc.setFont('helvetica');
  doc.setFontSize(12);
  
  // テキストを追加
  const splitText = doc.splitTextToSize(text, 180);
  doc.text(splitText, 15, 15);
  
  doc.save(filename);
};
```

## 日本語対応のポイント

### フォント設定
```typescript
// md-to-pdf用の設定
const options = {
  stylesheet: [
    'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap'
  ],
  css: `
    body { 
      font-family: 'Noto Sans JP', 'Hiragino Sans', 'Yu Gothic', sans-serif;
    }
  `
};
```

### PDF設定
```typescript
const pdfOptions = {
  format: 'A4',
  margin: '20mm',
  printBackground: true,
  preferCSSPageSize: true,
  displayHeaderFooter: false
};
```

## 推奨

**Next.jsで日本語対応**なら：

1. **md-to-pdf** - サーバーサイドでの高品質生成
2. **React-PDF** - クライアントサイドでの軽量生成

どちらも日本語フォントの設定を適切に行えば、美しい日本語PDFが生成できます。

[md-to-pdf](https://www.npmjs.com/package/md-to-pdf) は特にPuppeteerベースなので、Webフォントや複雑なレイアウトも正確に再現できるためお勧めです。