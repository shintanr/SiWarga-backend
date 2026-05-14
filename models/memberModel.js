import db from "../db.js";  

// get semua anggota by family_id
export const getMembersByFamilyId = async(familyId) => {
    const [rows] = await db.query("SELECT * FROM family_members WHERE family_id = ? ORDER BY hubungan ASC, tanggal_lahir ASC", [familyId]);
    return rows;    
}

// get satu anggota by id
export const getMemberById = async (id) => {
    const [rows] = await db.query("SELECT * FROM family_members WHERE id = ?", [id]);

    if (rows.length === 0) {
        return null; // ngga ada anggota dengan id itu
    }
    return rows[0];
}

// create anggota baru
export const createMember = async (familyId, data) => {
    const { nik, nama, tempat_lahir, tanggal_lahir, jenis_kelamin, agama, pendidikan,pekerjaan, status_perkawinan, hubungan, kewarganegaraan, nama_ayah, nama_ibu} = data;

    const [result] = await db.query (
        "INSERT INTO family_members (family_id, nik, nama, tempat_lahir, tanggal_lahir, jenis_kelamin, agama, pendidikan, pekerjaan, status_perkawinan, hubungan, kewarganegaraan, nama_ayah, nama_ibu) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [familyId, nik, nama, tempat_lahir, tanggal_lahir, jenis_kelamin, agama, pendidikan, pekerjaan, status_perkawinan, hubungan, kewarganegaraan, nama_ayah, nama_ibu]
    )
    return result.insertId; // ngembaliin id anggota yang baru dibuat
}

// update anggota by id
export const updateMember = async (id, data) => {
    const { nik, nama, tempat_lahir, tanggal_lahir, jenis_kelamin, agama, pendidikan,pekerjaan, status_perkawinan, hubungan, kewarganegaraan, nama_ayah, nama_ibu} = data;

    const [result] = await db.query(
        "UPDATE family_members SET nik = ?, nama = ?, tempat_lahir = ?, tanggal_lahir = ?, jenis_kelamin = ?, agama = ?, pendidikan = ?, pekerjaan = ?, status_perkawinan = ?, hubungan = ?, kewarganegaraan = ?, nama_ayah = ?, nama_ibu = ? WHERE id = ?",
        [nik, nama, tempat_lahir, tanggal_lahir, jenis_kelamin, agama, pendidikan, pekerjaan, status_perkawinan, hubungan, kewarganegaraan, nama_ayah, nama_ibu, id]
    );
    return result.affectedRows;
}

// delete anggota by id
export const deleteMember = async (id) => {
    const [result] = await db.query("DELETE FROM family_members WHERE id = ?", [id]);
    return result.affectedRows;
}