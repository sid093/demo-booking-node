 module.exports = (srv) => {
	
	// Destructure other CDS entities
 	const {
 		Airports
 	} = cds.entities('app.flight.Airports')

 	// Pre Hooks
 	srv.before('CREATE', 'Airports', async(req) => {
 		const airport = req.data
 		// return req.error(400, 'Not allowed right now.');
 		// if (!order.amount || order.amount <= 0) return req.error(400, 'Order at least 1 book')
 		// const tx = cds.transaction(req)
 		// const affectedRows = await tx.run(
 		// 	UPDATE(Books)
 		// 	.set({
 		// 		stock: {
 		// 			'-=': order.amount
 		// 		}
 		// 	})
 		// 	.where({
 		// 		stock: {
 		// 			'>=': order.amount
 		// 		},
 		// 		/*and*/
 		// 		ID: order.book_ID
 		// 	})
 		// )
 		// if (affectedRows === 0) req.error(409, "Sold out, sorry")
 	})

 	// Post Hooks
 	srv.after('READ', 'Airports', each => {
 		each.Country = "Hellow World!";
 	})

 }