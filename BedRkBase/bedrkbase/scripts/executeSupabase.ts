import { executeQuery, executeFunction } from '../utils/supabaseClient';

/**
 * Example of executing operations in Supabase
 */
async function main() {
  try {
    console.log('Fetching establishments data...');
    const establishments = await executeQuery('establishment', true);
    console.log(`Found ${establishments?.length || 0} establishments`);

    // Example of calling the get_all_establishments_for_user function
    console.log('Fetching a user ID...');
    const users = await executeQuery('users', true); // Use service role to query users
    const userId = users && users.length > 0 ? users[0].id : null;

    if (!userId) {
      console.warn('No users found in the database.');
      return;
    }

    if (!userId) {
      console.warn('No users found in the database.');
      return;
    }

    console.log('Calling get_all_establishments_for_user function...');
    const userEstablishments = await executeFunction('get_all_establishments_for_user', {
      p_user_id: userId
    });
    console.log(`Retrieved ${userEstablishments?.length || 0} establishments for user`);

    console.log('Execution completed successfully');
  } catch (error) {
    console.error('Error executing Supabase operations:', error);
  }
}

// Run the example
main();
