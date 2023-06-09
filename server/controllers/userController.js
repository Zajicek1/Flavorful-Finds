// MySQL database connection
const db = require('../../db-connector').pool;

// Read Users
exports.read = (req, res) => {

    // Get a connection from the connection pool.
    db.getConnection((err, connection) => {
        if (err) {
            console.error('An error occurred while getting the connection', err);
            res.status(500).send('An error occurred');
            return;
        }

        // Execute a SQL query to fetch all user data.
        connection.query('SELECT * FROM Users ', (err, results) => {
            // Once the query is done and results returned, release 
            // the database connection
            connection.release();

            if (err) {
                console.error('An error occurred while executing the query', err);
                res.status(500).send('An error occurred');
            } else {
                // Pass the fetched user data to the view.
                res.render('users', { users: results });
            }
        });
    });
};

// Search Users
exports.search = (req, res) => {

    // Get a connection from the connection pool.
    db.getConnection((err, connection) => {
        if (err) {
            console.error('An error occurred while getting the connection', err);
            res.status(500).send('An error occurred');
            return;
        }

        // Create a SQL query to fetch user data that matches the search query.
        const query = 'SELECT * FROM Users WHERE name LIKE ?';
        const queryData = ['%' + req.query.q + '%'];

        connection.query(query, queryData, (err, results) => {
            // Once the query is done and results returned, release 
            // the database connection
            connection.release();

            if (err) {
                console.error('An error occurred while executing the query', err);
                res.status(500).send('An error occurred');
            } else {
                // Pass the fetched user data to the view.
                res.render('users', { users: results });
            }
        });
    });
};

// Create User
exports.create = (req, res) => {
    const { username, email, password } = req.body; // extract user details from request body
  
    db.getConnection((err, connection) => {
      	if (err) {
        	console.error('An error occurred while getting the connection', err);
        	res.status(500).json({ success: false, message: 'An error occurred' });
        	return;
      	}
  
      	connection.query('INSERT INTO Users (username, email, password) VALUES (?, ?, ?)',
        	[username, email, password], (err, results) => {
          		connection.release();
  
          		if (err) {
            		console.error('An error occurred while executing the query', err);
            		res.status(500).json({ success: false, message: 'An error occurred while creating the user.' });
          		} else {
            		res.status(200).json({ success: true, message: 'User successfully created!' });
          	}
        });
    });
};

// Update User
exports.update = (req, res) => {
    const { id, username, email, password } = req.body;

    db.getConnection((err, connection) => {
        if (err) {
            console.error('An error occurred while getting the connection', err);
            res.status(500).json({ success: false, message: 'An error occurred' });
            return;
        }

        connection.query('UPDATE Users SET username = ?, email = ?, password = ? WHERE userID = ?',
            [username, email, password, id], (err, results) => {
                connection.release();

                if (err) {
                    console.error('An error occurred while executing the query', err);
                    res.status(500).json({ success: false, message: 'An error occurred while updating the user.' });
                } else {
                    res.status(200).json({ success: true, message: 'User successfully updated!' });
            }
        });
    });
};

// Delete User
exports.delete = (req, res) => {
    const id = req.body.id;

    db.getConnection((err, connection) => {
        if (err) {
            console.error('An error occurred while getting the connection', err);
            res.status(500).json({ success: false, message: 'An error occurred' });
            return;
        }

        connection.query('DELETE FROM Users WHERE userID = ?',
            [id], (err, results) => {
                connection.release();

                if (err) {
                    console.error('An error occurred while executing the query', err);
                    res.status(500).json({ success: false, message: 'An error occurred while deleting the user.' });
                } else {
                    res.status(200).json({ success: true, message: 'User successfully deleted!' });
            }
        });
    });
};