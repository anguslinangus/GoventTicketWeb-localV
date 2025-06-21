import express from 'express'
const router = express.Router()

// // import sequelize from '#configs/db.js'
// // import { QueryTypes } from 'sequelize'

// // router.get('/', async function(req, res){
// //     const posts = await sequelize.query('SELECT * FROM `event` WHERE id = 1 ',{type: QueryTypes.SELECT,
// //     })

// //     return res.json({status:'success',data:{posts}})  //用物件抓data值
// //     });

// // export default router;

// import express from 'express'
// const router = express.Router()

// import sequelize from '#configs/db.js'
// import { QueryTypes } from 'sequelize'

// router.get('/', async function (req, res) {
//   try {
//     const posts = await sequelize.query(
//       `
//             SELECT event_type.*, event.*
//             FROM event_type
//             JOIN event ON event_id = event.id
//             WHERE event_id = id
//         `, {
//             type: QueryTypes.SELECT,
//         });

//         return res.json({
//             status: 'success',
//             data: {
//                 posts
//             }
//         });
//     } catch (error) {
//         console.error('Error:', error);
//         return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
//     }
// });

// export default router;

//     return res.json({
//       status: 'success',
//       data: {
//         posts,
//       },
//     })
//   } catch (error) {
//     console.error('Error:', error)
//     return res
//       .status(500)
//       .json({ status: 'error', message: 'Internal Server Error' })
//   }
// })

export default router
