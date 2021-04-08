const express = require('express')
const Sequelize = require('sequelize');
const app = express()
const port = 3000

const sequelize = new Sequelize('libre_sql_dev', 'SA', 'OVER_the_RAINBOW!', {
    host: '192.168.0.66',
    dialect: 'mssql',
    schema: 'auth',
    define: {
        freezeTableName: true
    }
});

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

const User = sequelize.define('user', { name: Sequelize.STRING });

sequelize.sync({ force: true })
    .then(() => {
    console.log(`Database & tables created!`);
    User.bulkCreate([
        { name: 'Logan' },
        { name: 'Addison' },
        { name: 'Ace' },
        ]).then(function() {
        return User.findAll();
        }).then(function(notes) {
        console.log(notes);
        });
    });

app.get('/:userId', async (req, res) => {
    console.log(req.params);
    let id = req.params.userId;
    let users = await User.findAll({
        where: {
            id: id
        }
    })
    res.send(`Hello ${users[0].name}`);
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})