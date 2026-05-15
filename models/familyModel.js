import db from '../db.js';

// GET semua keluarga

export const getAllFamilies = async () => {
  const [rows] = await db.query(
    'SELECT * FROM families ORDER BY created_at DESC',
  );
  return rows;
};

// GET keluarga berdasarkan ID
export const getFamilyById = async (id) => {
  const [families] = await db.query(
    'SELECT * FROM families WHERE id = ?',
    [id],
  );

  if (families.length === 0) {
    return null; // ngga ada keluarga dengan id itu
  }

  const family = families[0];

  const [members] = await db.query(
    'SELECT * FROM family_members WHERE family_id = ?',
    [id],
  );
  return { ...family, members: members };
};
// POST / Create keluarga baru
export const createFamily = async (data) => {
  const {
    no_kk,
    kepala_keluarga,
    alamat,
    rt,
    rw,
    kelurahan,
    kecamatan,
    kota,
    provinsi,
    kode_pos,
    kk_file,
  } = data;

  const [result] = await db.query(
    'INSERT INTO families (no_kk, kepala_keluarga, alamat, rt, rw, kelurahan, kecamatan, kota, provinsi, kode_pos, kk_file) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      no_kk,
      kepala_keluarga,
      alamat,
      rt,
      rw,
      kelurahan,
      kecamatan,
      kota,
      provinsi,
      kode_pos,
      kk_file
    ],
  );
  return result.insertId; // ngembaliin id keluarga yang baru dibuat
};

export const updateFamily = async (id, data) => {
  const {
    no_kk,
    kepala_keluarga,
    alamat,
    rt,
    rw,
    kelurahan,
    kecamatan,
    kota,
    provinsi,
    kode_pos,
    kk_file,
  } = data;

  const [result] = await db.query(
    'UPDATE families SET no_kk = ?, kepala_keluarga = ?, alamat = ?, rt = ?, rw = ?, kelurahan = ?, kecamatan = ?, kota = ?, provinsi = ?, kode_pos = ?, kk_file = ? WHERE id = ?',
    [
      no_kk,
      kepala_keluarga,
      alamat,
      rt,
      rw,
      kelurahan,
      kecamatan,
      kota,
      provinsi,
      kode_pos,
      kk_file,
      id,
    ],
  );

  return result.affectedRows; // ngembaliin true kalo update berhasil
};

export const deleteFamily = async (id) => {
  const [result] = await db.query(
    'DELETE FROM families WHERE id = ?',
    [id],
  );
  return result.affectedRows; // ngembaliin true kalo delete berhasil
};

// update kk_file

export const updateKkFile = async (id, filename) => {
  const [result] = await db.query(
    'UPDATE families SET kk_file = ? WHERE id = ?',
    [filename, id],
  );
    return result.affectedRows; // ngembaliin true kalo update berhasil
};
