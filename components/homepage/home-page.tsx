"use client";

import React, { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  XCircle,
  QrCode,
  Scan,
  TrendingUp,
  Boxes,
  BellRing,
  RotateCcw,
  Check,
  ChevronDown,
  ChevronUp,
  Warehouse,
  ShieldCheck,
  BarChart3,
  Building2,
  Users,
  X
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-accent selection:text-accent-foreground">
      {/* 1. FLOATING NAVBAR */}
      <header className="sticky top-4 z-50 max-w-6xl mx-auto px-4">
        <nav className="flex items-center justify-between px-6 py-3 bg-card/80 backdrop-blur-md border border-border rounded-full shadow-sm">
          <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-primary-foreground text-sm font-black border overflow-hidden p-1 bg-white">
              <Image src={"/img/logo.jpeg"} width={300} height={300} alt="logo" className="object-cover h-full w-full"/>
            </div>
            Rappi App
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#fitur" className="hover:text-foreground transition-colors">Fitur Utama</a>
            <a href="#alur-kerja" className="hover:text-foreground transition-colors">Alur</a>
            <a href="#komparasi" className="hover:text-foreground transition-colors">Keunggulan</a>
          </div>
          <Link href={"/login"} className="px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity flex items-center gap-2 shadow-xs">
            Login <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </nav>
      </header>

      {/* 2. HERO SECTION */}
      <section className="pt-20 pb-16 px-4 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold mb-6 border border-border">
          Terintegrasi Real-Time Koperasi & SPPG
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance leading-tight mb-6">
          Manajemen Stok Presisi & Decision Support System
        </h1>
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 text-balance">
          Menghubungkan hasil panen petani lokal, kendali inventaris barcode koperasi, hingga pengadaan bahan baku SPPG secara otomatis dan akurat.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
          <Link href={"/login"} className="px-7 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-95 transition flex items-center gap-2 shadow-md">
            Mulai Terhubung <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Hero Visual Card with Metrics */}
        <div className="relative rounded-2xl bg-card border border-border shadow-xl text-left overflow-hidden w-full aspect-video">
            <Image
                src="/img/dashboard.png"
                alt="Dashboard KUD & SPPG"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1024px"
                className="object-cover object-top"
                priority
            />
        </div>
      </section>

      {/* 4. 6-CARD GRID: CORE CAPABILITIES */}
      <section id="fitur" className="py-20 px-4 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs uppercase font-bold tracking-widest text-primary mb-2">Kapabilitas Sistem</p>
          <h2 className="text-3xl font-bold tracking-tight">Semua yang Dibutuhkan untuk Efisiensi Ekosistem</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-card p-6 rounded-xl border border-border shadow-xs hover:border-primary/50 transition">
            <div className="w-10 h-10 rounded-lg bg-accent text-accent-foreground flex items-center justify-center mb-4">
              <QrCode className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-bold text-base mb-2">Metadata Barcode Otomatis</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Hasil panen yang lolos QC langsung di-generate barcode berisi: Nama Koperasi, tanggal registrasi, jenis komoditas, kuantitas, serta identitas petani.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-card p-6 rounded-xl border border-border shadow-xs hover:border-primary/50 transition">
            <div className="w-10 h-10 rounded-lg bg-accent text-accent-foreground flex items-center justify-center mb-4">
              <Boxes className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-bold text-base mb-2">Dual Inventory Segregation</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Sistem memisahkan barang etalase (jual umum) dan stok cadangan gudang yang otomatis dipublikasikan secara live untuk kebutuhan pasokan SPPG.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-card p-6 rounded-xl border border-border shadow-xs hover:border-primary/50 transition">
            <div className="w-10 h-10 rounded-lg bg-accent text-accent-foreground flex items-center justify-center mb-4">
              <BarChart3 className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-bold text-base mb-2">Decision Support System (DSS)</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              SPPG dapat memilih mitra koperasi terbaik berdasarkan algoritma perbandingan rating performa, kedekatan lokasi, dan kecukupan volume stok.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-card p-6 rounded-xl border border-border shadow-xs hover:border-primary/50 transition">
            <div className="w-10 h-10 rounded-lg bg-accent text-accent-foreground flex items-center justify-center mb-4">
              <BellRing className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-bold text-base mb-2">Early Warning Restock</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Sensor kuantitas minimum SPPG otomatis mengirim peringatan saat stok bahan pangan menipis, memicu pembuatan draft Purchase Order (PO).
            </p>
          </div>

          {/* Card 5 */}
          <div className="bg-card p-6 rounded-xl border border-border shadow-xs hover:border-primary/50 transition">
            <div className="w-10 h-10 rounded-lg bg-accent text-accent-foreground flex items-center justify-center mb-4">
              <Scan className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-bold text-base mb-2">Strict Scan-Out Verification</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Barang yang keluar gudang koperasi maupun yang masuk ke dapur pengolahan SPPG wajib melalui verifikasi barcode scanner sesuai surat jalan/invoice.
            </p>
          </div>

          {/* Card 6 */}
          <div className="bg-card p-6 rounded-xl border border-border shadow-xs hover:border-primary/50 transition">
            <div className="w-10 h-10 rounded-lg bg-accent text-accent-foreground flex items-center justify-center mb-4">
              <RotateCcw className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-bold text-base mb-2">Manajemen Retur Terstruktur</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Barang retur dari SPPG diklasifikasikan secara tegas: label <strong className="text-destructive font-semibold">Pemusnahan</strong> atau <strong className="text-primary font-semibold">Olah Kembali</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* 5. DARK SECTION: WORKFLOW ALUR KUD & SPPG */}
      <section id="alur-kerja" className="bg-background text-foreground py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs uppercase font-bold tracking-widest text-primary mb-2">Siklus Operasional</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Standard Operating Procedure Terintegrasi</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Sisi KUD */}
            <div className="bg-card rounded-2xl p-6 md:p-8 border border-border">
              <div className="flex items-center gap-3 mb-6">
                <span className="p-2 rounded-lg bg-primary/20 text-primary">
                  <Building2 className="w-5 h-5" />
                </span>
                <h3 className="text-xl font-bold">Protokol Koperasi (Hulu ke Gudang)</h3>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-muted/40 border border-border">
                  <p className="font-semibold">1. Intake & QC Panen Petani</p>
                  <p className="text-sm text-muted-foreground mt-1">Petani/peternak menyetor hasil bumi. Koperasi melakukan pemeriksaan standar mutu sebelum komoditas diterima.</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/40 border border-border">
                  <p className="font-semibold">2. Cetak Barcode Metadata</p>
                  <p className="text-sm text-muted-foreground mt-1">Komoditas lolos QC ditempeli label barcode metadata. Sistem otomatis mencatat penambahan stok.</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/40 border border-border">
                  <p className="font-semibold">3. Alokasi Display dan Gudang SPPG</p>
                  <p className="text-sm text-muted-foreground mt-1">Stok dibagi menjadi rak penjualan retail umum, dan stok cadangan sistem untuk diakses SPPG.</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/40 border border-border">
                  <p className="font-semibold">4. Validasi PO & Penerbitan Invoice</p>
                  <p className="text-sm text-muted-foreground mt-1">Koperasi menyetujui Purchase Order SPPG, menerbitkan invoice, dan melakukan scan-out saat kurir mengambil barang.</p>
                </div>
              </div>
            </div>

            {/* Sisi SPPG */}
            <div className="bg-card rounded-2xl p-6 md:p-8 border border-border" id="sppg-dss">
              <div className="flex items-center gap-3 mb-6">
                <span className="p-2 rounded-lg bg-primary/20 text-primary">
                  <ShieldCheck className="w-5 h-5" />
                </span>
                <h3 className="text-xl font-bold">Protokol SPPG (Hilir & Pengadaan)</h3>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-muted/40 border border-border">
                  <p className="font-semibold">1. Monitoring & DSS Koperasi Ranking</p>
                  <p className="text-sm text-muted-foreground mt-1">Ketika notifikasi stok menipis muncul, SPPG membuka katalog live koperasi dan memilih suplier berbasis rating performa.</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/40 border border-border">
                  <p className="font-semibold">2. Pengiriman PO & Konfirmasi Invoice</p>
                  <p className="text-sm text-muted-foreground mt-1">Pesanan divalidasi ke koperasi terpilih, mengunci alokasi stok sehingga tidak tertukar pesanan lain.</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/40 border border-border">
                  <p className="font-semibold">3. QC Penerimaan & Scan Barcode In</p>
                  <p className="text-sm text-muted-foreground mt-1">Saat muatan tiba, SPPG mengecek fisik dan memindai barcode. Stok otomatis masuk buku logistik internal.</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/40 border border-border">
                  <p className="font-semibold">4. Rekonsiliasi Bayar & Scan Pemakaian</p>
                  <p className="text-sm text-muted-foreground mt-1">Pembayaran dicocokkan dengan invoice aktual. Bahan baku yang ditarik ke dapur wajib di-scan keluar gudang.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. BEFORE VS AFTER COMPARISON */}
      <section id="komparasi" className="py-20 px-4 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs uppercase font-bold tracking-widest text-primary mb-2">Transformasi Operasional</p>
          <h2 className="text-3xl font-bold tracking-tight">Sebelum vs Sesudah Menggunakan Sistem</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Before */}
          <div className="p-6 rounded-2xl bg-card border border-border shadow-xs">
            <div className="flex items-center gap-2 mb-4 text-destructive font-bold text-lg">
              Sebelum Integrasi
            </div>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" /> 
                Pencatatan stok koperasi manual via buku ledger, rawan selisih fisik.
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" /> 
                SPPG sering kehabisan stok mendadak tanpa deteksi dini.
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" /> 
                Pemilihan koperasi bersifat subjektif tanpa metrik rating dan jarak.
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" /> 
                Barang retur tidak terklasifikasi, menyebabkan kerugian tak terlacak.
              </li>
            </ul>
          </div>

          {/* After */}
          <div className="p-6 rounded-2xl border border-primary/40 shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-2 mb-4 text-primary font-bold text-lg">
              Setelah Integrasi
            </div>
            <ul className="space-y-3 text-sm text-foreground">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" /> Barcode presisi dengan identitas petani & tanggal masuk gudang.
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" /> Peringatan otomatis stok minimum untuk pengadaan terencana.
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" /> Decision Support System berbasis reputasi dan kapasitas riil koperasi.
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" /> Pembagian jalur retur terstandar.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="border-t border-border bg-card py-10 px-4 text-xs text-muted-foreground">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 font-bold text-foreground">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-primary-foreground text-sm font-black border overflow-hidden p-1 bg-white">
              <Image src={"/img/logo.jpeg"} width={300} height={300} alt="logo" className="object-cover h-full w-full"/>
            </div>
            Rappi APP
          </div>
          <p>© 2026 Rappi All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}