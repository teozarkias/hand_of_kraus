-- Hand of Kraus — copies the paintings and tarot cards that used to be
-- hardcoded in lib/paintings.ts and lib/tarot.ts into the database, in the
-- same order they appeared on the site. Run once, after schema.sql.
-- Safe to re-run: existing rows are left untouched.

insert into public.paintings
  (id, title, image, medium, size, year, price, available, featured, original_for_sale, wide, print_sizes, sort_order)
values
  ('the-upper-plains', 'The Upper Plains', '/paintings/The_Upper_Plains.jpg', 'Ink on paper', '20.9 × 23 cm', '2026', 500, true, false, true, false, '[{"id":"a4","label":"Large","dims":"29.6 × 32.5 cm","price":20},{"id":"a5","label":"Small","dims":"20.9 × 23 cm","price":10}]'::jsonb, 10),
  ('dead-sea', 'Dead Sea', '/paintings/Dead_Sea.jpg', 'Ink on paper', '29.7 x 42 cm', '2026', 1200, true, false, true, true, '[{"id":"a4","label":"A4","dims":"21 × 29.7 cm","price":20},{"id":"a3","label":"A3","dims":"29.7 × 42 cm","price":35}]'::jsonb, 20),
  ('items-ii', 'ITEMS II', '/paintings/ITEMS-II.jpg', 'Ink on paper', '21 × 29.7 cm', '2026', 700, true, true, true, false, null, 30),
  ('lost-sanctuary', 'Lost Sanctuary', '/paintings/Lost_sanctuary.jpg', 'Ink on paper', '21 × 29.7 cm', '2026', 750, true, false, true, false, null, 40),
  ('requiem', 'Requiem', '/paintings/Requiem.jpg', 'Ink on paper', '14.7 × 14.7 cm', '2026', 400, true, false, true, false, '[{"id":"large","label":"Large","dims":"20.8 × 20.8 cm","price":20},{"id":"small","label":"Small","dims":"14.7 × 14.7 cm","price":10}]'::jsonb, 50),
  ('immortality', 'Immortality', '/paintings/Immortality.jpg', 'Ink on paper', '21 × 29.7 cm', '2026', 800, true, false, true, false, null, 60),
  ('kingdom', 'Kingdom', '/paintings/Kingdom.jpg', 'Ink on paper', '21 × 29.7 cm', '2026', 700, true, false, true, false, null, 70),
  ('items', 'ITEMS I', '/paintings/ITEMS.jpg', 'Ink on paper', '21 × 29.7 cm', '2026', 700, true, false, true, false, null, 80),
  ('killers-of-the-southern-oracle', 'Killers of the Southern Oracle', '/paintings/killers_of_the_southern_oracle.jpg', 'Ink on paper', '21 × 29.7 cm', '2026', 500, true, true, true, false, null, 90),
  ('whatever-happened-to-the-dragonmaker', 'Whatever happened to the Dragonmaker?', '/paintings/wtv-happened-to-dragonmaker.jpg', 'Ink on paper', '21 × 29.7 cm', '2026', 650, true, false, true, false, null, 100),
  ('hymn-for-the-mother-of-tears', 'Hymn for the Mother of Tears', '/paintings/hymn_for_the_mother_of_tears.jpg', 'Ink on paper', '21 × 29.7 cm', '2025', 500, true, false, true, false, null, 110),
  ('VESSELS', 'Vessels II', '/paintings/VESSELS.jpg', 'Ink on paper', '21 × 29.7 cm', '2025', 650, true, false, true, false, null, 120),
  ('grave-of-mensis', 'Grave of Mensis', '/paintings/grave_of_mensis.jpg', 'Ink on paper', '50 × 70 cm', '2024', 710, true, true, false, false, null, 130),
  ('the_witch_of_Rothwood', 'The witch of Rothwood', '/paintings/The_witch_of_Rothwood.jpg', 'Ink on paper', '48 × 65 cm', '2025', 780, true, false, false, false, null, 140),
  ('vessels', 'Vessels I', '/paintings/VESSELS_1.jpg', 'Ink on paper', '21 × 29.7 cm', '2025', 650, true, false, true, false, null, 150),
  ('forbidden_cave', 'Forbidden cave', '/paintings/Forbidden_cave.jpg', 'Ink on paper', '48 × 65 cm', '2025', 780, true, false, false, false, null, 160),
  ('i-shall-remain', 'I Shall Remain', '/paintings/I_shall_remain.jpg', 'Ink on paper', '48 × 65 cm', '2025', 780, true, false, false, false, null, 170)
on conflict (id) do nothing;

insert into public.tarot_cards
  (id, title, price, image, preview_image, image_thumb, preview_image_thumb, sort_order)
values
  ('the-lovers', 'The Lovers', 35, '/tarot/LOVERS2.jpg', '/tarot/The_Lovers.jpg', '/tarot-thumbs/LOVERS2.jpg', '/tarot-thumbs/The_Lovers.jpg', 10),
  ('the-lovers-ii', 'The Lovers?', 35, '/tarot/LOVERS1.jpg', '/tarot/The_Lovers2.jpg', '/tarot-thumbs/LOVERS1.jpg', '/tarot-thumbs/The_Lovers2.jpg', 20),
  ('the-magician-ii', 'The Magician', 35, '/tarot/The_Magician4.jpg', '/tarot/The_Magician.jpg', '/tarot-thumbs/The_Magician4.jpg', '/tarot-thumbs/The_Magician.jpg', 30),
  ('the-magician', 'The Magician?', 35, '/tarot/The_Magician3.jpg', '/tarot/The_Magician2.jpg', '/tarot-thumbs/The_Magician3.jpg', '/tarot-thumbs/The_Magician2.jpg', 40),
  ('the-sun-ii', 'The Sun', 35, '/tarot/THE_SUN_1.jpg', '/tarot/The_Sun.jpg', '/tarot-thumbs/THE_SUN_1.jpg', '/tarot-thumbs/The_Sun.jpg', 50),
  ('the-sun', 'The Sun?', 35, '/tarot/THE_SUN_2.jpg', '/tarot/The_Sun2.jpg', '/tarot-thumbs/THE_SUN_2.jpg', '/tarot-thumbs/The_Sun2.jpg', 60),
  ('the-tower', 'The Tower', 35, '/tarot/TOWER2.jpg', '/tarot/The_Tower.jpg', '/tarot-thumbs/TOWER2.jpg', '/tarot-thumbs/The_Tower.jpg', 70),
  ('the-tower-ii', 'The Tower?', 35, '/tarot/TOWER1.jpg', '/tarot/The_Tower2.jpg', '/tarot-thumbs/TOWER1.jpg', '/tarot-thumbs/The_Tower2.jpg', 80),
  ('the-emperor', 'The Emperor', 35, '/tarot/the_emperor.jpg', '/tarot/the_emperor1.jpg', null, null, 90),
  ('the-emperor-ii', 'The Emperor?', 35, '/tarot/the_emperor2.jpg', '/tarot/the_emperor3.jpg', null, null, 100)
on conflict (id) do nothing;
