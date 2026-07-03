import { Document, Packer, Paragraph, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle, TextRun } from 'docx';

export async function GET() {
  const bullet = (text: string) => new Paragraph({ text: `• ${text}`, spacing: { after: 100 } });
  const title3 = (text: string) => new Paragraph({ text, heading: HeadingLevel.HEADING_3, spacing: { after: 100 } });

  const doc = new Document({
    sections: [{
      children: [
        new Paragraph({ text: 'Panduan Admin Dashboard - De Ritz L\'Atelier', heading: HeadingLevel.HEADING_1, spacing: { after: 400 } }),
        new Paragraph({ text: 'Pengenalan Sistem Manajemen', heading: HeadingLevel.HEADING_2, spacing: { after: 200 } }),
        new Paragraph({ text: 'Selamat datang di dashboard admin De Ritz L\'Atelier! Panduan ini akan memandu Anda melalui semua fitur untuk mengelola katalog produk, koleksi, dan pesanan.', spacing: { after: 400 } }),

        // Section 1
        new Paragraph({ text: '1. Halaman Utama - Katalog (Catalogue)', heading: HeadingLevel.HEADING_2, spacing: { after: 200 } }),
        title3('Akses'),
        bullet('Klik tab "CATALOGUE" di menu navigasi'),
        bullet('URL: /admin/dashboard'),
        new Paragraph({ text: '' }),

        title3('Tombol Aksi untuk Setiap Produk'),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Tombol', bold: true })] })], shading: { fill: 'E6E6E6' }, borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } } }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Fungsi', bold: true })] })], shading: { fill: 'E6E6E6' }, borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } } }),
              ],
            }),
            new TableRow({ children: [new TableCell({ children: [new Paragraph('EDIT')], borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } } }), new TableCell({ children: [new Paragraph('Ubah detail produk')], borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } } })] }),
            new TableRow({ children: [new TableCell({ children: [new Paragraph('HIDE')], borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } } }), new TableCell({ children: [new Paragraph('Sembunyikan dari website')], borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } } })] }),
            new TableRow({ children: [new TableCell({ children: [new Paragraph('PUBLISH')], borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } } }), new TableCell({ children: [new Paragraph('Publikasikan ke website')], borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } } })] }),
            new TableRow({ children: [new TableCell({ children: [new Paragraph('MARK SOLD OUT')], borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } } }), new TableCell({ children: [new Paragraph('Tandai terjual habis')], borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } } })] }),
            new TableRow({ children: [new TableCell({ children: [new Paragraph('DELETE')], borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } } }), new TableCell({ children: [new Paragraph('Hapus produk')], borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } } })] }),
          ],
        }),
        new Paragraph({ text: '' }),

        title3('Menambahkan Produk Baru'),
        bullet('NAME: Nama produk (harus unik)'),
        bullet('COLLECTION: Pilih koleksi yang sesuai'),
        bullet('DESCRIPTION: Detail produk'),
        bullet('BASE PRICE (IDR): Harga dalam Rupiah'),
        bullet('IMAGES: Upload minimal 1 gambar'),
        bullet('CHECKBOXES: Highlight/Promo/Publish/Sold Out'),
        new Paragraph({ text: '' }),

        // Section 2
        new Paragraph({ text: '2. Koleksi (Collections)', heading: HeadingLevel.HEADING_2, spacing: { after: 200 } }),
        title3('Koleksi yang Ada'),
        bullet('Chinese New Year 2026 (42 produk)'),
        bullet('Merona Kebaya Peranakan (18 produk)'),
        new Paragraph({ text: '' }),

        // Section 3
        new Paragraph({ text: '3. Pesanan (Orders)', heading: HeadingLevel.HEADING_2, spacing: { after: 200 } }),
        title3('Workflow Pesanan'),
        new Paragraph({ text: 'Pending → Processing → Shipped → Delivered → Refunded (jika perlu)', spacing: { after: 200 } }),
        bullet('MARK PROCESSED: Tandai sedang diproses'),
        bullet('MARK SHIPPED: Tandai sudah dikirim + nomor resi'),
        bullet('MARK DELIVERED: Tandai sudah diterima'),
        bullet('MARK REFUNDED: Tandai refund'),
        bullet('DELETE ORDER: Hapus dari database'),
        new Paragraph({ text: '' }),

        // Tips
        new Paragraph({ text: 'TIPS & TRIK', heading: HeadingLevel.HEADING_2, spacing: { after: 200 } }),
        title3('✓ Lakukan'),
        bullet('Selalu upload gambar berkualitas tinggi'),
        bullet('Tulis deskripsi yang detail dan menarik'),
        bullet('Gunakan "MARK SOLD OUT" untuk produk terbatas'),
        bullet('Simpan riwayat pesanan untuk referensi'),
        new Paragraph({ text: '' }),

        title3('✗ Jangan'),
        bullet('Jangan hapus koleksi jika masih ada produk di dalamnya'),
        bullet('Jangan gunakan DELETE untuk pesanan - gunakan MARK REFUNDED'),
        new Paragraph({ text: '' }),

        // Support
        new Paragraph({ text: 'DUKUNGAN', heading: HeadingLevel.HEADING_2, spacing: { after: 200 } }),
        bullet('WhatsApp: +62 813-3583-8367'),
        bullet('Instagram DM: @deritz'),
        bullet('Email ke administrator sistem'),
        new Paragraph({ text: '' }),

        new Paragraph({ text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', spacing: { after: 200 } }),
        new Paragraph({ text: 'Versi: 1.0 | Tanggal: 3 Juli 2026 | Platform: De Ritz L\'Atelier Admin Dashboard' }),
      ],
    }],
  });

  const buffer = await Packer.toBuffer(doc);

  return new Response(buffer as any, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': 'attachment; filename="PANDUAN_ADMIN_DASHBOARD.docx"',
    },
  });
}
