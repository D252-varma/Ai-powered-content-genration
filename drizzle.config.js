import("drizzle-kit").Config;
export default {
    schema: "./utils/schema.tsx",
    dialect: 'postgresql',
    dbCredentials: {
      url:'postgresql://neondb_owner:npg_IVvGF1g6Ymqz@ep-yellow-term-a84wvlgk-pooler.eastus2.azure.neon.tech/neondb?sslmode=require'
    }
  };