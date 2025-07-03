const {connect} = require('../configuration/sqlserver')
const route=require('../routes/userroutes')
const path = require('path');
const sql = require('mssql');
const multerconfig=require('../multerconfig/config')
const fs=require('fs')
const getUser = async (req, res) => {
  try {
    const pool = await connect();
    const result = await pool.request()
      .query('SELECT * FROM EMPs');


    res.json({ message: 'User data fetched successfully',users: result.recordset });
  } catch (err) {
    console.error('Error getting user:', err);
    res.status(500).json({ error: 'Failed to get user' });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await connect();
    const result = await pool.request()
      .input('EmpId', sql.Int, id)
      .query('DELETE FROM EMPs WHERE EmpId = @EmpId');
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};
const updateUser = async(req, res) => {
  const { id } = req.params;
  const {EmpName ,Address,Phonenumber} = req.body;
  
  try{
    const pool = await connect();
    const result = await pool.request()
  .input('EmpId',sql.Int, id)
  .input('EmpName',sql.VarChar, EmpName)
  .input('Address',sql.VarChar, Address)
  .input('Phonenumber',sql.VarChar, Phonenumber)
  .query('UPDATE EMPs  SET EmpName = @EmpName, Address = @Address, Phonenumber = @Phonenumber WHERE EmpId = @EmpId')
  res.json({message: 'User updated successfully'})
  }
  catch(err) {
    console.error('Error updating user:', err);
    res.status(500).json({ error: 'Failed to update user' });
  }
};
const Insertusers = async(req, res) =>{
   const {EmpName ,Address,Phonenumber} = req.body;
   try{
    const pool = await connect();
    const result= await pool.request()
     .input('EmpName', sql.VarChar, EmpName)
      .input('Address', sql.VarChar, Address)
      .input('Phonenumber', sql.VarChar, Phonenumber)
    .query(' INSERT INTO EMPs (EmpName, Address, Phonenumber) VALUES (@EmpName, @Address, @Phonenumber)')
    res.json({message: 'User inserted succesfully'})
   }
   catch(err) {
    console.error('Error inserted user:', err);
    res.status(500).json({ error: 'Failed to insert user' });

   }
};
const findUserByPhonenumber = async(req, res) => {
    const { Phonenumber } = req.params;
    try{
        const pool = await connect();
        const result = await pool.request()
        .input('Phonenumber' ,sql.VarChar, Phonenumber)
       .query('select * from EMPs where Phonenumber=@Phonenumber')
       res.json({message:'data fetched sucessfully',data:result.recordset})
    }
    catch{
        console.error('error fetching:',err)
        res.status(500).json({error:'failed to fetch'})
    }
}
const search = async(req, res)=>{
    const {search} = req.params;
 
    try{
        const pool =await connect();
        const result = await pool.request()
          .input('searchValue', sql.VarChar, `%${search}%`)
      .query(`
        SELECT * FROM EMPs
        WHERE 
          Phonenumber LIKE @searchValue OR
          Address LIKE @searchValue OR
          EmpName LIKE @searchValue
      `);

    res.json(result.recordset);
    }
    catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
}

   
const fileupdate = async (req, res) => {
  try {

     const Filepath = path.resolve(req.file.path);
     const { EmpName, Address, Phonenumber } = req.body;   
    const pool = await connect();
    await pool.request()
      .input('EmpName', sql.VarChar, EmpName)
      .input('Address', sql.VarChar, Address)
      .input('Phonenumber', sql.VarChar, Phonenumber)
      .input('Filepath', sql.VarChar, Filepath)
      .query(`
        INSERT INTO EMPs (EmpName, Address, Phonenumber, Filepath)
        VALUES (@EmpName, @Address, @Phonenumber, @Filepath)
      `);

    res.json({ message: '✅ File uploaded and path saved to DB' });
  } catch (err) {
    console.error('❌ DB Error:', err);
    res.status(500).send('Failed to save data');
  }
};

module.exports = { fileupdate };

module.exports={
    getUser,
deleteUser,
findUserByPhonenumber,
search,
updateUser,
Insertusers,
fileupdate
}
