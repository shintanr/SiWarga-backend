import db from '../db.js';

export const getDashboardStats = async () => {
  const [[{ total_kk }]] = await db.query(
    'SELECT COUNT(*) AS total_kk FROM families',
  );

  const [[{ total_warga }]] = await db.query(
    'SELECT COUNT(*) AS total_warga FROM family_members',
  );

  const [[{ kk_belum_upload }]] = await db.query(`
    SELECT COUNT(*) AS kk_belum_upload
     FROM families
    WHERE kk_file IS NULL OR kk_file = ''`);

  const [jenis_kelamin] = await db.query(
    'SELECT jenis_kelamin, COUNT(*) AS jumlah FROM family_members GROUP BY jenis_kelamin',
  );

  const [agama] = await db.query(
    'SELECT agama, COUNT(*) AS jumlah FROM family_members GROUP BY agama ORDER BY jumlah DESC',
  );

  const [status_perkawinan] = await db.query(
    'SELECT status_perkawinan, COUNT(*) AS jumlah FROM family_members GROUP BY status_perkawinan ORDER BY jumlah DESC',
  );

  const [pendidikan] = await db.query(
    "SELECT pendidikan, COUNT(*) AS jumlah FROM family_members GROUP BY pendidikan HAVING pendidikan IS NOT NULL AND pendidikan != '' ORDER BY jumlah DESC",
  );

  const [pekerjaan] = await db.query(
    "SELECT pekerjaan, COUNT(*) AS jumlah FROM family_members WHERE pekerjaan IS NOT NULL AND pekerjaan != '' GROUP BY pekerjaan ORDER BY jumlah DESC",
  );

  return {
    total_kk,
    total_warga,
    kk_belum_upload,
    jenis_kelamin,
    agama,
    status_perkawinan,
    pendidikan,
    pekerjaan,
  };
};
