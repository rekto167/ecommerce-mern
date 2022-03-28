const express = require('express');
const connectDB = require('./config/db')
const app = express();

connectDB();

// initial middleware
app.use(express.json({extended:true}));

app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server listening port ${PORT}`));