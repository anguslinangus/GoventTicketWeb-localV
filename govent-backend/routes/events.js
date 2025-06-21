import express from 'express'
const router = express.Router()

import sequelize from '#configs/db.js'
import { QueryTypes } from 'sequelize'
// const { Cart } = sequelize.models

//傳入所有活動資料到list
//*如果後續使用event_id來對應，event的table也要用event.evnet_id=event_options.event_id
router.get('/', async function (req, res) {
  const posts = await sequelize.query(
    `
    SELECT event.*, 
    favorites.*,
    event_options.*,
    event.event_id AS pid,
    activity_category.id AS category_id,
    activity_category.activity_name AS category_name,
    event_options.event_id AS event_options_id
    FROM \`event\` 
    INNER JOIN \`activity_category\` 
    ON event.event_type_id = activity_category.id 
    LEFT JOIN \`event_options\` ON event.event_id = event_options.event_id 
    LEFT JOIN  \`favorites\` ON event.event_id = favorites.pid
    WHERE event.end_date > CURDATE() AND event.valid = 1
    GROUP BY
    event.id;`,
    {
      type: QueryTypes.SELECT,
    }
  )
  console.log('Database query result:', posts) // 查看從資料庫取得的資料
  // 標準回傳JSON
  return res.json({ status: 'success', data: { posts } })
  // const page = Number(req.query.page) || 1
  // const perpage = Number(req.query.perpage) || 10
  // const offset = (page - 1) * perpage
  // const limit = perpage
})

//傳入單筆資料至pid詳細頁
router.get('/:id', async (req, res) => {
  const id = req.params.id
  console.log('123', id)

  const posts = await sequelize.query(
    `
    SELECT event.*,
    activity_category.*,
    event_options.*,
    favorites.*,
    event.event_id AS pid,
    activity_category.id AS category_id,
    activity_category.activity_name AS category_name,
    event_options.event_id AS event_options_id,
    event_options.price
    FROM \`event\`
    INNER JOIN \`activity_category\`
    ON event.event_type_id = activity_category.id
    LEFT JOIN \`event_options\` ON event.event_id = event_options.event_id
    LEFT JOIN  \`favorites\` ON event.event_id = favorites.pid
    WHERE event.event_id = :eventId
    GROUP BY event.id;
    `,
    {
      replacements: { eventId: id },
      type: QueryTypes.SELECT,
    }
  )

  // 標準回傳JSON
  return res.json({ status: 'success', data: { posts } })
})

//抓取event_option資料
router.get('/option/:id', async (req, res) => {
  const id = req.params.id
  try {
    const result = await sequelize.query(
      'SELECT event_options.id AS option_id, event_options.*, event.* FROM `event_options` JOIN event ON event_options.event_id = event.event_id WHERE event_options.event_id = :eventId',
      {
        replacements: { eventId: id },
        type: QueryTypes.SELECT,
      }
    )

    return res.json({ status: 'success link favorites', data: { result } })
  } catch (error) {
    console.error('Error fetching data:', error)
    res.status(500).json({ status: 'error', message: 'Failed to fetch data.' })
  }
  // 標準回傳JSON
})
export default router
