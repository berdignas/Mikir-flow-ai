-- ================================================
-- MIKIR FLOW AI - SUPABASE DUMMY PROJECT SEED DATA
-- ================================================

-- Seed Initial Users
INSERT INTO public.users (name, email, role, status) VALUES
  ('Alex Rivers', 'alex@mikirflow.ai', 'pm', 'Active'),
  ('Dev Team Lead', 'dev@mikirflow.ai', 'developer', 'Active'),
  ('Klien PT Javas', 'client@javas.co.id', 'client', 'Active')
ON CONFLICT (email) DO NOTHING;

-- Seed Dummy Project 1: E-Commerce Marketplace Platform
INSERT INTO public.projects (id, title, client_name, prd_text) VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'E-Commerce Marketplace Platform', 'PT Javas', 'Judul: E-Commerce Marketplace Platform\n1. Fitur Utama: Autentikasi Pengguna\n- Login Multi-Role\n- OTP WhatsApp\n2. Fitur Utama: Payment & Checkout\n- QRIS Payment\n- VA Bank Transfer');

-- Seed Nodes for Project 1
INSERT INTO public.nodes (id, project_id, type, position_x, position_y, title, subtitle, phase, status, goals, user_story, items) VALUES
  ('root', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'rootNode', 0, 0, 'E-Commerce Core System', 'PT Javas - Mapping Fitur & Alur Aplikasi', NULL, NULL, 'Platform e-commerce B2C skala nasional', NULL, '[]'),
  ('f_1', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'featureNode', -300, 180, 'Manajemen Akun & Auth', 'Selesai', 'FASE 1', 'Selesai', 'Modul autentikasi aman multi-role', 'Sebagai user saya ingin login dengan OTP WhatsApp', '[]'),
  ('f_2', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'featureNode', 0, 180, 'Katalog & Keranjang Belanja', 'Direncanakan', 'FASE 1', 'Direncanakan', 'Modul pencarian produk & wishlist', 'Sebagai pembeli saya ingin menabung produk di wishlist', '[]'),
  ('f_3', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'featureNode', 300, 180, 'Payment Gateway & Checkout', 'Sedang Dikerjakan', 'FASE 1', 'Sedang Dikerjakan', 'Modul transaksi online QRIS & VA', 'Sebagai pembeli saya ingin bayar via QRIS instan', '[]'),
  ('s_1_1', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'subfeatureNode', -300, 360, 'SUB FITUR AUTH', NULL, NULL, NULL, NULL, NULL, '["Login & Register", "OTP WhatsApp API", "Manajer Alamat"]'),
  ('s_3_1', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'subfeatureNode', 300, 360, 'SUB FITUR PAYMENT', NULL, NULL, NULL, NULL, NULL, '["Integrasi QRIS Payment", "Virtual Account Bank", "Hitung Ongkir RajaOngkir"]');

-- Seed Edges for Project 1
INSERT INTO public.edges (id, project_id, source, target) VALUES
  ('e-root-f1', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'root', 'f_1'),
  ('e-root-f2', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'root', 'f_2'),
  ('e-root-f3', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'root', 'f_3'),
  ('e-f1-s1', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'f_1', 's_1_1'),
  ('e-f3-s3', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'f_3', 's_3_1');
