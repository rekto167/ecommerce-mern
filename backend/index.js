const express = require('express');
const connectDB = require('./config/db')
const app = express();

connectDB();

app.get('/', (req, res) => {
    res.send('API Running');
})

app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));

const PORT = process.env.PORT || 5001
app.listen(PORT, () => console.log(`Server listening port ${PORT}`));