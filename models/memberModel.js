import db from '../db.js';

// get semua anggota / semua warga berdasarkan id
export const getAllMembers = async (
  search = '',
  page = 1,
  limit = 10,
  sortBy = 'created_at',
  order = 'desc'
) => {
  const offset = (page - 1) * limit;

  const allowedSortBy = [
    'created_at',
    'nama',
    'nik',
    'tanggal_lahir',
    'jenis_kelamin',
    'hubungan',
  ];

  const allowedOrder = ['asc', 'desc'];

  if (!allowedSortBy.includes(sortBy)) {
    sortBy = 'created_at';
  }

  if (!allowedOrder.includes(order.toLowerCase())) {
    order = 'desc';
  }

  let query = `
    SELECT 
      family_members.*,
      families.no_kk,
      families.kepala_keluarga,
      families.alamat
    FROM family_members
    LEFT JOIN families ON family_members.family_id = families.id
  `;

  let countQuery = `
    SELECT COUNT(*) AS total
    FROM family_members
    LEFT JOIN families ON family_members.family_id = families.id
  `;

  const values = [];

  if (search) {
    query += `
      WHERE family_members.nama LIKE ?
      OR family_members.nik LIKE ?
      OR families.no_kk LIKE ?
      OR families.kepala_keluarga LIKE ?
    `;

    countQuery += `
      WHERE family_members.nama LIKE ?
      OR family_members.nik LIKE ?
      OR families.no_kk LIKE ?
      OR families.kepala_keluarga LIKE ?
    `;

    const keyword = `%${search}%`;
    values.push(keyword, keyword, keyword, keyword);
  }

  query += `
    ORDER BY ${sortBy} ${order.toUpperCase()}
    LIMIT ? OFFSET ?
  `;

  const [rows] = await db.query(query, [
    ...values,
    limit,
    offset,
  ]);

  const [[{ total }]] = await db.query(countQuery, values);

  return {
    data: rows,
    pagination: {
      total,
      current_page: page,
      per_page: limit,
      total_pages: Math.ceil(total / limit),
    },
  };
};

// get semua anggota by family_id
export const getMembersByFamilyId = async (familyId) => {
  const [rows] = await db.query(
    'SELECT * FROM family_members WHERE family_id = ? ORDER BY hubungan ASC, tanggal_lahir ASC',
    [familyId],
  );
  return rows;
};

// get satu anggota by id
export const getMemberById = async (id) => {
  const [rows] = await db.query(
    'SELECT * FROM family_members WHERE id = ?',
    [id],
  );

  if (rows.length === 0) {
    return null; // ngga ada anggota dengan id itu
  }
  return rows[0];
};

// create anggota baru
export const createMember = async (familyId, data) => {
  const {
    nik,
    nama,
    tempat_lahir,
    tanggal_lahir,
    jenis_kelamin,
    agama,
    pendidikan,
    pekerjaan,
    status_perkawinan,
    hubungan,
    kewarganegaraan,
    nama_ayah,
    nama_ibu,
  } = data;

  const [result] = await db.query(
    'INSERT INTO family_members (family_id, nik, nama, tempat_lahir, tanggal_lahir, jenis_kelamin, agama, pendidikan, pekerjaan, status_perkawinan, hubungan, kewarganegaraan, nama_ayah, nama_ibu) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
    [
      familyId,
      nik,
      nama,
      tempat_lahir,
      tanggal_lahir,
      jenis_kelamin,
      agama,
      pendidikan,
      pekerjaan,
      status_perkawinan,
      hubungan,
      kewarganegaraan,
      nama_ayah,
      nama_ibu,
    ],
  );
  return result.insertId; // ngembaliin id anggota yang baru dibuat
};

// update anggota by id
export const updateMember = async (id, data) => {
  const {
    nik,
    nama,
    tempat_lahir,
    tanggal_lahir,
    jenis_kelamin,
    agama,
    pendidikan,
    pekerjaan,
    status_perkawinan,
    hubungan,
    kewarganegaraan,
    nama_ayah,
    nama_ibu,
  } = data;

  const [result] = await db.query(
    'UPDATE family_members SET nik = ?, nama = ?, tempat_lahir = ?, tanggal_lahir = ?, jenis_kelamin = ?, agama = ?, pendidikan = ?, pekerjaan = ?, status_perkawinan = ?, hubungan = ?, kewarganegaraan = ?, nama_ayah = ?, nama_ibu = ? WHERE id = ?',
    [
      nik,
      nama,
      tempat_lahir,
      tanggal_lahir,
      jenis_kelamin,
      agama,
      pendidikan,
      pekerjaan,
      status_perkawinan,
      hubungan,
      kewarganegaraan,
      nama_ayah,
      nama_ibu,
      id,
    ],
  );
  return result.affectedRows;
};

// delete anggota by id
export const deleteMember = async (id) => {
  const [result] = await db.query(
    'DELETE FROM family_members WHERE id = ?',
    [id],
  );
  return result.affectedRows;
};
