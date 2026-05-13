import db from "../db.js";

// GET semua keluarga

export const getAllFamilies = async () => {
     const [rows] = await db.query("SELECT * FROM families ORDER BY created_at DESC");
     return rows;
}

// GET keluarga berdasarkan ID
export const getFamilyById = async (id) => {
    const [families] = await db.query("SELECT * FROM families WHERE id = ?", [id]);

    if (families.length === 0) {
        return null; // ngga ada keluarga dengan id itu
    } 

    const family = families[0];

    const [members] = await db.query("SELECT * FROM family_members WHERE family_id = ?", [id]);
    return { ...family, members: members };
}

// POST / Create keluarga baru