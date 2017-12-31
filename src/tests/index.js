// NOTE: Require tests in order they should run

// Models
require('./models/user.spec');

// Server and Routes
require('./routes/index.spec');
require('./routes/sessions.spec');
require('./routes/users.spec');
