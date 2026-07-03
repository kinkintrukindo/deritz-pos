import { Document, Packer, Paragraph, HeadingLevel, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle, UnorderedList, ListItem } from 'docx';
import { writeFileSync } from 'fs';
import { join } from 'path';

export async function GET() {
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            text: 'Panduan Admin Dashboard - De Ritz L\'Atelier',
            heading: HeadingLevel.HEADING_1,
            thematicBreak: false,
            spacing: { after: 400 },
          }),

          new Paragraph({
            text: 'Pengenalan Sistem Manajemen',
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 },
          }),

          new Paragraph({
            text: 'Selamat datang di dashboard admin De Ritz L\'Atelier! Panduan ini akan memandu Anda melalui semua fitur yang tersedia untuk mengelola katalog produk, koleksi, dan pesanan.',
            spacing: { after: 400 },
          }),

          // Section 1
          new Paragraph({
            text: '1. Halaman Utama - Katalog (Catalogue)',
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 },
          }),

          new Paragraph({
            text: 'Akses',
            heading: HeadingLevel.HEADING_3,
            spacing: { after: 100 },
          }),

          new UnorderedList({
            children: [
              new ListItem({
                children: [new Paragraph('Klik tab "CATALOGUE" di menu navigasi')],
              }),
              new ListItem({
                children: [new Paragraph('URL: /admin/dashboard')],
              }),
            ],
            spacing: { after: 200 },
          }),

          new Paragraph({
            text: 'Tombol Aksi untuk Setiap Produk',
            heading: HeadingLevel.HEADING_3,
            spacing: { after: 100 },
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ text: 'Tombol', bold: true })],
                    borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } },
                    shading: { fill: 'E6E6E6' },
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: 'Fungsi', bold: true })],
                    borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } },
                    shading: { fill: 'E6E6E6' },
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph('EDIT')],
                    borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } },
                  }),
                  new TableCell({
                    children: [new Paragraph('Ubah detail produk')],
                    borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } },
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph('HIDE')],
                    borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } },
                  }),
                  new TableCell({
                    children: [new Paragraph('Sembunyikan dari website')],
                    borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } },
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph('PUBLISH')],
                    borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } },
                  }),
                  new TableCell({
                    children: [new Paragraph('Publikasikan ke website')],
                    borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } },
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph('MARK SOLD OUT')],
                    borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } },
                  }),
                  new TableCell({
                    children: [new Paragraph('Tandai terjual habis')],
                    borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } },
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph('DELETE')],
                    borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } },
                  }),
                  new TableCell({
                    children: [new Paragraph('Hapus produk')],
                    borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } },
                  }),
                ],
              }),
            ],
            spacing: { after: 400 },
          }),

          new Paragraph({
            text: 'Menambahkan Produk Baru',
            heading: HeadingLevel.HEADING_3,
            spacing: { after: 100 },
          }),

          new UnorderedList({
            children: [
              new ListItem({
                children: [new Paragraph('NAME: Nama produk (harus unik)')],
              }),
              new ListItem({
                children: [new Paragraph('COLLECTION: Pilih koleksi yang sesuai')],
              }),
              new ListItem({
                children: [new Paragraph('DESCRIPTION: Detail produk')],
              }),
              new ListItem({
                children: [new Paragraph('BASE PRICE (IDR): Harga dalam Rupiah')],
              }),
              new ListItem({
                children: [new Paragraph('IMAGES: Upload minimal 1 gambar')],
              }),
              new ListItem({
                children: [new Paragraph('CHECKBOXES: Highlight/Promo/Publish/Sold Out')],
              }),
            ],
            spacing: { after: 400 },
          }),

          // Section 2
          new Paragraph({
            text: '2. Koleksi (Collections)',
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 },
          }),

          new Paragraph({
            text: 'Koleksi yang Ada:',
            heading: HeadingLevel.HEADING_3,
            spacing: { after: 100 },
          }),

          new UnorderedList({
            children: [
              new ListItem({
                children: [new Paragraph('Chinese New Year 2026 (42 produk)')],
              }),
              new ListItem({
                children: [new Paragraph('Merona Kebaya Peranakan (18 produk)')],
              }),
            ],
            spacing: { after: 400 },
          }),

          // Section 3
          new Paragraph({
            text: '3. Pesanan (Orders)',
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 },
          }),

          new Paragraph({
            text: 'Workflow Pesanan Standar:',
            heading: HeadingLevel.HEADING_3,
            spacing: { after: 100 },
          }),

          new Paragraph({
            text: 'Pending → Processing → Shipped → Delivered → Refunded (jika perlu)',
            spacing: { after: 200 },
          }),

          new UnorderedList({
            children: [
              new ListItem({
                children: [new Paragraph('MARK PROCESSED: Tandai sedang diproses')],
              }),
              new ListItem({
                children: [new Paragraph('MARK SHIPPED: Tandai sudah dikirim + nomor resi')],
              }),
              new ListItem({
                children: [new Paragraph('MARK DELIVERED: Tandai sudah diterima')]},
              }),
              new ListItem({
                children: [new Paragraph('MARK REFUNDED: Tandai refund')],
              }),
              new ListItem({
                children: [new Paragraph('DELETE ORDER: Hapus dari database')]},
              }),
            ],
            spacing: { after: 400 },
          }),

          // Tips
          new Paragraph({
            text: 'TIPS & TRIK',
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 },
          }),

          new Paragraph({
            text: '✓ Lakukan:',
            heading: HeadingLevel.HEADING_3,
            spacing: { after: 100 },
          }),

          new UnorderedList({
            children: [
              new ListItem({
                children: [new Paragraph('Selalu upload gambar berkualitas tinggi')],
              }),
              new ListItem({
                children: [new Paragraph('Tulis deskripsi yang detail dan menarik')],
              }),
              new ListItem({
                children: [new Paragraph('Gunakan "MARK SOLD OUT" untuk produk terbatas')],
              }),
              new ListItem({
                children: [new Paragraph('Simpan riwayat pesanan untuk referensi')],
              }),
            ],
            spacing: { after: 200 },
          }),

          new Paragraph({
            text: '✗ Jangan:',
            heading: HeadingLevel.HEADING_3,
            spacing: { after: 100 },
          }),

          new UnorderedList({
            children: [
              new ListItem({
                children: [new Paragraph('Jangan hapus koleksi jika masih ada produk di dalamnya')],
              }),
              new ListItem({
                children: [new Paragraph('Jangan gunakan DELETE untuk pesanan - gunakan MARK REFUNDED')],
              }),
            ],
            spacing: { after: 400 },
          }),

          // Support
          new Paragraph({
            text: 'DUKUNGAN',
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 },
          }),

          new UnorderedList({
            children: [
              new ListItem({
                children: [new Paragraph('WhatsApp: +62 813-3583-8367')],
              }),
              new ListItem({
                children: [new Paragraph('Instagram DM: @deritz')],
              }),
              new ListItem({
                children: [new Paragraph('Email ke administrator sistem')],
              }),
            ],
            spacing: { after: 400 },
          }),

          new Paragraph({
            text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
            spacing: { after: 200 },
          }),

          new Paragraph({
            text: 'Versi: 1.0 | Tanggal: 3 Juli 2026 | Platform: De Ritz L\'Atelier Admin Dashboard',
            size: 20,
            color: '666666',
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);

  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': 'attachment; filename="PANDUAN_ADMIN_DASHBOARD.docx"',
    },
  });
}
