import {db} from "@vercel/postgres";
import { users, products } from '../lib/placeholder-data';

const client = await db.connect();

async function seedUsers() {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    await client.sql`
        CREATE TABLE IF NOT EXISTS users (
            id INT PRIMARY KEY,
            username VARCHAR(255) NOT NULL,
            password TEXT NOT NULL,
            phoneNumber TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            age INT NOT NULL
        );
    `;

    const insertedUsers = await Promise.all(
        users.map(async (user) => {
            return client.sql`
                INSERT INTO users (id, username, password, phoneNumber, email, age)
                VALUES (${user.id}, ${user.username}, ${user.password}, ${user.phoneNumber}, ${user.email}, ${user.age})
                ON CONFLICT (id) DO NOTHING;
            `;
        }),
    );

    return insertedUsers;
}

async function seedProducts() {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    await client.sql`
        CREATE TABLE IF NOT EXISTS products (
            id INT PRIMARY KEY,
            category NVARCHAR(255) NOT NULL,
            name VARCHAR(255) NOT NULL,
            price INT NOT NULL,
            qty INT NOT NULL
        );
    `;

    const insertedProducts = await Promise.all(
        products.map(async (product) => {
            return client.sql`
                INSERT INTO products (id, category, name, price, qty)
                VALUES (${product.id}, ${product.category}, ${product.name}, ${product.price}, ${product.qty})
                ON CONFLICT (id) DO NOTHING;
            `;
        }),
    );

    return insertedProducts;
}

export async function GET() {
    try {
        await client.sql`BEGIN`;
        await seedUsers();
        await seedProducts();
        await client.sql`COMMIT`;
        return Response.json({ message: 'Database seeded successfully' });
    } catch (error) {
        await client.sql`ROLLBACK`;
        return Response.json({ error }, { status: 500 });
    }
}