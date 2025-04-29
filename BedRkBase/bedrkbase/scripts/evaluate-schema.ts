/**
 * Database Schema Evaluation Script
 * 
 * This script connects to the database and evaluates the schema against
 * best practices defined in snippets.md.
 */
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function evaluateSchema() {
  console.log('🔍 Evaluating database schema against best practices...');
  
  try {
    // 1. Collect schema information
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    
    // 2. Evaluate primary key conventions
    const primaryKeys = await prisma.$queryRaw`
      SELECT kcu.table_name, kcu.column_name
      FROM information_schema.table_constraints tco
      JOIN information_schema.key_column_usage kcu 
        ON kcu.constraint_name = tco.constraint_name
        AND kcu.constraint_schema = tco.constraint_schema
      WHERE tco.constraint_type = 'PRIMARY KEY'
        AND tco.table_schema = 'public'
    `;
    
    // 3. Check foreign key relationships
    const foreignKeys = await prisma.$queryRaw`
      SELECT
        tc.table_schema, 
        tc.constraint_name, 
        tc.table_name, 
        kcu.column_name, 
        ccu.table_schema AS foreign_table_schema,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name 
      FROM information_schema.table_constraints AS tc 
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_schema = 'public'
    `;
    
    // 4. Format findings as Markdown
    const report = generateReport(tables, primaryKeys, foreignKeys);
    
    // 5. Save report
    const reportPath = path.join(__dirname, '..', 'database-evaluation.md');
    fs.writeFileSync(reportPath, report);
    
    console.log(`✅ Schema evaluation complete. Report saved to ${reportPath}`);
  } catch (error) {
    console.error('❌ Error evaluating schema:', error);
  } finally {
    await prisma.$disconnect();
  }
}

function generateReport(tables: any, primaryKeys: any, foreignKeys: any) {
  return `# Database Schema Evaluation Report
Generated: ${new Date().toISOString()}

## Tables Overview

${tables.map((t: any) => `- ${t.table_name}`).join('\n')}

## Primary Key Analysis

| Table | Primary Key | UUID? | Recommendation |
|-------|-------------|-------|----------------|
${primaryKeys.map((pk: any) => 
  `| ${pk.table_name} | ${pk.column_name} | ${pk.column_name === 'id' ? '✅' : '❌'} | ${pk.column_name !== 'id' ? 'Consider standardizing to "id"' : 'Meets standard'} |`
).join('\n')}

## Foreign Key Analysis

| Table | Column | References | Naming Convention |
|-------|--------|------------|-------------------|
${foreignKeys.map((fk: any) => 
  `| ${fk.table_name} | ${fk.column_name} | ${fk.foreign_table_name}.${fk.foreign_column_name} | ${fk.column_name.endsWith('_id') ? '✅' : '❌'} |`
).join('\n')}

## Recommendations

1. Ensure all primary keys use consistent naming (preferably "id")
2. Foreign keys should follow the pattern {tableName}_id
3. Consider adding indexes for frequently queried columns
4. Verify that timestamps (created_at, updated_at) are present on all tables
5. Check that proper constraints (NOT NULL, etc.) are applied

## Next Steps

1. Run \`npx prisma db pull\` to ensure Prisma schema matches the database
2. Update any inconsistencies identified in this report
3. Document schema decisions in the project documentation
`;
}

// Execute if run directly
if (require.main === module) {
  evaluateSchema();
}

export { evaluateSchema };
