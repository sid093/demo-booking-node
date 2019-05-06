 module.exports = (srv) => {
	
	// Destructure other CDS entities
 	const {
 		Airports
 	} = cds.entities('app.flight.Airports')

 	// Pre Hooks
 	srv.before('CREATE', 'Airports', async(req) => {
 		const airport = req.data

 	})

 	// Post Hooks
 	srv.after('READ', 'Airports', each => {
 		
 	})

 }