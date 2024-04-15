import type { ResultSetHeader, RowDataPacket } from "mysql2";

import { pool } from "@/db/index";

export interface Property extends RowDataPacket {
  id: number;
  broker_id: number;
  address: string;
  zipcode: number;
  type: string;
  price?: number;
  rooms?: number;
  area?: number;
  built?: number;
}

/**
 * Retrieves all properties from database.
 */
export async function getProperties(): Promise<Property[]> {
  const [res] = await pool.execute<Property[]>(
    "SELECT * FROM bookings_db.hs_property"
  );

  return res;
}

/**
 * Retrieves all properties from a certain zipcode.
 */
export async function getPropertiesByZipcode(
  zipcode: number
): Promise<Property[]> {
  const [res] = await pool.execute<Property[]>(
    `SELECT * FROM bookings_db.hs_property
        WHERE zipcode = :zipcode`,
    { zipcode }
  );

  return res;
}

/**
 * Creates a property with the given parameters.
 *
 * @returns id of newly created property
 */
export async function createProperty(
  broker_id: number,
  address: string,
  zipcode: number,
  type: string,
  price?: number,
  rooms?: number,
  area?: number,
  built?: number
): Promise<number> {
  const [res] = await pool.execute<ResultSetHeader>(
    `INSERT INTO bookings_db.hs_property (broker_id, address, zipcode, type, price, rooms, area, year_built)
        VALUES (:broker_id, :address, :zipcode, :type, :price, :rooms, :area, :year_built)`,
    { broker_id, address, zipcode, type, price, rooms, area, built }
  );

  return res.insertId;
}

/**
 * Deletes a property with given id.
 */
export async function deleteProperty(id: number): Promise<void> {
  await pool.execute("DELETE FROM bookings_db.hs_property WHERE id = :id", {
    id,
  });
}

/**
 * Update certain fields of a property with a given id.
 */
export async function updateProperty(
  id: number,
  address?: string,
  zipcode?: number,
  type?: string,
  price?: number,
  rooms?: number,
  area?: number,
  built?: number
): Promise<void> {
  await pool.execute(
    `UPDATE bookings_db.hs_property
        SET address = :address,
            zipcode = :zipcode,
            type = :type,
            price = :price,
            rooms = :rooms,
            area = :area,
            year_built = :built
        WHERE id = :id`,
    { address, zipcode, type, price, rooms, area, built, id }
  );
}
