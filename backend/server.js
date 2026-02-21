const express = require('express');
const cors = require('cors');
const sql = require('mssql/msnodesqlv8');

const app = express();
app.use(cors());

const config = {
    connectionString: 'Driver={ODBC Driver 17 for SQL Server};Server=localhost;Database=Sushi;Trusted_Connection=yes;'
};

app.get('/api/order', async (req, res) => {
    try {
        const result = await sql.query("SELECT TOP 1 * FROM SushiMenu ORDER BY NEWID()");
        res.json(result.recordset[0]);
    } catch (error) {
        console .log("Error", err);
    }
});


app.listen(3000, async () => {
   console.log("Server running on port 3000.") 

   try {
    await sql.connect(config);
    console.log("Connected succesfully!")
   } catch (err) {
    console.log("Can't connect to DB. Error:", err);
   }
});